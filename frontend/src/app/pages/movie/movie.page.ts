import {Component, OnInit} from '@angular/core';
import {AuthService} from 'src/app/services/auth.service';
import {ModalController} from '@ionic/angular';
import {MovieService} from 'src/app/services/movie.service';
import {MovieFormComponent} from './movie-form/movie-form.component';


@Component({
    selector: 'app-movie',
    templateUrl: './movie.page.html',
    styleUrls: ['./movie.page.scss'],
})
export class MoviePage implements OnInit {
    Object = Object;

    constructor(
        private auth: AuthService,
        private modalCtrl: ModalController,
        public movies: MovieService,
    ) {
    }

    ngOnInit() {
        this.movies.getMovies().subscribe();
    }

    async openMovieForm(movieId: string = '') {
        if (!this.auth.can('get:movies')) {
            return;
        }

        const modal = await this.modalCtrl.create({
            component: MovieFormComponent,
            componentProps: {movieId, isNew: movieId === ''}
        });

        return await modal.present();
    }

    navigateToPage($event: number) {
        this.movies.getMovies($event);
    }

}
