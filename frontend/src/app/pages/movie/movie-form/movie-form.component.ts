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
                actors: [],
                actor_ids: []
            };
        } else {
            this.movieService.getMovie(this.movieId).subscribe(movie => {
                    const {id, title, release_date, movie_crew: actors, actor_ids} = movie;
                    this.movie = {id, title, release_date, actors, actor_ids};
                }
            );
        }

    }


    searchActor() {
        if (this.actorFilter) {
            this.artistService.searchActor(this.actorFilter, this.movie.actor_ids).subscribe(actors => {
                this.filteredActors = actors;
            });
        }
    }

    handleSearchBar(event) {
        const {target: {value: searchTerm}} = event;
        this.actorFilter = searchTerm;
    }

    customTrackBy(index: number, obj: any): any {
        return index;
    }

    addActor(newActor: Actor) {

        const {id, name} = newActor;
        const actor = {actor: {id, name}};
        this.movie.actors.splice(this.movie.actors.length + 1, 0, actor);
        this.movie.actor_ids.push(id);
        this.actorFilter = '';
        this.filteredActors = [];

    }

    removeActor(i: number, actorId: number) {
        this.movie.actors.splice(i, 1);
        this.movie.actor_ids.splice(i, 1);
    }

    closeModal() {
        this.modalCtrl.dismiss();
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

        this.validateMovieForm();
        if (release_date) {
            this.movie.release_date = formatDate(release_date);
            this.movieService.saveMovie(this.movie);

            this.closeModal();
        }
    }

    deleteClickedMovie() {
        this.movieService.deleteMovie(this.movie.id);
        this.closeModal();
    }


}


