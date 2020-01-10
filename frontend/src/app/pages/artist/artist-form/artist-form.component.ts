import {Component, Input, OnInit} from '@angular/core';
import {ArtistService} from 'src/app/services/artist.service';
import {AuthService} from 'src/app/services/auth.service';
import {ModalController} from '@ionic/angular';
import {Actor} from '../../../shared/models';
import {formatDate} from '../../../shared/utils';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-artist-form',
    templateUrl: './artist-form.component.html',
    styleUrls: ['./artist-form.component.scss'],
})
export class ArtistFormComponent implements OnInit {
    @Input() artist: Actor;
    @Input() isNew: boolean;
    actorForm: FormGroup;
    isSubmitted = false;
    disabledAction: boolean;
    constructor(
        public auth: AuthService,
        private modalCtrl: ModalController,
        private artistService: ArtistService,
        public formBuilder: FormBuilder,
    ) {
    }

    get errorControl() {
        return this.actorForm.controls;
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
        this.disabledAction = !this.auth.can('patch:actors') || !this.auth.can('post:actors');

        this.actorForm = this.formBuilder.group({
            name: [{value: this.artist.name, disabled: this.disabledAction}, [Validators.required, Validators.minLength(2)]],
            gender: [{value: this.artist.gender, disabled: this.disabledAction}, [Validators.required,]],
            birth_date: [{value: this.artist.birth_date, disabled: this.disabledAction}, [Validators.required,]],
        });
    }


    closeModal() {
        this.modalCtrl.dismiss();
    }

    deleteArtist() {
        this.artistService.deleteArtist(this.artist);
        this.closeModal();
    }

    async saveArtist() {
        this.isSubmitted = true;
        if (!this.actorForm.valid) {
            console.log('provide all missing data');
        } else {
            console.log('actor_id', this.artist.id);

            const {name, birth_date, gender} = this.actorForm.value;

            this.artist.name = name;
            this.artist.birth_date = formatDate(birth_date);
            this.artist.gender = gender;
            const response = this.artistService.saveArtist(this.artist);
            this.closeModal();

            console.log(this.actorForm.value);
        }
    }


}
