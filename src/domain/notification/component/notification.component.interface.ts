export interface NotificationComponent {
  addNotification(content: string, userId: number): Promise<void>;
  addNotifications(content: string, userIdList: number[]): Promise<void>;
}
