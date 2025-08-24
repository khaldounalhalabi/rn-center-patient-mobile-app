interface DBNotification {
  id: string;
  type: string;
  notifiable_id: number;
  data?: Record<string, any>;
  read_at?: string;
  resource?: string;
  resource_id?: number | string;
  notifiable_type: string;
  created_at: string;
}

export default DBNotification;
