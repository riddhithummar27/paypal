'use client';

import React, { useState, useMemo, useRef, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, GridReadyEvent } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { FoodListing } from '@/types/foodloop';
import {
  Download,
  Search,
  Filter,
  CheckCircle,
  Truck,
  Building,
  Flame,
  AlertCircle,
} from 'lucide-react';

interface NgoLogisticsGridProps {
  listings: FoodListing[];
  onClaimBatch: (listingId: string) => void;
}

export const NgoLogisticsGrid: React.FC<NgoLogisticsGridProps> = ({
  listings,
  onClaimBatch,
}) => {
  const gridRef = useRef<AgGridReact>(null);
  const [quickFilterText, setQuickFilterText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // AG Grid Column Definitions
  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        headerName: 'Batch ID',
        field: 'id',
        width: 140,
        pinned: 'left',
        cellRenderer: (params: any) => (
          <span className="font-mono text-xs font-bold text-blue-400">
            {params.value}
          </span>
        ),
      },
      {
        headerName: 'Food Surplus Description',
        field: 'title',
        flex: 2,
        minWidth: 220,
        cellRenderer: (params: any) => (
          <div className="font-semibold text-white truncate">{params.value}</div>
        ),
      },
      {
        headerName: 'Donor & Facility',
        field: 'donorName',
        flex: 1.5,
        minWidth: 180,
        cellRenderer: (params: any) => (
          <div>
            <div className="text-xs font-medium text-slate-200">{params.value}</div>
            <div className="text-[10px] text-slate-400">{params.data?.donorType}</div>
          </div>
        ),
      },
      {
        headerName: 'Category',
        field: 'category',
        width: 110,
        cellRenderer: (params: any) => (
          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
            {params.value}
          </span>
        ),
      },
      {
        headerName: 'Portions',
        field: 'portions',
        width: 100,
        type: 'numericColumn',
        cellRenderer: (params: any) => (
          <span className="font-bold text-emerald-400 text-xs">
            {params.value} meals
          </span>
        ),
      },
      {
        headerName: 'Storage Condition',
        field: 'storageTemp',
        width: 160,
        cellRenderer: (params: any) => {
          const isHot = params.value?.includes('Hot');
          return (
            <span
              className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded font-medium ${
                isHot
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
              }`}
            >
              {isHot && <Flame className="w-3 h-3 text-amber-400" />}
              {params.value}
            </span>
          );
        },
      },
      {
        headerName: 'Cutoff Window',
        field: 'pickupDeadlineMinutes',
        width: 140,
        cellRenderer: (params: any) => {
          const mins = params.value;
          const isCritical = mins <= 45;
          return (
            <span
              className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                isCritical
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                  : 'bg-slate-800 text-slate-300'
              }`}
            >
              {mins} mins left
            </span>
          );
        },
      },
      {
        headerName: 'Distance',
        field: 'distanceKm',
        width: 110,
        cellRenderer: (params: any) => (
          <span className="text-xs text-slate-300">{params.value} km</span>
        ),
      },
      {
        headerName: 'Status',
        field: 'status',
        width: 130,
        cellRenderer: (params: any) => {
          const status = params.value;
          if (status === 'available') {
            return (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Available
              </span>
            );
          } else if (status === 'in_transit') {
            return (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                In Transit
              </span>
            );
          } else {
            return (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-slate-400">
                Rescued
              </span>
            );
          }
        },
      },
      {
        headerName: 'Action',
        width: 130,
        pinned: 'right',
        cellRenderer: (params: any) => {
          const isAvailable = params.data?.status === 'available';
          return (
            <button
              disabled={!isAvailable}
              onClick={() => onClaimBatch(params.data?.id)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                isAvailable
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              {isAvailable ? 'Claim Batch' : 'Allocated'}
            </button>
          );
        },
      },
    ],
    [onClaimBatch]
  );

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      sortable: true,
      filter: true,
      resizable: true,
    };
  }, []);

  const onExportCsv = useCallback(() => {
    if (gridRef.current) {
      gridRef.current.api.exportDataAsCsv({
        fileName: `foodloop-rescue-inventory-${new Date().toISOString().split('T')[0]}.csv`,
      });
    }
  }, []);

  // Filter listings by category
  const rowData = useMemo(() => {
    if (selectedCategory === 'ALL') return listings;
    return listings.filter((item) => item.category === selectedCategory);
  }, [listings, selectedCategory]);

  const totalPortions = useMemo(
    () => listings.reduce((acc, curr) => acc + curr.portions, 0),
    [listings]
  );
  const criticalCount = useMemo(
    () => listings.filter((i) => i.pickupDeadlineMinutes <= 45 && i.status === 'available').length,
    [listings]
  );

  return (
    <section className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
              AG Grid Powered
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Enterprise Food Rescue & NGO Logistics Matrix
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time surplus dispatch ledger for shelter operators, food banks, and municipal zero-waste monitors. Sort, filter, search, and export data in 1 click.
          </p>
        </div>

        <button
          onClick={onExportCsv}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 shadow-md transition-all"
        >
          <Download className="w-4 h-4 text-emerald-400" />
          <span>Export to CSV</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400">Total Live Batches</span>
          <div className="text-2xl font-black text-white mt-1">{listings.length}</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400">Total Portions In Play</span>
          <div className="text-2xl font-black text-emerald-400 mt-1">{totalPortions} meals</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400">Critical Cutoffs (&lt;45m)</span>
          <div className="text-2xl font-black text-rose-400 mt-1 flex items-center gap-2">
            {criticalCount}
            {criticalCount > 0 && <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />}
          </div>
        </div>
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400">Active Shelters Registered</span>
          <div className="text-2xl font-black text-blue-400 mt-1">3 Facilities</div>
        </div>
      </div>

      {/* Grid Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900 p-4 rounded-xl border border-slate-800">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search batches, donors, allergens, facilities..."
            value={quickFilterText}
            onChange={(e) => setQuickFilterText(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-slate-400">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
          >
            <option value="ALL">All Categories</option>
            <option value="Meals">Cooked Meals</option>
            <option value="Bakery">Bakery</option>
            <option value="Produce">Produce</option>
            <option value="Dairy">Dairy</option>
          </select>
        </div>
      </div>

      {/* AG Grid Component */}
      <div className="ag-theme-quartz-dark h-[460px] w-full rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          quickFilterText={quickFilterText}
          animateRows={true}
          pagination={true}
          paginationPageSize={10}
          paginationPageSizeSelector={[10, 20, 50]}
        />
      </div>
    </section>
  );
};
