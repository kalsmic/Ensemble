import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map, retry} from 'rxjs/operators';

import {environment} from '../../../environments/environment';
import {AuthService} from '../../core/auth.service';
import {ToastService} from '../../core/toast.service';
import {Movie, Pagination} from '../../shared/models';
import {setPaginationDetails} from '../../shared/utils';


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
        private httpClient: HttpClient,
        private toast: ToastService
    ) {
    }

    getMovies = (page?: number): Observable<Movie[]> => {

        const url = page ? this.url + '/movies?page=' + page : this.url + '/movies';

        this.loading = true;
        return this.httpClient.get<any>(url)
            .pipe(
                retry(3),
                map((res: any) => {
                    this.loading = false;
                    this.pagination = setPaginationDetails({...res});
                    return res.movies;
                })
            );
    }

    getMovie = (movieId: string | number): Observable<Movie> => {
        this.loading = true;
        return this.httpClient.get<any>(this.url + '/movies/' + movieId)
            .pipe(
                retry(3),
                map((res) => {
                    this.loading = false;
                    return res.movie;
                })
            );
    }


    getMovieActors = (movieId: string | number, page?: number): Observable<any> => {

        const url = page ? this.url + '/movies/' + movieId + '/actors?page=' + page : this.url + '/movies/' + movieId + '/actors';

        this.loading = true;
        return this.httpClient.get<any>(url)
            .pipe(
                retry(3),
                map((res) => {
                    this.loading = false;
                    return {
                        pagination: setPaginationDetails({...res}),
                        actors: res.actors
                    };
                })
            );
    }

    saveMovie = (movie: Movie): Observable<any> => {
        this.loading = true;
        const movieData = {
            movie: {
                title: movie.title,
                release_date: movie.release_date,
            },
            actor_ids: movie.actor_ids
        };

        if (movie.id >= 0) { // patch
            const movieId = movie.id;
            return this.patchMovie(movieId, movieData);
        } else { // insert
            delete movie.id;
            return this.postMovie(movieData);
        }
    }


    deleteMovie = (movieId: number) => {
        this.loading = true;
        delete this.cinemas[movieId];
        return this.httpClient.delete<any>(this.url + '/movies/' + movieId)
            .subscribe((res: any) => {
                this.loading = false;
                return this.toast.success(res.message);

            });
    }

    private postMovie = (movieData) => this.httpClient.post<any>(this.url + '/movies', movieData)
        .pipe(
            map((res) => {
                this.loading = false;
                this.actionSuccess = true;
                const {id, title, release_date} = res.movie;
                this.cinemas[id] = {id, title, release_date};

                this.toast.success(res.message);
                return {message: res.message, loading: res.success};
            })
        )

    private patchMovie = (movieId, movieData) => this.httpClient.patch<any>(this.url + '/movies/' + movieId, movieData)
        .pipe(
            map((res: any) => {
                this.loading = false;
                this.actionSuccess = true;
                this.toast.success(res.message);
                const {id, title, release_date} = res.movie;
                this.cinemas[id] = {id, title, release_date};
                return {message: res.message, loading: res.success};
            })
        )
}
