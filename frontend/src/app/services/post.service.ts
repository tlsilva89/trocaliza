import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from '../models/post.model';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = 'http://localhost:5000/api/publicacoes';
  private http = inject(HttpClient);

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl);
  }

  getPostById(id: number): Observable<Post> {
    return this.http.get<Post>(`${this.apiUrl}/${id}`);
  }

  getMyPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}/minhas`);
  }

  createPost(post: any, image?: File): Observable<any> {
    const formData = new FormData();
    formData.append('titulo', post.titulo);
    formData.append('descricao', post.descricao);
    formData.append('categoria', post.categoria);
    
    if (image) {
      formData.append('imagem', image);
    }

    return this.http.post(this.apiUrl, formData);
  }

  updatePost(id: number, post: any, image?: File): Observable<any> {
    const formData = new FormData();
    formData.append('titulo', post.titulo);
    formData.append('descricao', post.descricao);
    formData.append('categoria', post.categoria);
    
    if (image) {
      formData.append('imagem', image);
    }

    return this.http.put(`${this.apiUrl}/${id}`, formData);
  }

  deletePost(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  addComment(postId: number, conteudo: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${postId}/comentarios`, { conteudo });
  }

  getImageUrl(imagePath: string | null | undefined): string {
    if (!imagePath) return 'assets/no-image.png';
    return `http://localhost:5000/${imagePath}`;
  }
}
