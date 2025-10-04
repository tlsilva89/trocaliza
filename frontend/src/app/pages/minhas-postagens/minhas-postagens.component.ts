import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PostService } from '../../services/post.service';
import { NotificationService } from '../../services/notification.service';
import { Post, CreatePost, UpdatePost } from '../../models/post.model';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-minhas-postagens',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatDialogModule
  ],
  templateUrl: './minhas-postagens.component.html'
})
export class MinhasPostagensComponent implements OnInit {
  private postService = inject(PostService);
  private notificationService = inject(NotificationService);

  myPosts = signal<Post[]>([]);
  isLoading = signal(true);
  showForm = signal(false);
  editingPost = signal<Post | null>(null);

  readonly categories = ['Móveis', 'Eletrônicos', 'Vestuário', 'Livros', 'Outros'];

  formData: CreatePost = {
    titulo: '',
    descricao: '',
    categoria: ''
  };

  ngOnInit(): void {
    this.loadMyPosts();
  }

  loadMyPosts(): void {
    this.isLoading.set(true);
    this.postService.getMyPosts().subscribe({
      next: (posts) => {
        this.myPosts.set(posts);
        this.isLoading.set(false);
      },
      error: () => {
        this.notificationService.showError('Erro ao carregar suas publicações');
        this.isLoading.set(false);
      }
    });
  }

  toggleForm(): void {
    this.showForm.set(!this.showForm());
    if (!this.showForm()) {
      this.resetForm();
    }
  }

  resetForm(): void {
    this.formData = {
      titulo: '',
      descricao: '',
      categoria: ''
    };
    this.editingPost.set(null);
  }

  editPost(post: Post): void {
    this.editingPost.set(post);
    this.formData = {
      titulo: post.titulo,
      descricao: post.descricao,
      categoria: post.categoria
    };
    this.showForm.set(true);
  }

  submitPost(): void {
    if (!this.formData.titulo || !this.formData.descricao || !this.formData.categoria) {
      this.notificationService.showError('Preencha todos os campos');
      return;
    }

    const editingId = this.editingPost()?.id;

    if (editingId) {
      this.postService.updatePost(editingId, this.formData).subscribe({
        next: () => {
          this.notificationService.showSuccess('Publicação atualizada!');
          this.loadMyPosts();
          this.toggleForm();
        },
        error: () => {
          this.notificationService.showError('Erro ao atualizar publicação');
        }
      });
    } else {
      this.postService.createPost(this.formData).subscribe({
        next: () => {
          this.notificationService.showSuccess('Publicação criada!');
          this.loadMyPosts();
          this.toggleForm();
        },
        error: () => {
          this.notificationService.showError('Erro ao criar publicação');
        }
      });
    }
  }

  deletePost(id: number): void {
    if (confirm('Tem certeza que deseja excluir esta publicação?')) {
      this.postService.deletePost(id).subscribe({
        next: () => {
          this.notificationService.showSuccess('Publicação excluída!');
          this.loadMyPosts();
        },
        error: () => {
          this.notificationService.showError('Erro ao excluir publicação');
        }
      });
    }
  }
}
