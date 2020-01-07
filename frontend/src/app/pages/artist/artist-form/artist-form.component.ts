import {Component, Input, OnInit} from '@angular/core';
import {Actor, ArtistService} from 'src/app/services/artist.service';
import {AuthService} from 'src/app/services/auth.service';
import {ModalController} from '@ionic/angular';

@Component({
    selector: 'app-artist-form',
    templateUrl: './artist-form.component.html',
    styleUrls: ['./artist-form.component.scss'],
})
export class ArtistFormComponent implements OnInit {
    @Input() artist: Actor;
    @Input() isNew: boolean;

    constructor(
        public auth: AuthService,
        private modalCtrl: ModalController,
        private artistService: ArtistService,
    ) {
    }

    ngOnInit() {
        if (this.isNew) {
            this.artist = {
                id: -1,
                name: '',
                age: 18,
                gender: 'M'
            };
        }
    }

    closeModal() {
        this.modalCtrl.dismiss();
    }


    addArtist() {
        this.artistService.saveArtist(this.artist);
        this.closeModal();
    }

    deleteArtist() {
        this.artistService.deleteArtist(this.artist);
        this.closeModal();
    }

    saveArtist() {
        this.artistService.saveArtist(this.artist);
        this.closeModal();
    }


}
