import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Notification {
  id: string;
  type: 'assignment' | 'message' | 'ai-mentor' | 'achievement' | 'reminder' | 'system' | 'live-class';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
  sender?: string;
  icon?: any;
}

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  highPriorityCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAllNotifications: () => void;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
}

interface NotificationsProviderProps {
  children: ReactNode;
}

export function NotificationsProvider({ children }: NotificationsProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'assignment',
      title: 'New Assignment Available',
      message: 'Complete the "Binary Search Implementation" problem to earn 150 XP',
      timestamp: new Date('2024-01-21T10:30:00'),
      read: false,
      priority: 'high',
      actionUrl: '/problems'
    },
    {
      id: '2',
      type: 'ai-mentor',
      title: 'AI Mentor Suggestion',
      message: 'Based on your progress, I recommend trying the "Advanced React Patterns" course next',
      timestamp: new Date('2024-01-21T09:15:00'),
      read: false,
      priority: 'medium',
      actionUrl: '/roadmaps'
    },
    {
      id: '3',
      type: 'achievement',
      title: 'Achievement Unlocked!',
      message: 'Congratulations! You\'ve earned the "Code Warrior" badge for solving 100 problems',
      timestamp: new Date('2024-01-20T16:45:00'),
      read: true,
      priority: 'medium'
    },
    {
      id: '4',
      type: 'message',
      title: 'New Message from Mentor',
      message: 'Great work on your latest project! Let\'s schedule a review session',
      timestamp: new Date('2024-01-20T14:20:00'),
      read: false,
      priority: 'medium',
      sender: 'Sarah Chen'
    },
    {
      id: '5',
      type: 'reminder',
      title: 'Daily Learning Reminder',
      message: 'Don\'t forget to maintain your streak! Complete at least one problem today',
      timestamp: new Date('2024-01-21T08:00:00'),
      read: true,
      priority: 'low'
    },
    {
      id: '6',
      type: 'system',
      title: 'System Maintenance',
      message: 'Scheduled maintenance on January 22nd, 2:00-4:00 AM UTC. Services may be temporarily unavailable',
      timestamp: new Date('2024-01-20T12:00:00'),
      read: true,
      priority: 'low'
    },
    {
      id: '7',
      type: 'live-class',
      title: 'Live Class Starting Soon',
      message: 'JavaScript Fundamentals live class starts in 15 minutes. Join now!',
      timestamp: new Date('2024-01-21T11:45:00'),
      read: false,
      priority: 'high',
      actionUrl: '/live-classes'
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;
  const highPriorityCount = notifications.filter(n => n.priority === 'high' && !n.read).length;

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // Show browser notification if supported
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico'
      });
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Auto-mark old notifications as read after 7 days
  useEffect(() => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    setNotifications(prev => 
      prev.map(notification => 
        notification.timestamp < sevenDaysAgo && !notification.read
          ? { ...notification, read: true }
          : notification
      )
    );
  }, []);

  const value: NotificationsContextType = {
    notifications,
    unreadCount,
    highPriorityCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
} 