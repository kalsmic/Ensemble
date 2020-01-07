import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {MovieService} from '../../../services/movie.service';
import {ModalController} from '@ionic/angular';
import {ArtistService} from '../../../services/artist.service';
import {Actor, Movie, MovieError} from '../../../shared/models';
import {formatDate} from '../../../shared/utils';


@Component({
    selector: 'app-movie-form',
    templateUrl: './movie-form.component.html',
    styleUrls: ['./movie-form.component.scss'],
})
export class MovieFormComponent implements OnInit {

    @Input() movieId: string;
    @Input() isNew: boolean;
    Object = Object;
    filteredActors: Actor[];
    actorIds = new Set<number>();
    movie: Movie;
    actorSearchFilter: string;
    errors: MovieError = {
        title: '',
        release_date: '',
        actors: ''
    };

    constructor(
        public auth: AuthService,
        private modalCtrl: ModalController,
        private movieService: MovieService,
        private artistService: ArtistService,
    ) {
    }

    get actorFilter(): string {
        return this.actorSearchFilter;
    }

    set actorFilter(value: string) {
        this.actorSearchFilter = value;
        this.searchActor();
    }

    ngOnInit() {
        if (this.isNew || this.movieId === '') {
            this.movie = {
                id: -1,
                title: '',
                release_date: '',
                actors: []
            };
        } else {
            this.movieService.getMovie(this.movieId).subscribe(movie =>
                this.movie = movie);
        }
    }


    searchActor() {
        const actorIds = this.getActorIds();

        if (this.actorFilter) {
            this.artistService.searchActor(this.actorFilter, actorIds).subscribe(actors => {
                this.filteredActors = actors;
            });
        }
    }

    customTrackBy(index: number, obj: any): any {
        return index;
    }

    addActor(actor: Actor) {
        const {id, name} = actor;
        this.actorIds.add(id);
        this.movie.actors.splice(this.movie.actors.length + 1, 0, {id, name});
        this.actorFilter = '';
        this.filteredActors = [];
    }

    removeActor(i: number) {
        this.movie.actors.splice(i, 1);
    }

    closeModal() {
        this.modalCtrl.dismiss();
    }

    getActorIds() {
        const selectedIds = this.movie.actors.map(({id}) => id);
        return [...new Set(selectedIds)];
    }

    validateMovieForm() {
        const {title, release_date} = this.movie;
        if (!title) {
            this.errors.title = 'Provide title';
        }
        if (!release_date) {
            this.errors.release_date = 'Provide release Date';
        }
    }


    saveMovie() {
        const {release_date} = this.movie;

        const actorIds = this.getActorIds();
        this.validateMovieForm();
        if (release_date) {
            this.movie.release_date = formatDate(release_date);
            this.movieService.saveMovie(this.movie, actorIds);

            this.closeModal();
        }
    }

    deleteClickedMovie() {
        this.movieService.deleteMovie(this.movie.id);
        this.closeModal();
    }


}


