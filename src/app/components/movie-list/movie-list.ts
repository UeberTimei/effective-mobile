import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MovieCard } from '../movie-card/movie-card';
import { MovieDetails } from '../movie-details/movie-details';
import { Movie } from '../../shared/models/movie.model';
import {
  BehaviorSubject,
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  of,
} from 'rxjs';
import { MovieService } from '../../core/services/movie';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MovieCard, MovieDetails],
  templateUrl: './movie-list.html',
  styleUrl: './movie-list.scss',
})
export class MovieList {
  private moviesMasterList: Movie[] = [];

  private moviesSubject = new BehaviorSubject<Movie[]>([]);
  movies$: Observable<Movie[]> = this.moviesSubject.asObservable();

  isLoading = true;
  error: string | null = null;
  searchControl = new FormControl('');

  selectedMovie: Movie | null = null;

  constructor(private movieService: MovieService) {}

  ngOnInit(): void {
    this.movieService
      .getMovies()
      .pipe(
        catchError((err) => {
          this.error = err.message;
          this.isLoading = false;
          return of([]);
        })
      )
      .subscribe((movies) => {
        this.moviesMasterList = movies;
        this.moviesSubject.next(movies);
        this.isLoading = false;
      });

    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        map((term) => term?.toLowerCase() || '')
      )
      .subscribe((searchTerm) => {
        const filteredMovies = this.moviesMasterList.filter((movie) =>
          movie.title.toLowerCase().includes(searchTerm)
        );
        this.moviesSubject.next(filteredMovies);
      });
  }

  onMovieSelect(movie: Movie): void {
    this.selectedMovie = movie;
  }

  onCloseDetails(): void {
    this.selectedMovie = null;
  }

  trackById(index: number, movie: Movie): number {
    return movie.id;
  }
}
