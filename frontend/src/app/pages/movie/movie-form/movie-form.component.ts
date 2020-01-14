import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {MovieService} from '../../../services/movie.service';
import {ModalController} from '@ionic/angular';
import {ArtistService} from '../../../services/artist.service';
import {Actor, Movie} from '../../../shared/models';
import {formatDate} from '../../../shared/utils';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';


@Component({
    selector: 'app-movie-form',
    templateUrl: './movie-form.component.html',
    styleUrls: ['./movie-form.component.scss'],
})
export class MovieFormComponent implements OnInit {

    @Input() isNew: boolean;
    @Input() movie: Movie;
    Object = Object;
    errorMessage: string;
    filteredActors: any;
    actorSearchFilter: string;
    movieForm: FormGroup;
    disabledAction: boolean;
    isSubmitted = false;
    searchLoader = false;
    loading = false;
    isSearchSubmitted = false;

    constructor(
        public auth: AuthService,
        private modalCtrl: ModalController,
        private movieService: MovieService,
        private artistService: ArtistService,
        public formBuilder: FormBuilder,
    ) {
    }

    get actorFilter(): string {
        return this.actorSearchFilter;
    }

    set actorFilter(value: string) {
        this.actorSearchFilter = value;
        this.searchActor();
    }

    get errorControl() {
        return this.movieForm.controls;
    }

    ngOnInit() {
        if (this.isNew) {
            this.movie = {
                id: -1,
                title: '',
                release_date: '',
                actors: [],
                actor_ids: []
            };
        } else {

            this.movieService.getMovie(this.movie.id).subscribe(movie => {
                const {movie_crew: actors, actor_ids} = movie;
                this.movie.actors = actors;
                this.movie.actor_ids = actor_ids;
            });
        }
        this.disabledAction = !this.auth.can('patch:movies') || !this.auth.can('post:movies');
        this.movieForm = this.formBuilder.group({

            title: [{
                value: this.movie.title,
                disabled: this.disabledAction
            }, [Validators.required, Validators.minLength(2)]],
            release_date: [{value: this.movie.release_date, disabled: this.disabledAction}, [Validators.required]]
        });
    }

    searchActor() {
        if (this.actorFilter) {
            this.loading = true;
            this.searchLoader = true;
            this.isSearchSubmitted = true;

            this.artistService.searchActor(this.actorFilter, this.movie.actor_ids).subscribe(actors => {
                this.searchLoader = false;
                this.filteredActors = actors;
            });
        }
    }

    handleSearchBar(event) {
        const {target: {value: searchTerm}} = event;
        this.actorFilter = searchTerm;
    }

    customTrackBy(index: number): any {
        return index;
    }

    addActor(newActor: Actor, i) {

        const {id, name} = newActor;
        const actor = {actor: {id, name}};
        this.movie.actors.splice(this.movie.actors.length + 1, 0, actor);
        this.movie.actor_ids.push(id);
        // remove added item from filtered results
        this.filteredActors.splice(i, 1);
    }

    removeActor(i: number) {
        this.movie.actors.splice(i, 1);
        this.movie.actor_ids.splice(i, 1);
    }

    closeModal() {
        this.modalCtrl.dismiss();
    }


    saveMovie() {
        this.isSubmitted = true;
        this.loading = true;
        if (this.movieForm.valid) {

            const {title, release_date} = this.movieForm.value;
            this.movie.title = title;
            this.movie.release_date = formatDate(release_date);

            this.movieService.saveMovie(this.movie).subscribe(() => {
                this.loading = false;
                this.closeModal();

            }, error => {
                this.errorMessage = error.error.message;
                this.loading = false;
            });


        }

    }

    deleteClickedMovie() {
        this.movieService.deleteMovie(this.movie.id);
        this.closeModal();
    }


}


