import {Component, OnInit} from '@angular/core';
import {AuthService} from 'src/app/services/auth.service';
import {ModalController} from '@ionic/angular';
import {MovieService} from 'src/app/services/movie.service';
import {MovieFormComponent} from './movie-form/movie-form.component';
import {Movie} from '../../shared/models';


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

    ngOnInit() {
        this.movies.getMovies().subscribe();
    }

    async openMovieForm(activeMovie: Movie = null) {
        if (!this.auth.can('get:movies')) {
            return;
        }

        if (activeMovie) {
            console.log('activeMovie');
        }
        const modal = await this.modalCtrl.create({
            component: MovieFormComponent,
            componentProps: {movie: activeMovie, isNew: !activeMovie}
        });

        return await modal.present();
    }

    navigateToPage($event: number) {
        this.movies.getMovies($event);
    }

}
