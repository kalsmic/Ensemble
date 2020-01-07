import {Component, OnInit} from '@angular/core';
import {AuthService} from 'src/app/services/auth.service';
import {ModalController} from '@ionic/angular';
import {Movie, MovieService} from 'src/app/services/movie.service';
import {Router} from '@angular/router';
import {MovieFormComponent} from './movie-form/movie-form.component';
// import {ArtistService} from '../../services/artist.service';


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
        private router: Router,
        // public artistService: ArtistService,

    ) {
    }

    ngOnInit() {
        this.movies.getMovies();
        // this.artistService.getArtists();

    }

    goToMovieDetails(movieId: number) {
        this.router.navigate(['tabs/movies', movieId]);
    }

    async openMovieForm(activemovie: Movie = null) {
        if (!this.auth.can('get:movies')) {
            return;
        }

        if (activemovie) {
            this.movies.getMovie(activemovie.id);
            activemovie = this.movies.cinema;

        }
        const artistList  =  [
            {
                gender: 'M',
                age: 23,
                id: 2,
                name: 'ssadr'
            },
            {
                gender: 'M',
                age: 23,
                id: 3,
                name: 'Arthur'
            },
            {
                gender: 'M',
                age: 23,
                id: 4,
                name: 'Kalule'
            }
        ];
        const modal = await this.modalCtrl.create({
            component: MovieFormComponent,
            // componentProps: {movie: activemovie, isNew: !activemovie, artistList: this.artistService.actors } });
            componentProps: {movie: activemovie, isNew: !activemovie, artistList } });

        modal.present();
    }

    navigateToPage($event: number) {
        this.movies.getMovies($event);
    }

}
