import {CommonModule} from '@angular/common';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {IonicModule} from '@ionic/angular';

import {PaginationComponent} from './pagination.component';


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
