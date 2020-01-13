import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {AuthService} from './auth.service';

import {HttpClient} from '@angular/common/http';
import {ToastService} from './toast.service';
import {map, retry} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {Movie, Pagination} from '../shared/models';
import {setPaginationDetails} from '../shared/utils';


@Injectable({
    providedIn: 'root'
})

export class MovieService {

    url = environment.apiServerUrl;

    public cinemas: { [key: number]: Movie } = {};
    public pagination: Pagination;
    public actionSuccess = false;
    public loading = false;

    constructor(
        private auth: AuthService,
        private http: HttpClient,
        private toast: ToastService
    ) {
    }

    getMovies(page?: number): Observable<void> {

        const url = page ? this.url + '/movies?page=' + page : this.url + '/movies';

        if (this.auth.can('get:movies')) {
            return this.http.get<any>(url)
                .pipe(
                    retry(3),
                    map((res) => {
                        const {movies} = res;
                        this.cinemas = [];
                        this.moviesToCinemaItems(movies);
                        this.pagination = setPaginationDetails({...res});
                    })
                );
        }
    }

    getMovie(movieId: string | number): Observable<Movie> {
        if (this.auth.can('get:movies')) {
            return this.http.get<any>(this.url + '/movies/' + movieId)
                .pipe(
                    retry(3),
                    map((res) => {
                        const {movie} = res;
                        return movie;
                    })
                );
        }
    }


    saveMovie(movie: Movie): Observable<boolean> {
        this.loading = true;
        const movieData = {
            movie: {
                title: movie.title,
                release_date: movie.release_date,
            },
            actor_ids: movie.actor_ids
        };
        if (movie.id >= 0) { // patch
            return this.http.patch<any>(this.url + '/movies/' + movie.id, {...movieData})
                .pipe(
                    map(
                        (res: any) => {
                            this.loading = false;
                            this.actionSuccess = true;
                            this.toast.success(res.message);
                            const {id, title, release_date} = res.movie;
                            this.cinemas[id] = {id, title, release_date};
                            return true;
                        }
                    )
                );
        } else { // insert
            delete movie.id;
            const url = this.url + '/movies';
            return this.http.post<any>(url, movieData)
                .pipe(
                    map(
                        (res) => {
                            this.loading = false;
                            this.actionSuccess = true;
                            const {id, title, release_date} = res.movie;
                            this.cinemas[id] = {id, title, release_date};

                            this.toast.success(res.message);
                            return true;
                        }
                    )
                );


        }

    }


    deleteMovie(movieId: number) {
        delete this.cinemas[movieId];
        this.http.delete(this.url + '/movies/' + movieId)
            .subscribe(
                (res: any) => {
                    this.toast.success(res.message);
                });
    }

    moviesToCinemaItems(movies: Array<Movie>) {
        for (const movie of movies) {
            this.cinemas[movie.id] = movie;
        }
    }
}
