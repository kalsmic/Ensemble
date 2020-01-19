import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import {Pagination} from '../../shared/models';

@Component({
    selector: 'app-pagination',
    templateUrl: './pagination.component.html',
    styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent implements OnInit {
    @Input() pagination: Pagination;
    @Output() goToPage: EventEmitter<number> = new EventEmitter();


    constructor() {
    }

    getPageNumber(event: any) {
        const {target: {value: page}} = event;
        this.goToPage.emit(page);
    }


    ngOnInit() {
    }

}
