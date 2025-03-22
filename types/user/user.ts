import {StoreEntity} from "../../src/store/entities/store.entity";

export enum USER_ROLE {
    USER = 'Użytkownik',
    ADMIN = 'Administrator',
}

export enum PERMISSIONS {
  ADD_VEH = 'Dodawanie pojazdów',
  EDIT_VEH = 'Edytowanie pojazdów',
  DELETE_VEH = 'Usuwanie pojazdów',
  VIEW_ALL_VEH = 'Wyświetlanie wszystkich pojazdów',
  VIEW_VEH_BY_LOCATION = 'Wyświetlanie pojazdów po lokalizacji',
}


export interface UserCreate {
    email: string;
    password: string;
}

export interface UserProfile extends UserCreate {
    id: string;
    isActive: Boolean;
    role: USER_ROLE | string;
    activationCode: string;
    store: null | string | StoreEntity;

}

export interface UserProfileRes {
    id: string;
    email: string;
    isActive: Boolean;
    role: USER_ROLE | string;
    store: {
        id: string,
        name: string,
        url: string,
    }
}

export type UserRes = UserProfileRes

// export interface LoggedUserRes extends UserRes {
//     name: string;
//     surname: string;
// }


export type GetListOfUsersResponse = UserRes[]

export interface GetPaginatedListOfAllUsersResponse {
    users: GetListOfUsersResponse;
    pagesCount: number;
    resultsCount: number;
}