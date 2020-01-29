import {Component, OnInit} from '@angular/core';
import {ModalController, PopoverController} from '@ionic/angular';

import {AuthService} from 'src/app/core/auth.service';
import {MovieService} from 'src/app/pages/movie/movie.service';
import {initialPagination, Movie, Pagination} from '../../shared/models';
import {formatDate} from '../../shared/utils';
import {MovieActorsComponent} from './movie-actors/movie-actors.component';
import {MovieFormComponent} from './movie-form/movie-form.component';


@Component({
    selector: 'app-movie',
    templateUrl: './movie.page.html',
    styleUrls: ['./movie.page.scss'],
})
export class MoviePage implements OnInit {
    movie: Movie;
    movies: Movie[];
    pagination: Pagination = initialPagination;
    loading = true;

    constructor(
        public authService: AuthService,
        private modalController: ModalController,
        private movieService: MovieService,
        private popoverController: PopoverController,
    ) {
    }

    ngOnInit() {
        this.getMovies();
    }

    openMovieForm = async (activeMovie: Movie = null) => {
        if (!this.authService.can('get:movies')) {
            return;
        }

        const modal = await this.modalController.create({
            component: MovieFormComponent,
            backdropDismiss: false,
            showBackdrop: true,
            animated: true,
            componentProps: {movie: activeMovie, isNew: !activeMovie}
        });

        return await modal.present();
    }

    getMovies = (page?: number) => {
        this.loading = true;
        this.movieService.getMovies(page).subscribe(
            (movies: Movie[]) => {
                this.pagination = this.movieService.pagination;
                this.movies = movies;
                this.loading = false;
            }
        );


    }

    presentActorsPopover = async (movieId: number) => {
        const popover = await this.popoverController.create({
            component: MovieActorsComponent,
            componentProps: {movieId, showActors: true},
        });
        return await popover.present();
    }

    navigateToPage = ($event: number) => this.getMovies($event);

    displayDate = (releaseDate: string) => formatDate(releaseDate, 'DD-MMMM-YYYY');

}
