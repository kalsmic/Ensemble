import {Component, OnInit} from '@angular/core';
import {AuthService} from 'src/app/services/auth.service';
import {ModalController} from '@ionic/angular';
import {Actor, ArtistService} from 'src/app/services/artist.service';
import {Router} from '@angular/router';
import {ArtistFormComponent} from './artist-form/artist-form.component';


@Component({
    selector: 'app-artist',
    templateUrl: './artist.page.html',
    styleUrls: ['./artist.page.scss'],
})
export class ArtistPage implements OnInit {
    Object = Object;

    constructor(
        private auth: AuthService,
        private modalCtrl: ModalController,
        public artists: ArtistService,
        private router: Router
    ) {
    }

    ngOnInit() {
        this.artists.getArtists();
    }


    async openArtistForm(activeartist: Actor = null) {
        if (!this.auth.can('get:actors')) {
            return;
        }

        const modal = await this.modalCtrl.create({
            component: ArtistFormComponent,
            componentProps: {artist: activeartist, isNew: !activeartist}
        });

        modal.present();
    }

    navigateToPage($event: number) {
        this.artists.getArtists($event);
    }


}
