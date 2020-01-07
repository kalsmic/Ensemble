import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-pagination',
    templateUrl: './pagination.component.html',
    styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent implements OnInit {
    @Input() page: number;
    @Input() pages: number;
    @Input() currentPage: number;
    @Input() nextPage: number;
    @Input() previousPage: number;
    @Input() total: number;
    @Input() hasNext: boolean;
    @Input() hasPrevious: boolean;
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
