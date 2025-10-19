import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User, Customer } from '../../models/user.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-customer-profile',
  templateUrl: './customer-profile.component.html',
  styleUrls: ['./customer-profile.component.css']
})
export class CustomerProfileComponent implements OnInit {
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef<HTMLInputElement>;

  currentUser: User | null = null;
  isEditing = false;
  profileForm = {
    name: '',
    phone: '',
    address: '',
    date_of_birth: '',
    gender: '',
    bio: ''
  };
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  isLoading = false;
  isUploadingImage = false;

  private readonly baseUrl = 'http://localhost:8000/api';

  constructor(private authService: AuthService, private http: HttpClient) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.loadProfileData();
      }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file.');
        return;
      }

      // Validate file size (1MB limit)
      if (file.size > 1024 * 1024) {
        alert('File size must be less than 1MB.');
        return;
      }

      this.selectedFile = file;

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  uploadProfileImage(): void {
    if (!this.selectedFile) return;

    this.isUploadingImage = true;
    const formData = new FormData();
    formData.append('image', this.selectedFile);

    this.http.post(`${this.baseUrl}/upload/profile-image`, formData).subscribe({
      next: (response: any) => {
        // Update the current user with new profile image
        const updatedUser = { ...this.currentUser, profile_image: response.path };
        this.currentUser = updatedUser;
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));

        this.selectedFile = null;
        this.imagePreview = null;
        this.isUploadingImage = false;
        alert('Profile image updated successfully!');
      },
      error: (error) => {
        console.error('Image upload failed:', error);
        this.isUploadingImage = false;
        alert('Failed to upload image. Please try again.');
      }
    });
  }

  removeImagePreview(): void {
    this.selectedFile = null;
    this.imagePreview = null;
  }

  getCustomer(): Customer | null {
    return this.currentUser as Customer;
  }

  loadProfileData(): void {
    if (this.currentUser) {
      this.profileForm = {
        name: this.currentUser.name || '',
        phone: this.currentUser.phone || '',
        address: this.currentUser.address || '',
        date_of_birth: this.currentUser.date_of_birth ? this.formatDate(this.currentUser.date_of_birth) : '',
        gender: this.currentUser.gender || '',
        bio: this.currentUser.bio || ''
      };
    }
  }

  private formatDate(date: Date): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.loadProfileData(); // Reset form if canceling
    }
  }

  saveProfile(): void {
    if (!this.currentUser) return;

    this.isLoading = true;
    this.http.put(`${this.baseUrl}/user/profile`, this.profileForm).subscribe({
      next: (response: any) => {
        // Update the current user
        const updatedUser = { ...this.currentUser, ...response.user };
        this.currentUser = updatedUser;
        // Update localStorage
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        this.isEditing = false;
        this.isLoading = false;
        alert('Profile updated successfully!');
      },
      error: (error) => {
        console.error('Profile update failed:', error);
        this.isLoading = false;
        alert('Failed to update profile. Please try again.');
      }
    });
  }
}