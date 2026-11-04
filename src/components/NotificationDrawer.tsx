'use client';

import React, { useState, useEffect } from 'react';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  link?: string;
  is_read: boolean;
  created_at: string;
}

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (page: string) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose, onNavigate }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchNotifications = () => {
    fetch('/api/notifications')
      .then((res) => res.json())
      .then((data) => {
        if (data.notifications) {
          setNotifications(data.notifications);
          setUnreadCount(data.unreadCount || data.notifications.filter((n: any) => !n.is_read).length);
        }
      })
      .catch((err) => console.warn('Could not fetch notifications:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const handleMarkRead = async (id: string, link?: string) => {
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId: id }),
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
      if (link && onNavigate) {
        onClose();
        if (link.includes('donor')) onNavigate('donor-portal');
        else if (link.includes('ngo')) onNavigate('ngo-hub');
        else if (link.includes('agent')) onNavigate('ai-rescue-agent');
        else if (link.includes('marketplace')) onNavigate('explore-food');
      }
    } catch {
      // Non-blocking
    }
  };

  const handleMarkAllRead = async () => {
    notifications.forEach((n) => {
      if (!n.is_read) handleMarkRead(n.id);
    });
    setUnreadCount(0);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200">
        
        {/* Header */}
        <div className="p-5 bg-[#001d59] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">notifications</span>
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-tight">Notification Center</h3>
              <p className="text-xs text-white/70">
                {unreadCount > 0 ? `${unreadCount} unread alert${unreadCount > 1 ? 's' : ''}` : 'All caught up'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-[11px] font-bold text-[#b4c5ff] hover:text-white underline cursor-pointer"
              >
                Mark all read
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>

        {/* List of Notifications */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {loading ? (
            <div className="py-12 text-center text-sm text-[#747683]">Loading notifications...</div>
          ) : notifications.length === 0 ? (
            <div className="py-16 text-center flex flex-col items-center">
              <span className="material-symbols-outlined text-slate-300 text-[48px] mb-2">notifications_off</span>
              <p className="text-sm font-bold text-[#001d59]">No notifications yet</p>
              <p className="text-xs text-[#747683] mt-1">Real-time alerts for reservations, collections, and payouts will appear here.</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleMarkRead(notif.id, notif.link)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative ${
                  notif.is_read
                    ? 'bg-white border-slate-200 opacity-80 hover:opacity-100'
                    : 'bg-blue-50/60 border-blue-200 shadow-xs hover:bg-blue-50'
                }`}
              >
                {!notif.is_read && (
                  <span className="absolute top-3.5 right-3.5 w-2 h-2 rounded-full bg-[#005ab6]"></span>
                )}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-xs shrink-0 text-[#001d59]">
                    <span className="material-symbols-outlined text-[18px]">
                      {notif.type === 'collection_verified'
                        ? 'verified'
                        : notif.type === 'payment_status'
                        ? 'payments'
                        : notif.type === 'ngo_verified'
                        ? 'how_to_reg'
                        : notif.type === 'points_credited'
                        ? 'award_star'
                        : 'restaurant'}
                    </span>
                  </div>
                  <div className="flex flex-col min-w-0 pr-4">
                    <span className="text-xs font-bold text-[#001d59]">{notif.title}</span>
                    <p className="text-xs text-[#444652] mt-0.5 leading-relaxed">{notif.message}</p>
                    <span className="text-[10px] text-[#747683] font-medium mt-1">
                      {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-[#747683]">
          <span>FOODLOOP Real-Time Push Stream</span>
          <span className="text-emerald-700 font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Connected
          </span>
        </div>

      </div>
    </div>
  );
};
