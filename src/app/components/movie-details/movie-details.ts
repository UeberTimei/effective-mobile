import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { Movie } from '../../shared/models/movie.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movie-details.html',
  styleUrl: './movie-details.scss',
})
export class MovieDetails {
  @Input() movie!: Movie;
  @Output() closeModal = new EventEmitter<void>();

  @HostListener('document:keydown.escape', [])
  onKeydownHandler() {
    this.onClose();
  }

  onClose(): void {
    this.closeModal.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if (
      (event.target as HTMLElement).classList.contains(
        'details-modal__backdrop'
      )
    ) {
      this.onClose();
    }
  }
}
