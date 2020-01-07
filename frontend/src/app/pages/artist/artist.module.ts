import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

import {IonicModule} from '@ionic/angular';


import {ArtistPage} from './artist.page';
import {ArtistFormComponent} from './artist-form/artist-form.component';
import {PaginationModule} from '../pagination/pagination.module';

const routes: Routes = [
    {
        path: '',
        component: ArtistPage
    }


];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes),
        PaginationModule

    ],
    entryComponents: [ArtistFormComponent],
    declarations: [ArtistPage, ArtistFormComponent]
})
export class ArtistPageModule {
}
