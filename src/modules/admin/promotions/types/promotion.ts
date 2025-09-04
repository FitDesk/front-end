export interface Promotion {
  id: string;
  title: string;
  description: string;
  discount: number;
  startDate: Date | string;
  endDate: Date | string;
  isActive: boolean;
  target: 'all' | 'members' | 'trainers';
  code?: string;
  imageUrl?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface CreatePromotionDTO extends Omit<Promotion, 'id' | 'createdAt' | 'updatedAt'> {}
export interface UpdatePromotionDTO extends Partial<CreatePromotionDTO> {
  id: string;
}
