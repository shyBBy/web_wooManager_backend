export interface LastChangeCreate {
  
  title: string;
  description: string;
}

export interface LastChangeSingle extends LastChangeCreate {
  
    id: string
    addedByUser: string
    addedDate: string
}

export type ChangeRes = LastChangeSingle

export type GetListOfLastChangesResponse = ChangeRes[]


export interface GetPaginatedListOfAllLastChangesResponse {
  lastChanges: GetListOfLastChangesResponse;
  pagesCount: number;
  resultsCount: number;
}