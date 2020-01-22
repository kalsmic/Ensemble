// @ts-ignore
import moment from 'moment';

export const formatDate = (dateString: string, format = 'YYYY-MM-DD') => {
    return moment(dateString).format(format).toString();
};
export const setPaginationDetails = (
    {
        pages,
        current_page: currentPage,
        next_num: nextPage,
        prev_num: previousPage,
        total, has_next: hasNext,
        has_prev: hasPrevious
    }) => ({pages, total, currentPage, nextPage, previousPage, hasNext, hasPrevious});
