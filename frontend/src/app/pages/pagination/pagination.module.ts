import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PaginationComponent} from './pagination.component';
import {IonicModule} from '@ionic/angular';


@NgModule({
    declarations: [
        PaginationComponent,
    ],
    imports: [
        CommonModule,
        IonicModule
    ],
    entryComponents: [PaginationComponent],

    exports: [PaginationComponent],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ]

})
export class PaginationModule {
}
