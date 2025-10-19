import { Component, Input, OnInit } from '@angular/core';
import { Review, ReviewSummary } from '../../models/review';
import { ReviewService } from '../../services/review.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-product-reviews',
  templateUrl: './product-reviews.component.html',
  styles: [`
    .reviews-container { padding: 1.5rem; }
    .review-summary { display: flex; align-items: center; margin-bottom: 2rem; }
    .average-rating { font-size: 3rem; font-weight: bold; margin-right: 1.5rem; }
    .rating-bars { flex: 1; }
    .rating-bar { display: flex; align-items: center; margin-bottom: 0.5rem; }
    .rating-label { width: 2rem; }
    .rating-progress { flex: 1; height: 0.5rem; background-color: #e2e8f0; border-radius: 0.25rem; margin: 0 0.5rem; }
    .rating-progress-fill { height: 100%; background-color: #f59e0b; border-radius: 0.25rem; }
    .rating-count { width: 2rem; text-align: right; font-size: 0.875rem; color: #64748b; }
    .review-list { margin-top: 2rem; }
    .review-item { padding: 1.5rem; border-bottom: 1px solid #e2e8f0; }
    .review-header { display: flex; justify-content: space-between; margin-bottom: 0.5rem; }
    .reviewer-name { font-weight: 600; }
    .review-date { color: #64748b; font-size: 0.875rem; }
    .review-rating { display: flex; margin-bottom: 0.5rem; }
    .star { color: #f59e0b; margin-right: 0.25rem; }
    .review-comment { margin-bottom: 1rem; line-height: 1.5; }
    .review-images { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
    .review-image { width: 5rem; height: 5rem; object-fit: cover; border-radius: 0.375rem; cursor: pointer; }
    .review-actions { display: flex; gap: 1rem; }
    .helpful-btn { display: flex; align-items: center; background: none; border: none; color: #64748b; cursor: pointer; }
    .helpful-btn:hover { color: #1e293b; }
    .helpful-count { margin-left: 0.25rem; }
    .verified-badge { display: inline-flex; align-items: center; background-color: #10b981; color: white; font-size: 0.75rem; padding: 0.125rem 0.5rem; border-radius: 1rem; margin-left: 0.5rem; }
    .review-form { margin-top: 2rem; padding: 1.5rem; background-color: #f8fafc; border-radius: 0.5rem; }
    .form-title { font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem; }
    .form-group { margin-bottom: 1rem; }
    .form-label { display: block; margin-bottom: 0.5rem; font-weight: 500; }
    .form-control { width: 100%; padding: 0.75rem; border: 1px solid #cbd5e1; border-radius: 0.375rem; }
    .form-control:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.25); }
    .star-rating { display: flex; gap: 0.5rem; }
    .star-btn { background: none; border: none; font-size: 1.5rem; color: #cbd5e1; cursor: pointer; }
    .star-btn.active { color: #f59e0b; }
    .submit-btn { background-color: #3b82f6; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 0.375rem; font-weight: 500; cursor: pointer; }
    .submit-btn:hover { background-color: #2563eb; }
    .submit-btn:disabled { background-color: #94a3b8; cursor: not-allowed; }
  `]
})
export class ProductReviewsComponent implements OnInit {
  @Input() productId: string | number;
  
  reviews: Review[] = [];
  reviewSummary: ReviewSummary;
  reviewForm: FormGroup;
  selectedRating = 0;
  isSubmitting = false;
  
  constructor(
    private reviewService: ReviewService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadReviews();
    this.loadReviewSummary();
  }

  initForm(): void {
    this.reviewForm = this.fb.group({
      rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['', [Validators.required, Validators.minLength(10)]],
      images: [[]]
    });
  }

  loadReviews(): void {
    this.reviewService.getReviewsByProductId(this.productId)
      .subscribe(reviews => {
        this.reviews = reviews;
      });
  }

  loadReviewSummary(): void {
    this.reviewService.getReviewSummary(this.productId)
      .subscribe(summary => {
        this.reviewSummary = summary;
      });
  }

  setRating(rating: number): void {
    this.selectedRating = rating;
    this.reviewForm.patchValue({ rating });
  }

  getStarsArray(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i < rating ? 1 : 0);
  }

  getPercentage(count: number): string {
    if (!this.reviewSummary || this.reviewSummary.totalReviews === 0) return '0%';
    return `${(count / this.reviewSummary.totalReviews) * 100}%`;
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }

  markAsHelpful(reviewId: string | number): void {
    this.reviewService.markReviewAsHelpful(reviewId)
      .subscribe(updatedReview => {
        const index = this.reviews.findIndex(r => r.id === reviewId);
        if (index !== -1) {
          this.reviews[index] = updatedReview;
        }
      });
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      // Dans une application réelle, vous téléchargeriez les images sur un serveur
      // Ici, nous simulons simplement l'ajout des noms de fichiers
      const fileNames = Array.from(input.files).map(file => file.name);
      const currentImages = this.reviewForm.get('images').value || [];
      this.reviewForm.patchValue({
        images: [...currentImages, ...fileNames]
      });
    }
  }

  submitReview(): void {
    if (this.reviewForm.invalid) {
      Object.keys(this.reviewForm.controls).forEach(key => {
        this.reviewForm.get(key).markAsTouched();
      });
      return;
    }

    this.isSubmitting = true;
    
    const reviewData = {
      productId: this.productId,
      userId: 999, // Dans une application réelle, ce serait l'ID de l'utilisateur connecté
      userName: 'Utilisateur actuel', // Dans une application réelle, ce serait le nom de l'utilisateur connecté
      rating: this.reviewForm.value.rating,
      comment: this.reviewForm.value.comment,
      images: this.reviewForm.value.images
    };

    this.reviewService.addReview(reviewData)
      .subscribe({
        next: (newReview) => {
          this.reviews.unshift(newReview);
          this.loadReviewSummary(); // Recharger le résumé pour mettre à jour les statistiques
          this.reviewForm.reset();
          this.selectedRating = 0;
          this.isSubmitting = false;
        },
        error: (err) => {
          console.error('Erreur lors de l\'ajout de l\'avis', err);
          this.isSubmitting = false;
        }
      });
  }
}