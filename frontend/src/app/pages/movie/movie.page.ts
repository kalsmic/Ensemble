import {Component, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';

import {AuthService} from 'src/app/core/auth.service';
import {MovieService} from 'src/app/pages/movie/movie.service';
import {Movie} from '../../shared/models';
import {formatDate} from '../../shared/utils';
import {MovieFormComponent} from './movie-form/movie-form.component';


@Component({
    selector: 'app-movie',
    templateUrl: './movie.page.html',
    styleUrls: ['./movie.page.scss'],
})
export class MoviePage implements OnInit {
    Object = Object;
    movie: Movie;

    constructor(
        public auth: AuthService,
        private modalCtrl: ModalController,
        public movies: MovieService,
    ) {
    }

    ngOnInit = () => this.movies.getMovies().subscribe();

    openMovieForm = async (activeMovie: Movie = null) => {
        if (!this.auth.can('get:movies')) {
            return;
        }

        const modal = await this.modalCtrl.create({
            component: MovieFormComponent,
            componentProps: {movie: activeMovie, isNew: !activeMovie}
        });

        return await modal.present();
    }

    navigateToPage = ($event: number) => this.movies.getMovies($event);

    displayDate = (releaseDate: string) => formatDate(releaseDate, 'DD-MMMM-YYYY');

}
