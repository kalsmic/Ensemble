import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {AuthService} from './auth.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, map, retry} from 'rxjs/operators';
import {Actor, Pagination} from '../shared/models';
import {setPaginationDetails} from '../shared/utils';
import {ToastService} from './toast.service';


@Injectable({
    providedIn: 'root'
})

export class ArtistService {

    url = environment.apiServerUrl;

    public actors: { [key: number]: Actor } = {};
    public actor: Actor;
    public pagination: Pagination;
    public error: any;
    public errorMessage: any;
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
            this.loading = true;
            let url = this.url + '/actors';
            if (page) {
                url = url + '?page=' + page;
            }
            this.http.get(url, this.getHeaders())
                .subscribe((res: any) => {
                    this.loading = false;

                    this.actors = [];
                    this.artistsToItems(res.actors);
                    this.pagination = setPaginationDetails(res);
                });

        }
    }

    saveArtist(artist: Actor) {
        this.loading = true;

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
                            this.loading = false;

                            const {id, age, name, birth_date, gender} = res.actor;
                            this.actors[id] = {id, age, name, birth_date, gender};
                            this.toast.success(res.message);
                            this.success = res.success;
                            return res.message;

                        }
                    },
                    err => {
                        this.loading = false;

                        this.error = err.error;
                        console.log(err.response);
                        this.toast.error(this.error);

                        if ('message' in err) {
                            this.errorMessage = err.message;
                        }
                        return err.error;
                    }
                );
        } else { // insert
            this.loading = true;

            this.http.post(this.url + '/actors', {actor}, this.getHeaders())
                .subscribe((res: any) => {
                        if (res.success) {
                            this.loading = false;

                            const {id, age, name, birth_date, gender} = res.actor;
                            this.actors[id] = {id, age, name, birth_date, gender};

                            this.toast.success(res.message);
                            this.success = res.success;


                        }
                    },
                    err => {
                        this.loading = false;

                        this.error = err.error;
                        this.toast.error(this.error);

                        if ('message' in err) {
                            this.errorMessage = err.message;
                        }
                        return err.error;
                    });
        }

    }

    deleteArtist(artist: Actor) {
        this.loading = true;

        delete this.actors[artist.id];
        this.http.delete(this.url + '/actors/' + artist.id, this.getHeaders())
            .subscribe((res: any) => {
                    this.loading = false;

                    this.actor = res.artist;
                    this.toast.showToast(res.message, 'success');
                    this.success = res.success;

                },
                catchError(this.handleError));
        // err => {
        //     this.toast.showToast(err.message, 'danger');
        //     return err.error;
        // });
    }

    handleError(error) {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
            // Get client-side error
            errorMessage = error.error.message;
            // this.toast.showToast(errorMessage, 'danger');
            // this.error = errorMessage;

        } else {
            // Get server-side error
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
            this.toast.showToast(errorMessage, 'danger');
            // this.error = errorMessage;
        }
        window.alert(errorMessage);
        return throwError(errorMessage);
    }

    searchActor(searchTerm: string, actorIds = []): Observable<Actor[]> {
        this.loading = true;

        const url = this.url + '/actors/search';
        const data = {actor_ids: actorIds, search_term: searchTerm};
        return this.http.post<any>(url, data, this.getHeaders())

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
