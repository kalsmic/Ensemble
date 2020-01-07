import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PaginationComponent} from './pagination.component';


@NgModule({
    declarations: [
        PaginationComponent,
    ],
    imports: [
        CommonModule
    ],
    entryComponents: [PaginationComponent],

    exports: [PaginationComponent],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ]

})
export class PaginationModule {
}
