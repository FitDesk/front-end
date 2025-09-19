export interface Payment {
  id: string;
  memberId: string;
  memberName: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  paymentMethod: string;
  transactionId: string;
  date: string;
  subscriptionPlan: string;
  nextBillingDate?: string;
}

export interface BillingFilter {
  status?: string;
  paymentMethod?: string;
  dateFrom?: string;
  dateTo?: string;
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface BillingPagination {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}
