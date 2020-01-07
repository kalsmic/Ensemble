import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {Movie, MovieService} from '../../../services/movie.service';
import {ModalController} from '@ionic/angular';
import {Actor, ArtistService} from '../../../services/artist.service';

@Component({
    selector: 'app-movie-form',
    templateUrl: './movie-form.component.html',
    styleUrls: ['./movie-form.component.scss'],
})
export class MovieFormComponent implements OnInit {
    @Input() movie: Movie;
    @Input() isNew: boolean;
    @Input() artistList: Array<Actor>;
    Object = Object;
    filteredActors: Actor[];
    actorIds: number[];
    
    constructor(
        public auth: AuthService,
        private modalCtrl: ModalController,
        private movieService: MovieService,
        private artistService: ArtistService
    ) {
    }
    actorSearchFilter: string;

    get actorFilter(): string {
        return this.actorSearchFilter;

    }

    set actorFilter(value: string) {
        this.actorSearchFilter = value;
        this.searchActor();
    }

    ngOnInit() {
        if (this.isNew) {
            this.movie = {
                id: -1,
                title: '',
                release_date: '',
                actors: []
            };
        } else {
            this.movie = this.movieService.cinema;
            this.movieService.getMovieActors(this.movie.id).subscribe(actors => {
                this.movie.actors = actors;
            });

        }
    }

    searchActor() {
        console.log('moviectros', this.movie.actors);
        if (this.actorFilter){
            this.artistService.searchActor(this.actorFilter).subscribe(actors => {
                this.filteredActors = actors;
            });
        }
    }
    customTrackBy(index: number, obj: any): any {
        return index;
    }

    addActor(actor: Actor) {
        const {id, name} = actor;
        this.movie.actors.splice(this.movie.actors.length + 1, 0, { role: '', actor: {id, name}});
        this.actorFilter = '';
        this.filteredActors = [];


    }

    removeActor(i: number) {
        this.movie.actors.splice(i, 1);
    }

    closeModal() {
        this.modalCtrl.dismiss();
    }

    removeEmptyActors() {
        const actors = this.movie.actors.filter((movieActor) => {
            return movieActor.role && movieActor.actor.id;
        });
        this.movie.actors = actors;
    }

    saveMovie() {
        this.removeEmptyActors();
        this.movieService.saveMovie(this.movie);
        this.closeModal();
    }

    deleteClickedMovie() {
        this.movieService.deleteMovie(this.movie.id);
        this.closeModal();
    }
}


