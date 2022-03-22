import { Injectable } from '@angular/core';
import {Hero} from "./hero";
import {HEROES} from "./mock-heroes";
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  private heroesUrl = 'api/heroes';  // URL to web api
  private httpOptions: Object = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  getHeroes(): Observable<Hero[]> {
    return this.httpClient.get<Hero[]>(this.heroesUrl)
      .pipe(
        tap(_ => this.log('fetched heroes')),
        catchError(this.handleError<Hero[]>('getHeroes', []))
      );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   *
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** GET hero by id. Will 404 if id not found */
  getHero(id: number): Observable<Hero> {
    // For now, assume that a hero with the specified `id` always exists.
    // Error handling will be added in the next step of the tutorial.
    const url = `${this.heroesUrl}/${id}`;
    return this.httpClient.get<Hero>(url).pipe(
        tap(_ => this.log(`fetched hero with id: ${id}`)),
        catchError(this.handleError<Hero>(`getHero id=${id}`))
      );
  }

  private log(msg: string): void {
    this.messageService.add(`HeroService: ${msg}`);
  }

  constructor(private messageService: MessageService, private httpClient: HttpClient) { }

  /** PUT: update the hero on the server */
  update(hero: Hero): Observable<any> {
    return this.httpClient.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  /** POST: add a new hero to the server */
  addHero(hero: Hero): Observable<Hero> {
    return this.httpClient.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((newHero: Hero) => this.log(`added hero w/ id=${newHero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    );
  }

  /** DELETE: delete the hero from the server */
  delete(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;

    return this.httpClient.delete<Hero>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }

  searchHeroes(searchTxt: string): Observable<Hero[]> {
    if (!searchTxt.trim()) {
      return of([]);
    }
    const url: string = `${this.heroesUrl}/?name=${searchTxt}`;
    return this.httpClient.get<Hero[]>(url).pipe(
      tap(x => x.length
      ? this.log(`found heroes matching "${searchTxt}"`)
      : this.log(`no heroes matching "${searchTxt}"`)),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    );
  }
}
