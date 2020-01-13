import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

import {IonicModule} from '@ionic/angular';
import {MoviePage} from './movie.page';
import {MovieFormComponent} from './movie-form/movie-form.component';
import {PaginationModule} from '../pagination/pagination.module';
import {MatDatepickerModule} from '@angular/material';
import {MovieActorsComponent} from "./movie-actors/movie-actors.component";
import {MiniPaginationComponent} from "../mini-pagination/mini-pagination.component";


const routes: Routes = [
    {
        path: '',
        component: MoviePage,

    }


];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(routes),
        IonicModule,
        PaginationModule,
        ReactiveFormsModule,
        MatDatepickerModule


    ],
    entryComponents: [MovieFormComponent],
    declarations: [MoviePage, MovieFormComponent, MovieActorsComponent, MiniPaginationComponent
    ]
})
export class MoviePageModule {
}
