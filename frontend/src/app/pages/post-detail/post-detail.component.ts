import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PostService } from '../../services/post.service';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { Post } from '../../models/post.model';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterLink,
    MatButtonModule, 
    MatIconModule, 
    MatInputModule,
    MatCardModule,
    MatFormFieldModule
  ],
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.css'
})
export class PostDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private postService = inject(PostService);
  public authService = inject(AuthService);
  private notificationService = inject(NotificationService);

  post = signal<Post | null>(null);
  isLoading = signal(true);
  comentario = '';

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadPost(id);
  }

  loadPost(id: number): void {
    this.isLoading.set(true);
    this.postService.getPostById(id).subscribe({
      next: (post) => {
        this.post.set(post);
        this.isLoading.set(false);
      },
      error: () => {
        this.notificationService.showError('Erro ao carregar publicação');
        this.isLoading.set(false);
      }
    });
  }

  addComment(): void {
    const postId = this.post()?.id;
    if (!postId || !this.comentario.trim()) return;

    this.postService.addComment(postId, this.comentario).subscribe({
      next: () => {
        this.notificationService.showSuccess('Comentário adicionado!');
        this.comentario = '';
        this.loadPost(postId);
      },
      error: () => {
        this.notificationService.showError('Erro ao adicionar comentário');
      }
    });
  }
}
