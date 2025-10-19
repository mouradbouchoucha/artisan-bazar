import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.css']
})
export class EmailVerificationComponent implements OnInit {
  verificationStatus: 'loading' | 'success' | 'error' | 'already-verified' = 'loading';
  message = '';

  private readonly baseUrl = 'http://localhost:8000/api';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const id = params['id'];
      const hash = params['hash'];

      if (id && hash) {
        this.verifyEmail(id, hash);
      } else {
        this.verificationStatus = 'error';
        this.message = 'Invalid verification link. Missing required parameters.';
      }
    });
  }

  private verifyEmail(id: string, hash: string): void {
    this.http.post(`${this.baseUrl}/auth/verify-email`, { id, hash }).subscribe({
      next: (response: any) => {
        this.verificationStatus = 'success';
        this.message = response.message || 'Email verified successfully!';

        // Redirect to login after 3 seconds
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (error) => {
        console.error('Verification failed:', error);
        if (error.error && error.error.message) {
          this.message = error.error.message;
          if (error.error.message.includes('already verified')) {
            this.verificationStatus = 'already-verified';
          } else {
            this.verificationStatus = 'error';
          }
        } else {
          this.verificationStatus = 'error';
          this.message = 'Verification failed. Please try again or contact support.';
        }
      }
    });
  }
}
