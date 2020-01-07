import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

import {IonicModule} from '@ionic/angular';
import {MoviePage} from './movie.page';
import {MovieDetailPage} from './movie-detail/movie-detail.page';
import {MovieFormComponent} from './movie-form/movie-form.component';
import {PaginationModule} from '../pagination/pagination.module';


const routes: Routes = [
    {
        path: '',
        component: MoviePage,

    },
    {
        path: ':id',
        component: MovieDetailPage
    }


];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(routes),
        IonicModule,
        PaginationModule


    ],
    entryComponents: [MovieFormComponent],
    declarations: [MoviePage, MovieFormComponent, MovieDetailPage
    ]
})
export class MoviePageModule {
}
