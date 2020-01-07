import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TabsPage} from './tabs.page';

const routes: Routes = [
    {
        path: 'tabs',
        component: TabsPage,
        children: [
            {path: 'user-page', loadChildren: '../user-page/user-page.module#UserPagePageModule'},
            {path: 'artists', loadChildren: '../artist/artist.module#ArtistPageModule'},
            {
                path: 'movies',
                loadChildren: '../movie/movie.module#MoviePageModule'
            },
            {
                path: '',
                redirectTo: '/tabs/user-page',
                pathMatch: 'full'
            },
        ]
    },
    {
        path: '',
        redirectTo: '/tabs/movies',
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class TabsPageRoutingModule {
}
