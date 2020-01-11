export interface Actor {
    id?: number;
    name: string;
    gender?: string;
    age?: number;
    birth_date?: string;

}

export interface MovieActor {
    actor: {
        id: number | string;
        name: string;
    };
}

export interface Movie {
    id?: number;
    title: string;
    release_date: string;
    actors?: Array<MovieActor>;
    actor_ids?: Array<number>;
    movie_crew?: Array<MovieActor>;
}

export interface MovieError {
    title?: string;
    release_date?: string;
    actors?: string;
}

export interface Pagination {
    pages: number;
    currentPage: number;
    nextPage: number | null;
    previousPage: number | null;
    total: number;
    hasNext: boolean;
    hasPrevious: boolean;
}
