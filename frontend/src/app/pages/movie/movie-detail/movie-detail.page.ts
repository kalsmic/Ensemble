import {Component, OnDestroy, OnInit} from '@angular/core';

import {ActivatedRoute} from '@angular/router';

import {AuthService} from 'src/app/services/auth.service';
import {MovieService} from 'src/app/services/movie.service';


@Component({
    selector: 'app-movie-detail',
    templateUrl: './movie-detail.page.html',
    styleUrls: ['./movie-detail.page.scss'],
})
export class MovieDetailPage implements OnInit, OnDestroy {
    movieId: number;
    private sub: any;

    constructor(
        private route: ActivatedRoute,
        private auth: AuthService,
        public movies: MovieService,
    ) {
    }

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            this.movieId = +params.id;
            console.log('movie id', this.movieId);
            this.movies.getMovie(this.movieId);
        });
    }


    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    deleteMovie(movieId: number) {
        this.movies.deleteMovie(movieId);
    }


}
