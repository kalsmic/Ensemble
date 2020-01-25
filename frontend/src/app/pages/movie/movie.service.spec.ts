import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {getTestBed, TestBed} from '@angular/core/testing';
import {Router} from '@angular/router';

import {environment} from '../../../environments/environment';
import {ToastService} from '../../core/toast.service';
import { MockToastService, paginationMock, routerSpy} from '../../shared/__mocks__/index.mock';
import {initialPagination, Movie} from '../../shared/models';

import {MovieService} from './movie.service';

const dummyMovies = [{
    id: 1,
    title: 'mine',
    release_date: '2019-01-01',
    actor_ids: [],
    movie_crew: [],
    actors: []
}];

describe('MovieService', () => {
    let httpMock;
    let testBed: TestBed;
    const url = environment.apiServerUrl;


    let movieService: MovieService, toast: ToastService;


    beforeEach(() => {
        TestBed.configureTestingModule({

                imports: [HttpClientTestingModule],
                providers: [
                    MovieService,
                    {provide: Router, useValue: routerSpy},
                    {provide: ToastService, useValue: MockToastService},
                ]
            }
        );

        testBed = getTestBed();

        movieService = testBed.get(MovieService);
        httpMock = testBed.get(HttpTestingController);
        toast = testBed.get(ToastService);
        toast.success = jest.fn();

    });

    afterEach(() => {
        httpMock.verify();
        jest.clearAllMocks();
        jest.resetAllMocks();
    });


    it('should be created', () => {
        expect(movieService).toBeDefined();
    });


    it('should run #getMovies', () => {
        let movies: Movie[];
        movieService.getMovies().subscribe(data => movies = data);

        const req = httpMock.expectOne(`${url}/movies`);
        expect(req.request.method).toBe('GET');

        req.flush({movies: dummyMovies, ...paginationMock});

        expect(movies.length).toBe(1);
        expect(movies).toMatchObject(dummyMovies);

    });

    it('should run #getMovie', () => {

        let movie: Movie;
        movieService.getMovie(1).subscribe(data => movie = data);

        const req = httpMock.expectOne(`${url}/movies/1`);
        expect(req.request.method).toBe('GET');
        req.flush({movie: dummyMovies[0]});
        expect(movie).toMatchObject(dummyMovies[0]);
    });

    it('should run #getMovieActors', () => {

        const actors = [
            {actor: {id: 1, name: 'James B'}},
            {actor: {id: 2, name: 'Micheal J'}},
        ];
        let response: any = {};

        movieService.getMovieActors(1).subscribe(data => response = data);
        const req = httpMock.expectOne(`${url}/movies/1/actors`);
        expect(req.request.method).toBe('GET');

        req.flush({actors, ...paginationMock});
        expect(response.actors).toMatchObject(actors);
        expect(response.pagination).toMatchObject(initialPagination);
    });

    it('should run #postMovie', () => {
        const movie = {
            id: -1,
            title: 'My new Movie',
            release_date: '2019-01-01',
            actor_ids: [1, 2]
        };

        let response: any;
        expect(movieService.loading).toBeFalsy();

        movieService.saveMovie(movie).subscribe(data => response = data);
        const req = httpMock.expectOne(`${url}/movies`);

        expect(movieService.loading).toBeTruthy();
        expect(req.request.method).toBe('POST');
        movie.id = 5;

        req.flush({message: 'Movie created successfully', success: true, movie});
        expect(movieService.loading).toBeFalsy();

        const newMovie = movieService.cinemas[5];
        expect(newMovie.id).toBe(movie.id);
        expect(newMovie.title).toBe(movie.title);
        expect(newMovie.release_date).toBe(movie.release_date);
        expect(toast.success).toBeCalledWith('Movie created successfully');
    });

    it('should run #patchMovie', () => {
        const movie = {
            id: 10,
            title: 'Edit my Movie',
            release_date: '2019-01-01',
        };
        movieService.cinemas = {10: movie};

        let response: { message: string, loading: boolean };
        expect(movieService.loading).toBeFalsy();

        movieService.saveMovie(movie).subscribe(data => response = data);
        const req = httpMock.expectOne(`${url}/movies/10`);

        expect(movieService.loading).toBeTruthy();
        expect(req.request.method).toBe('PATCH');
        req.flush({message: 'Movie edited successfully', movie});
        expect(movieService.loading).toBeFalsy();
        expect(movieService.actionSuccess).toBeTruthy();
        expect(toast.success).toBeCalledWith('Movie edited successfully');

    });

    it('should run #deleteMovie', () => {

        expect(movieService.loading).toBeFalsy();
        movieService.deleteMovie(1);
        const req = httpMock.expectOne(`${url}/movies/1`);

        expect(movieService.loading).toBeTruthy();
        expect(req.request.method).toBe('DELETE');
        req.flush({message: 'Movie deleted successfully', success: true});
        expect(movieService.loading).toBeFalsy();
        expect(toast.success).toBeCalledWith('Movie deleted successfully');

    });

});
