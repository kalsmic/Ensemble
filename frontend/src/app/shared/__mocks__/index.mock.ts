import {Injectable} from '@angular/core';
import {of as observableOf} from 'rxjs';
import {initialPagination, Movie, Pagination} from '../models';

// @ts-ignore
const mockFn = jest.fn;
export const statusBarSpy = {styleDefault: mockFn()};
export const splashScreenSpy = {hide: mockFn()};
export const platformReadySpy = mockFn().mockImplementation(() => Promise.resolve());

export const platformSpy = {
    ready: platformReadySpy
};

export const routerSpy = {navigate: mockFn()};
export const authServiceMethodsSpy = {
    buildLoginLink: mockFn().mockImplementation(() => ''),
    loadJWTs: () => mockFn().mockImplementation(() => {
    }),
    checkTokenFragment: () => mockFn().mockImplementation(() => {
    })
};

@Injectable()
export class AuthServiceSpy {

    payload ={
        permissions:[
            'get:actors',
            'post:actors',
            'patch:actors',
            'delete:actors',
            'get:movies',
            'post:movies',
            'patch:movies',
            'delete:movies'
        ]
    }

    can = mockFn();
    activeJWT = mockFn();
    logout = mockFn();
    isAuthenticated = mockFn();
    decodeJWT = mockFn();

}

export const dummyMovies = [
    {id: 1, title: 'my movie title', release_date: '2020-01-01', actor_ids: []}
];

export const actors = [
    {id: 1, name: 'actor Name', age: 12, gender: 'm', birth_date: '2005-01-01'},
    {id: 2, name: 'Actor z', age: 34, gender: 'f', birth_date: '2006-01-01'}
];

@Injectable()
export class MovieServiceSpy {
    movies: Movie[];
    pagination: Pagination = initialPagination;

    getMovieActors = mockFn().mockReturnValue(observableOf({
        actors: [{actor: {id: 1, name: 'actor Name'}}],
        pagination: initialPagination
    }));

    getMovie = mockFn().mockReturnValue(observableOf({
        movie: dummyMovies[0],
        actors: {},
        actor_ids: {}
    }));

    getMovies = mockFn().mockReturnValue(observableOf({
        movies: dummyMovies
    }));

    saveMovie = mockFn().mockReturnValue(observableOf({}));

    deleteMovie = mockFn();
}


@Injectable()
export class ArtistServiceSpy {
    getArtists = mockFn();
    deleteArtist = mockFn();
    saveArtist = mockFn().mockReturnValue(
        observableOf({loading: {}})
    );
    sA = mockFn(() => ({
        subscribe: mockFn().mockReturnValue(observableOf({
            error: {message: 'Actor already exists'}
        }))
    }));
}

export const modalControllerSpy = {
    create: mockFn(() => ({present: mockFn()})),
    dismiss: mockFn()

};

export const paginationMock = {
    pages: 0,
    current_page: 1,
    next_num: null,
    prev_num: null,
    total: 0,
    has_next: false,
    has_prev: false
};


@Injectable()
export class MockToastService {
    success = mockFn();
    error = mockFn();
}
