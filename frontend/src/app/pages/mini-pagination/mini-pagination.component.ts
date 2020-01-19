import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import {Pagination} from '../../shared/models';

@Component({
    selector: 'app-mini-pagination',
    templateUrl: './mini-pagination.component.html',
    styleUrls: ['./mini-pagination.component.scss'],
})
export class MiniPaginationComponent implements OnInit {
    @Input() pagination: Pagination = {
        pages: 0,
        currentPage: 0,
        nextPage: null,
        previousPage: null,
        total: 0,
        hasNext: false,
        hasPrevious: false,
    };
    @Input() paginationPosition = 'top';
    @Output() goToPage: EventEmitter<number> = new EventEmitter();

    constructor() {
    }

    ngOnInit() {
    }


    getPageNumber(pageNumber: number) {
        this.goToPage.emit(pageNumber);
    }
}
