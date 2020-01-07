import {Component, Input, OnInit} from '@angular/core';
import {ArtistService} from 'src/app/services/artist.service';
import {AuthService} from 'src/app/services/auth.service';
import {ModalController} from '@ionic/angular';
import {Actor} from '../../../shared/models';
import {formatDate} from '../../../shared/utils';

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
                birth_date: '',
                gender: 'M'
            };
        }
    }

    closeModal() {
        this.modalCtrl.dismiss();
    }

    deleteArtist() {
        this.artistService.deleteArtist(this.artist);
        this.closeModal();
    }

    saveArtist() {
        const {name, birth_date, gender} = this.artist;
        if (name && birth_date && gender) {
            this.artist.birth_date = formatDate(birth_date);
            this.artistService.saveArtist(this.artist);
            this.closeModal();
        }
    }


}
