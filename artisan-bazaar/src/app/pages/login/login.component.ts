import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { ErrorHandlerService } from "../../services/error-handler.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent {
  selectedRole: string = "customer";
  currentDirection: string = "ltr";

  constructor(
    private authService: AuthService,
    private router: Router,
    private errorHandler: ErrorHandlerService,
  ) {}

  selectRole(role: string): void {
    this.selectedRole = role;
    console.log("Role selected:", role);
  }

  onSubmit(loginForm: any): void {
    console.log("Form submitted:", loginForm);
    console.log("Form valid:", loginForm.valid);
    console.log("Form value:", loginForm.value);
    console.log("Selected role:", this.selectedRole);

    if (loginForm.valid) {
      const { email, password } = loginForm.value;

      console.log("Login attempt:", {
        email,
        password,
        selectedRole: this.selectedRole,
      });

      this.authService.login(email, password, this.selectedRole).subscribe({
        next: (user) => {
          console.log("Login successful, user:", user);

          // Redirect based on user role
          switch (user.role) {
            case "super_admin":
              console.log("Redirecting to admin dashboard");
              this.router.navigate(["/admin/dashboard"]);
              break;
            case "seller":
              console.log("Redirecting to seller dashboard");
              this.router.navigate(["/seller/dashboard"]);
              break;
            case "customer":
              console.log("Redirecting to customer profile");
              this.router.navigate(["/customer/profile"]);
              break;
            default:
              console.log("Unknown role, redirecting to home");
              this.router.navigate(["/"]);
              break;
          }
        },
        error: (error) => {
          console.log("Login failed:", error);
          const userMessage = this.errorHandler.getUserMessage(error);
          alert(userMessage);
        },
      });
    } else {
      console.log("Form is not valid");
      console.log("Form errors:", loginForm.errors);
      console.log("Form controls:", loginForm.controls);
    }
  }
}
