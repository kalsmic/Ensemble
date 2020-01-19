import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map, retry} from 'rxjs/operators';

import {environment} from '../../../environments/environment';
import {AuthService} from '../../core/auth.service';
import {ToastService} from '../../core/toast.service';
import {Actor, initialPagination, Pagination} from '../../shared/models';
import {setPaginationDetails} from '../../shared/utils';


@Injectable({
    providedIn: 'root'
})

export class ArtistService {

    url = environment.apiServerUrl;

    public actors: { [key: number]: Actor } = {};
    public actor: Actor;
    public pagination: Pagination = initialPagination;
    public success = false;
    public loading: boolean;

    constructor(
        private auth: AuthService,
        private http: HttpClient,
        private toast: ToastService
    ) {
    }


    getArtists = (page?: number) => {
        if (this.auth.can('get:actors')) {
            this.loading = true;
            let url = this.url + '/actors';
            if (page) {
                url = url + '?page=' + page;
            }
            this.http.get(url)
                .subscribe((res: any) => {
                    this.loading = false;
                    this.actors = [];
                    this.artistsToItems(res.actors);
                    this.pagination = setPaginationDetails(res);
                });

        }
    }

    saveArtist = (artist: Actor): Observable<any> => {
        this.loading = true;
        const {id: actorId, name, birth_date, gender} = artist;
        const actor = {name, birth_date, gender};

        if (actorId > 0) { // patch
            return this.patchActor(actorId, actor);
        } else { // insert
            return this.postActor(actor);
        }

    }

    deleteArtist = (artist: Actor) => {
        this.loading = true;

        delete this.actors[artist.id];
        this.http.delete(this.url + '/actors/' + artist.id)
            .subscribe((res: any) => {
                this.loading = false;
                this.actor = res.artist;
                this.toast.success(res.message);
                this.success = res.success;
            });
    }


    searchActor = (searchTerm: string, actorIds = []): Observable<Actor[]> => {
        this.loading = true;

        const url = this.url + '/actors/search';
        const data = {actor_ids: actorIds, search_term: searchTerm};
        return this.http.post<any>(url, data)

            .pipe(
                retry(3),
                map((res) => {
                    this.loading = false;
                    const {actors} = res;
                    return actors;
                })
            );
    }


    artistsToItems = (artists: Array<Actor>) => {
        for (const artist of artists) {
            this.actors[artist.id] = artist;
        }
    }

    private postActor = (actor) => this.http.post<any>(this.url + '/actors', {actor})
        .pipe(
            map((res: any) => {
                this.loading = false;
                const {id, age, name, birth_date, gender} = res.actor;
                this.actors[id] = {id, age, name, birth_date, gender};
                this.toast.success(res.message);
                this.success = res.success;
                return {message: res.message, loading: res.success};

            })
        )

    private patchActor = (actorId, actor) => this.http.patch<any>(this.url + '/actors/' + actorId, {actor})
        .pipe(
            map((res: any) => {
                this.loading = false;
                const {id, age, name, birth_date, gender} = res.actor;
                this.actors[id] = {id, age, name, birth_date, gender};
                this.toast.success(res.message);
                this.success = res.success;
                return {message: res.message, loading: res.success};
            })
        )
}
