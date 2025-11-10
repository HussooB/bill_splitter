export interface Proof {
  id: string;
  roomId: string;
  senderId: number;
  fileUrl: string;
  createdAt: Date;
  updatedAt: Date;
  sender?: {
    id: number;
    name: string;
    email: string;
  };
}
