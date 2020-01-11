import * as moment from 'moment';
import {HttpErrorResponse} from '@angular/common/http';

export const formatDate = (dateString: string) => {
    return moment(dateString).format('YYYY-MM-DD').toString();
};

export const setPaginationDetails = ({
                                         pages, current_page: currentPage, next_num: nextPage, prev_num: previousPage, total,
                                         has_next: hasNext, has_prev: hasPrevious
                                     }) => ({
    pages,
    total,
    currentPage,
    nextPage,
    previousPage,
    hasNext,
    hasPrevious
});

export const handleError = (error: HttpErrorResponse) => {
    let errorMessage = error.error.message;
    if (error.status === 500) {
        errorMessage = 'Something went wrong';
        console.log(`Error Code: ${error.status}\nMessage: ${error.message}`);

    }
    this.toast.error(errorMessage);
};
