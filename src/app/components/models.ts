export interface Ticket {
  id: number;
  title: string;
  description: string;
  status: string;
  userId: number;
  username: string;
  comments: any[];
  showComments: boolean;
  fileUrl?: string;
}

export interface Comment {
  text: string;
  image: string | null;
  createdBy: string;
  description:string;
  userID: number;
}

export interface User {
  ownerId: number;
  role: string;
  username: string;
}
