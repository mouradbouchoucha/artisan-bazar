import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Product } from '../../models/product';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styles: [`
    /* Styles pour le formulaire de produit */
    .form-group { margin-bottom: 1.5rem; }
    .form-label { display: block; margin-bottom: 0.5rem; font-weight: 500; }
    .form-control { width: 100%; padding: 0.75rem; border-radius: 0.375rem; transition: all 0.2s ease-in-out; }
    .form-control:focus { outline: none; box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5); }
    .is-invalid { border-color: #e53e3e; }
    .invalid-feedback { color: #e53e3e; font-size: 0.875rem; margin-top: 0.25rem; }
    .btn { padding: 0.75rem 1.5rem; border-radius: 0.375rem; font-weight: 500; cursor: pointer; }
    .btn-primary { background-color: #4299e1; color: white; border: none; }
    .btn-primary:hover { background-color: #3182ce; }
    .btn-secondary { background-color: #a0aec0; color: white; border: none; }
    .btn-secondary:hover { background-color: #718096; }
    .image-preview { max-width: 100%; height: auto; margin-top: 1rem; border-radius: 0.375rem; }
    .spinner { display: inline-block; width: 1rem; height: 1rem; border: 2px solid rgba(255,255,255,0.3); border-radius: 50%; border-top-color: white; animation: spin 1s ease-in-out infinite; margin-right: 0.5rem; }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  categories: string[] = ['Artisanat', 'Bijoux', 'Décoration', 'Vêtements', 'Accessoires', 'Art', 'Autres'];
  imagePreview: string | null = null;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(20)]],
      price: ['', [Validators.required, Validators.min(0.01)]],
      stock: ['', [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      imageUrl: [''],
      sku: ['', Validators.pattern('^[A-Za-z0-9-_]+$')]
    });
  }

  ngOnInit(): void {
  }

  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      // Simuler le téléchargement d'image
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
        this.productForm.patchValue({ imageUrl: 'https://example.com/images/' + file.name });
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.markFormGroupTouched(this.productForm);
      return;
    }

    this.isSubmitting = true;

    // Simuler l'enregistrement du produit
    setTimeout(() => {
      console.log('Produit créé:', this.productForm.value);
      this.isSubmitting = false;
      
      // Rediriger vers la liste des produits après création
      this.router.navigate(['/admin/products']);
    }, 1500);
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if ((control as any).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }
}