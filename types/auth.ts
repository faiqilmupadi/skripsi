export type Role = 'kepala_gudang' | 'admin_gudang';

export interface SessionPayload {
  userId: number;
  username: string;
  role: Role;
}
