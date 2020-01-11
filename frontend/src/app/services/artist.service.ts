import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {AuthService} from './auth.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map, retry} from 'rxjs/operators';
import {Actor, Pagination} from '../shared/models';
import {handleError, setPaginationDetails} from '../shared/utils';
import {ToastService} from './toast.service';


@Injectable({
    providedIn: 'root'
})

export class ArtistService {

    url = environment.apiServerUrl;

    public actors: { [key: number]: Actor } = {};
    public actor: Actor;
    public pagination: Pagination;
    public success = false;
    public loading: boolean;

    constructor(
        private auth: AuthService,
        private http: HttpClient,
        private toast: ToastService
    ) {
    }

    getHeaders() {
        const header = {
            headers: new HttpHeaders()
                .set('Authorization', `Bearer ${this.auth.activeJWT()}`)
        };
        return header;
    }

    getArtists(page?: number) {
        if (this.auth.can('get:actors')) {
            let url = this.url + '/actors';
            if (page) {
                url = url + '?page=' + page;
            }
            this.http.get(url, this.getHeaders())
                .subscribe((res: any) => {

                    this.actors = [];
                    this.artistsToItems(res.actors);
                    this.pagination = setPaginationDetails(res);
                });

        }
    }

    saveArtist(artist: Actor) {

        const actor = {
            name: artist.name,
            birth_date: artist.birth_date,
            gender: artist.gender
        };
        if (artist.id > 0) { // patch
            //
            this.http.patch(this.url + '/actors/' + artist.id, {actor}, this.getHeaders())
                .subscribe((res: any) => {
                        if (res.success) {
                            const {id, age, name, birth_date, gender} = res.actor;
                            this.actors[id] = {id, age, name, birth_date, gender};
                            this.toast.success(res.message);
                            this.success = res.success;
                            return res.message;

                        }
                    },
                    (error) => handleError(error));


        } else { // insert
            this.loading = true;

            this.http.post(this.url + '/actors', {actor}, this.getHeaders())
                .subscribe((res: any) => {
                        if (res.success) {
                            const {id, age, name, birth_date, gender} = res.actor;
                            this.actors[id] = {id, age, name, birth_date, gender};

                            this.toast.success(res.message);
                            this.success = res.success;

                        }
                    },
                    (error) => handleError(error));
        }

    }

    deleteArtist(artist: Actor) {
        this.loading = true;

        delete this.actors[artist.id];
        this.http.delete(this.url + '/actors/' + artist.id, this.getHeaders())
            .subscribe((res: any) => {
                    this.actor = res.artist;
                    this.toast.showToast(res.message, 'success');
                    this.success = res.success;

                },
                (error) => handleError(error));
    }


    searchActor(searchTerm: string, actorIds = []): Observable<Actor[]> {
        this.loading = true;

        const url = this.url + '/actors/search';
        const data = {actor_ids: actorIds, search_term: searchTerm};
        return this.http.post<any>(url, data, this.getHeaders())

            .pipe(
                retry(3),
                map((res) => {
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
