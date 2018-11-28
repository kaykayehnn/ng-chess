import { User } from './User';

export interface Room {
  host: User;
  timestamp?: number | Date;
  password?: string;
}
