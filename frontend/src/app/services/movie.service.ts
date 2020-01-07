import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {AuthService} from './auth.service';

import {HttpClient, HttpHeaders} from '@angular/common/http';
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
    public cinema: Movie;
    public pagination: Pagination;

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

    // getMovies(page?: number) {
    //     if (this.auth.can('get:movies')) {
    //         let url = this.url + '/movies';
    //         if (page) {
    //             url = url + '?page=' + page;
    //         }
    //         this.http.get(url, this.getHeaders())
    //             .subscribe((res: any) => {
    //                 this.cinemas = [];
    //                 this.moviesToCinemaItems(res.movies);
    //                 this.pagination = setPaginationDetails({...res});
    //
    //             });
    //
    //     }
    // }
    getMovies(page?: number): Observable<void> {

        const url = page ? this.url + '/movies?page=' + page : this.url + '/movies';

        if (this.auth.can('get:movies')) {
            return this.http.get<any>(url, this.getHeaders())
                .pipe(
                    retry(3),
                    map((res) => {
                        const {movies} = res;
                        this.cinemas = [];
                        this.moviesToCinemaItems(res.movies);
                        this.pagination = setPaginationDetails({...res});
                    })
                );
        }
    }

    getMovie(movieId: string): Observable<Movie> {

        if (this.auth.can('get:movies')) {
            return this.http.get<any>(this.url + '/movies/' + movieId, this.getHeaders())
                .pipe(
                    retry(3),
                    map((res) => {
                        const {movie} = res;
                        return movie;
                    })
                );
        }
    }

    saveMovie(movie: Movie, actorIds) {

        const movieData = {
            title: movie.title,
            release_date: movie.release_date,
            actors: actorIds
        };
        if (movie.id >= 0) { // patch
            this.http.patch(this.url + '/movies/' + movie.id, {movie: movieData}, this.getHeaders())
                .subscribe((res: any) => {
                        if (res.success) {
                            this.cinema = res.movie;
                            this.toast.showToast(res.message, 'success');
                            const {id, title, release_date} = res.movie;
                            this.cinemas[id] = {id, title, release_date};
                            return res.message;


                        }
                    },
                    err => {
                        this.toast.showToast('Error updating movie', 'danger');
                        return err.error;
                    });
        } else { // insert
            console.log('insert', 'actorIds', actorIds);

            delete movie.id;
            this.http.post(this.url + '/movies', {movie: movieData}, this.getHeaders())
                .subscribe((res: any) => {
                        if (res.success) {
                            // this.cinemas = res.movie;
                            const {id, title, release_date} = res.movie;
                            this.cinemas[id] = {id, title, release_date};

                            this.toast.showToast(res.message, 'success');

                        }
                    },
                    err => {

                        this.toast.showToast(err.error, 'danger');
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
}
