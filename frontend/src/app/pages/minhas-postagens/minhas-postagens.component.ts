import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PostService } from '../../services/post.service';
import { NotificationService } from '../../services/notification.service';
import { Post, CreatePost, UpdatePost } from '../../models/post.model';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-minhas-postagens',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatCardModule
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

  selectedImage: File | null = null;
  imagePreview: string | null = null;

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
    this.selectedImage = null;
    this.imagePreview = null;
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      // Validar tamanho (5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.notificationService.showError('A imagem deve ter no máximo 5MB');
        return;
      }

      // Validar tipo
      if (!file.type.startsWith('image/')) {
        this.notificationService.showError('Apenas imagens são permitidas');
        return;
      }

      this.selectedImage = file;

      // Criar preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.selectedImage = null;
    this.imagePreview = null;
  }

  editPost(post: Post): void {
    this.editingPost.set(post);
    this.formData = {
      titulo: post.titulo,
      descricao: post.descricao,
      categoria: post.categoria
    };
    this.showForm.set(true);
    
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  submitPost(): void {
    if (!this.formData.titulo || !this.formData.descricao || !this.formData.categoria) {
      this.notificationService.showError('Preencha todos os campos obrigatórios');
      return;
    }

    const editingId = this.editingPost()?.id;

    if (editingId) {
      // Update
      this.postService.updatePost(editingId, this.formData, this.selectedImage || undefined).subscribe({
        next: () => {
          this.notificationService.showSuccess('Publicação atualizada com sucesso!');
          this.loadMyPosts();
          this.toggleForm();
        },
        error: () => {
          this.notificationService.showError('Erro ao atualizar publicação');
        }
      });
    } else {
      // Create
      this.postService.createPost(this.formData, this.selectedImage || undefined).subscribe({
        next: () => {
          this.notificationService.showSuccess('Publicação criada com sucesso!');
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
          this.notificationService.showSuccess('Publicação excluída com sucesso!');
          this.loadMyPosts();
        },
        error: () => {
          this.notificationService.showError('Erro ao excluir publicação');
        }
      });
    }
  }

  getImageUrl(imagePath: string): string {
    return this.postService.getImageUrl(imagePath);
  }
}
