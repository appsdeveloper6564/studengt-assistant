
export const NotificationService = {
  requestPermission: async () => {
    if (!("Notification" in window)) {
      console.warn("This browser does not support notifications.");
      return false;
    }
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  },

  send: (title: string, body: string) => {
    if (Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: 'https://cdn-icons-png.flaticon.com/512/3135/3135810.png'
      });
    }
  },

  scheduleReminder: (title: string, body: string, delayMs: number) => {
    setTimeout(() => {
      NotificationService.send(title, body);
    }, delayMs);
  }
};
