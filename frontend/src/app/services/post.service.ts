import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { Post, CreatePost, UpdatePost, CreateComment } from '../models/post.model';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = `${environment.apiUrl}/publicacoes`;
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl.replace('/api', '');

  getPosts(categoria?: string): Observable<Post[]> {
    let params = new HttpParams();
    if (categoria) {
      params = params.set('categoria', categoria);
    }
    return this.http.get<Post[]>(this.apiUrl, { params });
  }

  getPostById(id: number): Observable<Post> {
    return this.http.get<Post>(`${this.apiUrl}/${id}`);
  }

  getMyPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}/minhas`);
  }

  createPost(post: CreatePost, image?: File): Observable<Post> {
    const formData = this.buildFormData(post, image);
    return this.http.post<Post>(this.apiUrl, formData);
  }

  updatePost(id: number, post: UpdatePost, image?: File): Observable<void> {
    const formData = this.buildFormData(post, image);
    return this.http.put<void>(`${this.apiUrl}/${id}`, formData);
  }

  deletePost(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  addComment(postId: number, comment: CreateComment): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${postId}/comentarios`, comment);
  }

  getImageUrl(imagePath: string | null | undefined): string {
    if (!imagePath) {
      return 'assets/images/no-image.png';
    }
    return `${this.baseUrl}/${imagePath}`;
  }

  private buildFormData(post: CreatePost | UpdatePost, image?: File): FormData {
    const formData = new FormData();
    formData.append('titulo', post.titulo);
    formData.append('descricao', post.descricao);
    formData.append('categoria', post.categoria);
    
    if (image) {
      this.validateImage(image);
      formData.append('imagem', image);
    }

    return formData;
  }

  private validateImage(file: File): void {
    const maxSize = 5 * 1024 * 1024;
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

    if (file.size > maxSize) {
      throw new Error('A imagem deve ter no máximo 5MB');
    }

    if (!allowedTypes.includes(file.type)) {
      throw new Error('Formato de imagem não suportado. Use JPG, PNG, GIF ou WEBP');
    }
  }
}
