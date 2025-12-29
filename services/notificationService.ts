
// Mock for Capacitor Plugins in Web Environment
// In a real mobile build, these would be imported from @capacitor/local-notifications
const LocalNotifications = {
  requestPermissions: async () => ({ display: 'granted' }),
  schedule: async (options: any) => console.log('Notification scheduled:', options),
  cancel: async (options: any) => console.log('Notification cancelled:', options),
};

export const NotificationService = {
  requestPermission: async () => {
    try {
      const result = await LocalNotifications.requestPermissions();
      return result.display === 'granted';
    } catch (e) {
      console.warn('Notifications not supported in this environment');
      return false;
    }
  },

  scheduleTaskReminder: async (taskTitle: string, dueDate: string) => {
    const triggerDate = new Date(dueDate);
    // Set reminder for 9 AM on the due date
    triggerDate.setHours(9, 0, 0, 0);

    if (triggerDate > new Date()) {
      await LocalNotifications.schedule({
        notifications: [
          {
            title: 'Task Due Today! 📝',
            body: `Don't forget to complete: ${taskTitle}`,
            id: Math.floor(Math.random() * 1000000),
            schedule: { at: triggerDate },
            sound: 'default',
            attachments: [],
            extra: null,
          }
        ]
      });
    }
  }
};
