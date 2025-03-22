
export interface StoreCreate {
    name?: string;
    url?: string;
    consumer_key?: string;
    consumer_secret?: string;
}

export interface StoreProfile extends StoreCreate {
    id?: string;
    furgonetka_access_token?: string;
}


export interface StoreProfileRes {
    store_url?: string;
    headers?: any;
    furgonetka_access_token?: string;
}


export type StoreRes = StoreProfileRes