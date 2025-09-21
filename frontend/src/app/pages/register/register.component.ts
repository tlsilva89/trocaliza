import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  registerForm: FormGroup;
  private authService = inject(AuthService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.notificationService.showError('Por favor, preencha todos os campos corretamente.');
      return;
    }

    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        this.notificationService.showSuccess('Cadastro realizado com sucesso! Faça o login.');
        this.router.navigate(['/login']);
      },
      error: (err: HttpErrorResponse) => {
        const errorMessage = err.error || 'Ocorreu um erro no registro.';
        this.notificationService.showError(errorMessage);
      },
    });
  }
}
