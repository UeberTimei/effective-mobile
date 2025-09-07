import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, delay, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Movie {
  private readonly moviesUrl = 'assets/data/movies.json';

  constructor(private http: HttpClient) {}

  getMovies(): Observable<Movie[]> {
    return this.http
      .get<Movie[]>(this.moviesUrl)
      .pipe(delay(500), catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    console.error('Произошла ошибка при загрузке данных о фильмах:', error);
    return throwError(
      () =>
        new Error(
          'Не удалось загрузить данные. Пожалуйста, попробуйте еще раз позже.'
        )
    );
  }
}
