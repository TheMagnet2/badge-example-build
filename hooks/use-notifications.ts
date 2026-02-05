"use client";

import { useEffect, useState, useCallback } from "react";

type NotificationStatus = "default" | "granted" | "denied" | "unsupported";

interface NotificationSubscription {
  badgeId: string;
  enabled: boolean;
}

const STORAGE_KEY = "badge-notifications";

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationStatus>("default");
  const [subscriptions, setSubscriptions] = useState<NotificationSubscription[]>([]);
  const [allNotificationsEnabled, setAllNotificationsEnabled] = useState(false);

  // Load subscriptions from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    // Check notification support
    if (!("Notification" in window)) {
      setPermission("unsupported");
      return;
    }

    setPermission(Notification.permission as NotificationStatus);

    // Load saved subscriptions
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSubscriptions(parsed.subscriptions || []);
        setAllNotificationsEnabled(parsed.allEnabled || false);
      } catch {
        // Invalid JSON, ignore
      }
    }
  }, []);

  // Save subscriptions to localStorage
  const saveSubscriptions = useCallback((subs: NotificationSubscription[], allEnabled: boolean) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      subscriptions: subs,
      allEnabled: allEnabled,
    }));
  }, []);

  // Request notification permission
  const requestPermission = useCallback(async () => {
    if (permission === "unsupported") return false;

    const result = await Notification.requestPermission();
    setPermission(result as NotificationStatus);
    return result === "granted";
  }, [permission]);

  // Toggle notification for a specific badge
  const toggleBadgeNotification = useCallback(async (badgeId: string) => {
    if (permission !== "granted") {
      const granted = await requestPermission();
      if (!granted) return false;
    }

    setSubscriptions((prev) => {
      const existing = prev.find((s) => s.badgeId === badgeId);
      let newSubs: NotificationSubscription[];

      if (existing) {
        newSubs = prev.map((s) =>
          s.badgeId === badgeId ? { ...s, enabled: !s.enabled } : s
        );
      } else {
        newSubs = [...prev, { badgeId, enabled: true }];
      }

      saveSubscriptions(newSubs, allNotificationsEnabled);
      return newSubs;
    });

    return true;
  }, [permission, requestPermission, allNotificationsEnabled, saveSubscriptions]);

  // Toggle all notifications
  const toggleAllNotifications = useCallback(async () => {
    if (permission !== "granted") {
      const granted = await requestPermission();
      if (!granted) return false;
    }

    const newAllEnabled = !allNotificationsEnabled;
    setAllNotificationsEnabled(newAllEnabled);
    saveSubscriptions(subscriptions, newAllEnabled);
    return true;
  }, [permission, requestPermission, allNotificationsEnabled, subscriptions, saveSubscriptions]);

  // Check if a specific badge has notifications enabled
  const isBadgeNotificationEnabled = useCallback((badgeId: string) => {
    if (allNotificationsEnabled) return true;
    const sub = subscriptions.find((s) => s.badgeId === badgeId);
    return sub?.enabled || false;
  }, [subscriptions, allNotificationsEnabled]);

  // Send a test notification
  const sendTestNotification = useCallback((title: string, body: string) => {
    if (permission !== "granted") return;

    new Notification(title, {
      body,
      icon: "/icons/icon-192x192.png",
      badge: "/icons/icon-72x72.png",
      vibrate: [100, 50, 100],
    });
  }, [permission]);

  return {
    permission,
    subscriptions,
    allNotificationsEnabled,
    requestPermission,
    toggleBadgeNotification,
    toggleAllNotifications,
    isBadgeNotificationEnabled,
    sendTestNotification,
  };
}
