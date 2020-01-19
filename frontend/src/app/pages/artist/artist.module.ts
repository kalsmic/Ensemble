import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import {CoreModule} from '../../core/core.module';
import {PaginationModule} from '../pagination/pagination.module';
import {ArtistFormComponent} from './artist-form/artist-form.component';


import {ArtistPage} from './artist.page';

const routes: Routes = [
    {
        path: '',
        component: ArtistPage
    }


];

@NgModule({
    imports: [
        FormsModule,
        CoreModule,
        RouterModule.forChild(routes),
        PaginationModule,
        ReactiveFormsModule,

    ],
    entryComponents: [ArtistFormComponent],
    declarations: [ArtistPage, ArtistFormComponent]
})
export class ArtistPageModule {
}
