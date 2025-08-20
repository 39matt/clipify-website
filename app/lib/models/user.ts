export interface IUser {
  id?: string
  connected: boolean;
  email: string;
  walletAddress: string;
  balance: number;
  payoutRequested: string;
}