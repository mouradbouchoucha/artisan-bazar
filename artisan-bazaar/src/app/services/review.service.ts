import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Review, ReviewSummary } from '../models/review';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private readonly baseUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) { }

  getReviewsByProductId(productId: string | number): Observable<Review[]> {
    return this.http.get<any[]>(`${this.baseUrl}/products/${productId}/reviews`).pipe(
      map(items => items.map(item => ({
        id: item.id,
        productId: item.product_id,
        userId: 0,
        userName: item.user_name,
        rating: item.rating,
        comment: item.comment,
        createdAt: new Date(item.created_at),
        helpful: 0,
        verified: false
      }) as Review))
    );
  }

  getReviewSummary(productId: string | number): Observable<ReviewSummary> {
    return this.getReviewsByProductId(productId).pipe(map((reviews) => ({
      averageRating: this.calculateAverageRating(reviews),
      totalReviews: reviews.length,
      ratingDistribution: this.calculateRatingDistribution(reviews)
    })));
  }

  addReview(review: Omit<Review, 'id' | 'createdAt' | 'helpful' | 'verified'>): Observable<Review> {
    const productId = review.productId;
    return this.http.post<any>(`${this.baseUrl}/products/${productId}/reviews`, {
      user_name: review.userName,
      rating: review.rating,
      comment: review.comment
    }).pipe(map(item => ({
      id: item.id,
      productId: item.product_id,
      userId: 0,
      userName: item.user_name,
      rating: item.rating,
      comment: item.comment,
      createdAt: new Date(item.created_at),
      helpful: 0,
      verified: false
    }) as Review));
  }

  markReviewAsHelpful(reviewId: string | number): Observable<Review> {
    return this.getReviewsByProductId(0).pipe(map(reviews => reviews[0]!));
  }

  private calculateAverageRating(reviews: Review[]): number {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((total, review) => total + review.rating, 0);
    return parseFloat((sum / reviews.length).toFixed(1));
  }

  private calculateRatingDistribution(reviews: Review[]): ReviewSummary['ratingDistribution'] {
    const distribution = {
      five: 0,
      four: 0,
      three: 0,
      two: 0,
      one: 0
    };
    
    reviews.forEach(review => {
      switch (review.rating) {
        case 5: distribution.five++; break;
        case 4: distribution.four++; break;
        case 3: distribution.three++; break;
        case 2: distribution.two++; break;
        case 1: distribution.one++; break;
      }
    });
    
    return distribution;
  }

  private generateId(): number { return 0; }
}