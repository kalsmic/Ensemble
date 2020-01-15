import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {AuthService} from './auth.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map, retry} from 'rxjs/operators';
import {Actor, initialPagination, Pagination} from '../shared/models';
import {setPaginationDetails} from '../shared/utils';
import {ToastService} from './toast.service';


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


    getArtists(page?: number) {
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

    saveArtist(artist: Actor): Observable<any> {
        this.loading = true;
        const actor = {
            name: artist.name,
            birth_date: artist.birth_date,
            gender: artist.gender
        };
        if (artist.id > 0) { // patch

            return this.http.patch<any>(this.url + '/actors/' + artist.id, {actor})
                .pipe(
                    map((res: any) => {
                        this.loading = false;
                        const {id, age, name, birth_date, gender} = res.actor;
                        this.actors[id] = {id, age, name, birth_date, gender};
                        this.toast.success(res.message);
                        this.success = res.success;
                        return {message: res.message, loading: res.success};
                    })
                );


        } else { // insert
            return this.http.post<any>(this.url + '/actors', {actor})
                .pipe(
                    map((res: any) => {
                        this.loading = false;
                        const {id, age, name, birth_date, gender} = res.actor;
                        this.actors[id] = {id, age, name, birth_date, gender};
                        this.toast.success(res.message);
                        this.success = res.success;
                        return {message: res.message, loading: res.success};

                    })
                );
        }

    }

    deleteArtist(artist: Actor) {
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


    searchActor(searchTerm: string, actorIds = []): Observable<Actor[]> {
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


    artistsToItems(artists: Array<Actor>) {
        for (const artist of artists) {
            this.actors[artist.id] = artist;
        }
    }
}
