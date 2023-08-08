import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap,map, catchError } from 'rxjs/operators'
import { CarteleraResponse, Movie } from '../interfaces/cartelera-response';
import { MovieResponse } from '../interfaces/movie-response';
import { CreditsResponse } from '../interfaces/credits-response';

@Injectable({
  providedIn: 'root'
})
export class PeliculasService {

  private baseUrl: string = 'https://api.themoviedb.org/3';
  private carteleraPage = 1;
  public cargando: boolean = false;

  constructor( private http: HttpClient ) { }

  get params() {
    return{
      api_key: 'd6b3b7c98b518fbac1894bd7373fb566',
      language: 'es-ES',
      page: this.carteleraPage.toString()
    }
  }

  resetCarteleraPage() {
    this.carteleraPage = 1;
  }

  getCartelera() :Observable<CarteleraResponse> {

    if( this.cargando ){
      return;
    }

    this.cargando = true;

    return this.http.get<CarteleraResponse>(`${ this.baseUrl }/movie/now_playing`,{
      params: this.params
    }).pipe(
      tap( () => {
        this.carteleraPage += 1;
        this.cargando = false;
      } )
    );
  }

  buscarPeliculas(texto: string):Observable<Movie[]>{

    const params = {... this.params , page: '1', query: texto};

    // https://api.themoviedb.org/3/search/movie?api_key=d6b3b7c98b518fbac1894bd7373fb566&language=es-ES&query=naruto&page=1&include_adult=true
    return this.http.get<CarteleraResponse>(`${this.baseUrl}/search/movie`, {
      params
    }).pipe(
      map( resp => resp.results )
    )
  }

  getPeliculaDetalle(id:string) {

    return this.http.get<MovieResponse>(`${ this.baseUrl }/movie/${ id }`, {
      params: this.params
    }).pipe(
      catchError( err => of(null) )
    );

  }

  getCast(id:string) {

    return this.http.get<CreditsResponse>(`${ this.baseUrl }/movie/${ id }/credits`, {
      params: this.params
    }).pipe(
      map( resp => resp.cast ),
      catchError( err => of([]) )
    );

  }
}
