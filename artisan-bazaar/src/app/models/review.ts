export interface Review {
  id: string | number;
  productId: string | number;
  userId: string | number;
  userName: string;
  rating: number;
  comment: string;
  images?: string[];
  createdAt: Date;
  helpful: number;
  verified: boolean;
}

export interface ReviewSummary {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    five: number;
    four: number;
    three: number;
    two: number;
    one: number;
  };
}