import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

interface UserProfile {
  id: number;
  nome: string;
  email: string;
  criadoEm: Date;
}

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatCardModule,
    MatFormFieldModule
  ],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit {
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);

  profile = signal<UserProfile | null>(null);
  isLoading = signal(true);
  isEditing = signal(false);

  formData = {
    nome: '',
    email: ''
  };

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoading.set(true);
    this.authService.getProfile().subscribe({
      next: (profile) => {
        this.profile.set(profile);
        this.formData = {
          nome: profile.nome,
          email: profile.email
        };
        this.isLoading.set(false);
      },
      error: () => {
        this.notificationService.showError('Erro ao carregar perfil');
        this.isLoading.set(false);
      }
    });
  }

  toggleEdit(): void {
    this.isEditing.set(!this.isEditing());
    if (!this.isEditing()) {
      const currentProfile = this.profile();
      if (currentProfile) {
        this.formData = {
          nome: currentProfile.nome,
          email: currentProfile.email
        };
      }
    }
  }

  updateProfile(): void {
    this.authService.updateProfile(this.formData).subscribe({
      next: () => {
        this.notificationService.showSuccess('Perfil atualizado com sucesso!');
        this.loadProfile();
        this.isEditing.set(false);
      },
      error: () => {
        this.notificationService.showError('Erro ao atualizar perfil');
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
