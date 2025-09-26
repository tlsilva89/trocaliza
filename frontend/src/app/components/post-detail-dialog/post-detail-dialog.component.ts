import { Component, OnInit, Inject, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PostService } from '../../services/post.service';
import { Post } from '../../models/post.model';
import { NotificationService } from '../../services/notification.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-post-detail-dialog',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './post-detail-dialog.component.html',
  styleUrl: './post-detail-dialog.component.css'
})
export class PostDetailDialogComponent implements OnInit {
  post$!: Observable<Post>;
  commentForm: FormGroup;
  private postService = inject(PostService);
  private notificationService = inject(NotificationService);
  private fb = inject(FormBuilder);

  constructor(
    public dialogRef: MatDialogRef<PostDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { postId: number }
  ) {
    this.commentForm = this.fb.group({
      conteudo: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadPost();
  }

  loadPost(): void {
    this.post$ = this.postService.getPostById(this.data.postId);
  }

  addComment(): void {
    if (this.commentForm.invalid) {
      return;
    }

    const conteudo = this.commentForm.value.conteudo;
    this.postService.addComment(this.data.postId, conteudo).subscribe({
      next: () => {
        this.notificationService.showSuccess('Comentário adicionado!');
        this.commentForm.reset();
        this.loadPost();
      },
      error: () => {
        this.notificationService.showError('Falha ao adicionar comentário.');
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}