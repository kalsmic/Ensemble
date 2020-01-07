import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {AuthService} from './auth.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map, retry} from 'rxjs/operators';


export interface Actor {
    id?: number;
    name: string;
    gender?: string;
    age?: number;
}


@Injectable({
    providedIn: 'root'
})

export class ArtistService {

    url = environment.apiServerUrl;

    public actors: { [key: number]: Actor } = {};
    public actor: Actor;
    public page: number;
    public pages: number;
    public currentPage: number;
    public nextPage: number;
    public previousPage: number;
    public total: number;
    public hasNext: boolean;
    public hasPrevious: boolean;

    constructor(private auth: AuthService, private http: HttpClient) {
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
                    this.page = res.page;
                    this.currentPage = res.current_page;
                    this.total = res.total;
                    this.pages = res.pages;
                    this.nextPage = res.next_num;
                    this.previousPage = res.prev_num;
                    this.hasNext = res.has_next;
                    this.hasPrevious = res.has_prev;
                });

        }
    }

    saveArtist(artist: Actor) {
        if (artist.id >= 0) { // patch
            const artistData = {
                name: artist.name,
                age: artist.age,
                gender: artist.gender
            };
            this.http.patch(this.url + '/actors/' + artist.id, artistData, this.getHeaders())
                .subscribe((res: any) => {
                    if (res.success) {
                        this.actor = res.actor;
                    }
                });
        } else { // insert
            this.http.post(this.url + '/actors', artist, this.getHeaders())
                .subscribe((res: any) => {
                    if (res.success) {
                        this.actor = res.artist;
                    }
                });
        }

    }

    deleteArtist(artist: Actor) {
        delete this.actors[artist.id];
        this.http.delete(this.url + '/actors/' + artist.id, this.getHeaders())
            .subscribe((res: any) => {

            });
    }

    searchActor(searchTerm: string): Observable<Actor[]> {
        return this.http.get<any>(this.url + '/actors/search?searchterm='.concat(searchTerm))
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
