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
  isActive: boolean;
  isPot:boolean;
  perMillionText: string;
  discordInvite: string;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  dateStarted?: string;
  dateEnded?: string;
  lastUpdatedAt?: string;
}