export interface ICampaign {
  id: string;
  influencer: string;
  activity: string;
  imageUrl: string;
  progress: number;
  budget: number;
  perMillion: number;
  createdAt: string;
  maxEarnings: number;
  maxEarningsPerPost: number;
  maxSubmissions: number;
  minViewsPerPayout: number;
  moneySpent: number;
}