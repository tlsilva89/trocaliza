import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PostService } from '../../services/post.service';
import { Post } from '../../models/post.model';
import { PostCardComponent } from '../../components/post-card/post-card.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-postagens',
  standalone: true,
  imports: [CommonModule, PostCardComponent, MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './postagens.component.html',
  styleUrl: './postagens.component.css'
})
export class PostagensComponent implements OnInit {
  private postService = inject(PostService);

  isLoading = signal<boolean>(true);
  allPosts = signal<Post[]>([]);
  selectedCategory = signal<string>('Todos');
  
  readonly categories = ['Todos', 'Móveis', 'Eletrônicos', 'Vestuário', 'Livros', 'Outros'];
  
  filteredPosts = computed(() => {
    const category = this.selectedCategory();
    const posts = this.allPosts();

    if (category === 'Todos') {
      return posts;
    }
    return posts.filter(post => post.categoria === category);
  });

  ngOnInit(): void {
    this.isLoading.set(true);
    this.postService.getPosts().subscribe({
      next: (posts) => {
        this.allPosts.set(posts);
        this.isLoading.set(false);
      },
      error: () => {
        this.allPosts.set([]);
        this.isLoading.set(false);
      }
    });
  }

  selectCategory(category: string): void {
    this.selectedCategory.set(category);
  }
}