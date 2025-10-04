import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Post } from '../../models/post.model';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, RouterLink],
  template: `
    <mat-card class="mb-4 hover:shadow-lg transition-shadow">
      <mat-card-header>
        <div class="flex items-center w-full">
          <mat-icon class="mr-3 text-primary">article</mat-icon>
          <div class="flex-1">
            <mat-card-title class="!mb-1">{{ post.titulo }}</mat-card-title>
            <mat-card-subtitle class="!mb-0">
              Por {{ post.nomeUsuario }} • 
              {{ post.criadoEm | date:'dd/MM/yyyy HH:mm' }} • 
              <span class="inline-block px-2 py-1 bg-primary/10 text-primary rounded-md text-xs ml-1">
                {{ post.categoria }}
              </span>
            </mat-card-subtitle>
          </div>
        </div>
      </mat-card-header>
      <mat-card-content>
        <p class="mt-3 line-clamp-3">{{ post.descricao }}</p>
      </mat-card-content>
      <mat-card-actions>
        <button mat-button [routerLink]="['/postagens', post.id]" color="primary">
          <mat-icon>comment</mat-icon>
          Comentários ({{ post.comentarios.length }})
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`
    .line-clamp-3 {
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class PostCardComponent {
  @Input() post!: Post;
}
