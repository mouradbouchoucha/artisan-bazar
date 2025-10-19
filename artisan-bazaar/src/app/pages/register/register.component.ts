import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  currentDirection: string = 'ltr';
  selectedRole: string = 'customer';
  agreeTerms: boolean = false;
  isLoading: boolean = false;
  userData = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}


  selectRole(role: string): void {
    this.selectedRole = role;
  }

  onSubmit(registerForm: any): void {
    // Prevent multiple submissions
    if (this.isLoading) {
      return;
    }

    console.log('Form submitted:', registerForm);
    console.log('Form valid:', registerForm.valid);
    console.log('Form value:', registerForm.value);
    console.log('User data:', this.userData);

    if (registerForm.valid) {
      const { name, email, password, confirmPassword } = this.userData;

      if (password !== confirmPassword) {
        alert('Les mots de passe ne correspondent pas');
        return;
      }

      if (!this.agreeTerms) {
        alert('Veuillez accepter les termes et conditions');
        return;
      }

      this.isLoading = true;
      console.log('Sending registration data:', { name, email, password, role: this.selectedRole });

      this.authService.register(name, email, password, this.selectedRole).subscribe({
        next: (response) => {
          alert(response.message || 'Inscription réussie ! Veuillez vérifier votre email pour activer votre compte.');
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Registration failed:', error);
          this.isLoading = false; // Reset loading state on error
          if (error.error && error.error.errors) {
            const errorMessages = Object.values(error.error.errors).flat().join('\n');
            alert('Échec de l\'inscription :\n' + errorMessages);
          } else {
            alert('Échec de l\'inscription. Veuillez réessayer.');
          }
        }
      });
    } else {
      alert('Veuillez remplir tous les champs requis correctement.');
    }
  }

}