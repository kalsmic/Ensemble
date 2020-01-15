import {Component, Input, OnInit} from '@angular/core';
import {MovieService} from '../../../services/movie.service';
import {MovieActor, Pagination} from '../../../shared/models';
import {environment} from '../../../../environments/environment';

@Component({
    selector: 'app-movie-actors',
    templateUrl: './movie-actors.component.html',
    styleUrls: ['./movie-actors.component.scss'],
})
export class MovieActorsComponent implements OnInit {
    movieActors: MovieActor[] = [];
    @Input() movieId: string;
    url = environment.apiServerUrl;
    showActors = false;
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
