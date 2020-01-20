import {Component, Input, OnInit} from '@angular/core';

import {environment} from '../../../../environments/environment';
import {MovieActor, Pagination} from '../../../shared/models';
import {MovieService} from '../movie.service';

@Component({
    selector: 'app-movie-actors',
    templateUrl: './movie-actors.component.html',
    styleUrls: ['./movie-actors.component.scss'],
})
export class MovieActorsComponent implements OnInit {
    movieActors: MovieActor[] = [];
    @Input() movieId: string;
    url = environment.apiServerUrl;
    @Input() showActors = false;
    pagination: Pagination = {
        pages: 0,
        currentPage: 0,
        nextPage: null,
        previousPage: null,
        total: 0,
        hasNext: false,
        hasPrevious: false,
    };
    loading = false;
    isSubmitted = false;

    constructor(private movieService: MovieService) {
    }


    ngOnInit() {
        this.getMovieActors();
    }


    getMovieActors(pageNumber: number = 0) {
        this.isSubmitted = true;
        this.showActors = true;
        this.loading = true;
        this.movieService.getMovieActors(this.movieId, pageNumber).subscribe((res) => {
            this.loading = false;
            const {pagination, actors} = res;
            this.pagination = pagination;
            this.movieActors = actors;
        });
    }

    goToPage($event: number) {
        this.getMovieActors($event);
    }

}
