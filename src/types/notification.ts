import type { PermohonanStatus, PermohonanType } from "@/types/permohonan";

export type NotificationItem = {
  id: string;
  type: PermohonanType;
  categoryLabel: string;
  status: PermohonanStatus;
  updatedAt: string;
  isUnread: boolean;
};

export type NotificationData = {
  items: NotificationItem[];
  unreadCount: number;
};
