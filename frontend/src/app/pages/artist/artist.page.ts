import {Component, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';

import {AuthService} from 'src/app/core/auth.service';
import {ArtistService} from 'src/app/pages/artist/artist.service';
import {Actor} from '../../shared/models';
import {ArtistFormComponent} from './artist-form/artist-form.component';


@Component({
    selector: 'app-artist',
    templateUrl: './artist.page.html',
    styleUrls: ['./artist.page.scss'],
})
export class ArtistPage implements OnInit {
    Object = Object;

    constructor(
        public auth: AuthService,
        private modalCtrl: ModalController,
        public artists: ArtistService,
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
            backdropDismiss: false,
            showBackdrop: true,
            animated: true,
            componentProps: {artist: activeartist, isNew: !activeartist}
        });

        await modal.present();

    }

    navigateToPage($event: number) {
        this.artists.getArtists($event);
    }


}
