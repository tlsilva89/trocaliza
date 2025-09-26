import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { Post } from '../../models/post.model';
import { PostDetailDialogComponent } from '../post-detail-dialog/post-detail-dialog.component';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './post-card.component.html',
  styleUrl: './post-card.component.css'
})
export class PostCardComponent {
  @Input({ required: true }) post!: Post;
  private dialog = inject(MatDialog);

  openPostDialog(): void {
    this.dialog.open(PostDetailDialogComponent, {
      width: '800px',
      data: { postId: this.post.id },
      panelClass: 'bg-card'
    });
  }
}