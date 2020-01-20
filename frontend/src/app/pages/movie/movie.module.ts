import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatTooltipModule} from '@angular/material/tooltip';
import {RouterModule, Routes} from '@angular/router';

import {CoreModule} from '../../core/core.module';
import {MiniPaginationComponent} from '../mini-pagination/mini-pagination.component';
import {PaginationModule} from '../pagination/pagination.module';
import {MovieActorsComponent} from './movie-actors/movie-actors.component';
import {MovieFormComponent} from './movie-form/movie-form.component';
import {MoviePage} from './movie.page';


const routes: Routes = [
    {path: '', component: MoviePage,},
];

@NgModule({
    imports: [
        FormsModule,
        CoreModule,
        RouterModule.forChild(routes),
        PaginationModule,
        ReactiveFormsModule,
        MatTooltipModule


    ],
    entryComponents: [MovieFormComponent, MovieActorsComponent],
    declarations: [MoviePage, MovieFormComponent, MovieActorsComponent, MiniPaginationComponent
    ]
})
export class MoviePageModule {
}
