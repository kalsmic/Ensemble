import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {AuthService} from './auth.service';

import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ToastService} from './toast.service';
import {map, retry} from 'rxjs/operators';
import {Observable, of} from 'rxjs';

export interface MovieActor {
   actor: {
       id?: number | string;
       name?: string;
   };
   role: string;
}

export interface Movie {
    id?: number;
    title: string;
    release_date: string;
    actors?: Array<MovieActor>;
}


@Injectable({
    providedIn: 'root'
})

export class MovieService {

    url = environment.apiServerUrl;

    public cinemas: { [key: number]: Movie } = {};
    public cinema: Movie;
    public page: number;
    public pages: number;
    public currentPage: number;
    public nextPage: number;
    public previousPage: number;
    public total: number;
    public hasNext: boolean;
    public hasPrevious: boolean;

    constructor(
        private auth: AuthService,
        private http: HttpClient,
        private toast: ToastService
    ) {
    }

    getHeaders() {
        const header = {
            headers: new HttpHeaders()
                .set('Authorization', `Bearer ${this.auth.activeJWT()}`)
        };
        return header;
    }

    getMovies(page?: number) {
        if (this.auth.can('get:movies')) {
            let url = this.url + '/movies';
            if (page) {
                url = url + '?page=' + page;
            }
            this.http.get(url, this.getHeaders())
                .subscribe((res: any) => {
                    this.cinemas = [];
                    this.moviesToCinemaItems(res.movies);
                    this.page = res.page;
                    this.currentPage = res.current_page;
                    this.total = res.total;
                    this.pages = res.pages;
                    this.nextPage = res.next_num;
                    this.previousPage = res.prev_num;
                    this.hasNext = res.has_next;
                    this.hasPrevious = res.has_prev;

                });

        }
    }

    getMovie(movieId: number) {

        if (this.auth.can('get:movies')) {

            this.http.get(this.url + '/movies/' + movieId, this.getHeaders())
                .subscribe((res: any) => {
                    this.cinema = res.movie;
                });
        }
    }

    saveMovie(movie: Movie) {
        if (movie.id >= 0) { // patch
            const movieData = {
                title: movie.title,
                release_date: movie.release_date,
                actors: movie.actors
            };
            this.http.patch(this.url + '/movies/' + movie.id, movieData, this.getHeaders())
                .subscribe((res: any) => {
                    if (res.success) {
                        this.cinema = res.movie;
                    }
                });
        } else { // insert
            delete movie.id;
            this.http.post(this.url + '/movies', movie, this.getHeaders())
                    .subscribe((res: any) => {
                        if (res.success) {
                            this.cinema = res.movie;
                        }
                    });
        }

    }

    deleteMovie(movieId: number) {
        delete this.cinemas[movieId];
        this.http.delete(this.url + '/movies/' + movieId, this.getHeaders())
            .subscribe(
                (res: any) => {
                    this.toast.showToast(res.message);
                },
                err => this.toast.showToast('Movie does not exist', 'danger'));
    }

    moviesToCinemaItems(movies: Array<Movie>) {
        for (const movie of movies) {
            this.cinemas[movie.id] = movie;
        }
    }

    goToNextPage() {
        this.getMovies(this.nextPage);
    }


    getMovieActors(movieId: number): Observable<MovieActor[]> {
        return this.http.get<any>(this.url + '/movies/' + movieId + '/actors')
            .pipe(
                retry(3),
                map((res) => {
                    const {actors} = res;
                    return actors;
                })
            );
    }
}
