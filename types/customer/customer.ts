import {FilterRecords} from "../filter";


export interface CustomerProfileInterface {
    id: number;
    username: string;
    name: string;
    first_name: string;
    last_name: string;
    email: string;
    url: string;
    description: string;
    link: string;
    locale: string;
    nickname: string;
    slug: string;
    roles: string[];
    registered_date: string;
    capabilities: {
        read: boolean;
        level_0: boolean;
        subscriber: boolean;
        // Dodaj inne właściwości według potrzeb
    };
    extra_capabilities: {
        subscriber: boolean;
        // Dodaj inne właściwości według potrzeb
    };
    avatar_urls: {
        '24': string;
        '48': string;
        '96': string;
    };
    meta: {
        billing_wooccm11: string;
        billing_company: string;
        billing_address_1: string;
        billing_email: string;
        pw_user_status: string;
        rm_user_status: string;
        persisted_preferences: any[]; // Określ dokładniejszy typ, jeśli to możliwe
        // Dodaj inne właściwości według potrzeb
    };
    is_super_admin: boolean;
    woocommerce_meta: {
        variable_product_tour_shown: string;
        activity_panel_inbox_last_read: string;
        activity_panel_reviews_last_read: string;
        categories_report_columns: string;
        coupons_report_columns: string;
        customers_report_columns: string;
        orders_report_columns: string;
        products_report_columns: string;
        revenue_report_columns: string;
        taxes_report_columns: string;
        variations_report_columns: string;
        dashboard_sections: string;
        dashboard_chart_type: string;
        dashboard_chart_interval: string;
        dashboard_leaderboard_rows: string;
        homepage_layout: string;
        homepage_stats: string;
        task_list_tracked_started_tasks: string;
        help_panel_highlight_shown: string;
        android_app_banner_dismissed: string;
        // Dodaj inne właściwości według potrzeb
    };
    _links: {
        self: {
            href: string;
        }[];
        collection: {
            href: string;
        }[];
    };
}



export type GetOneCustomerResponse = CustomerProfileInterface

export type GetListOfCustomersResponse = GetOneCustomerResponse[]

export interface GetPaginatedListOfAllCustomersResponse {
    customers: GetListOfCustomersResponse;
    pagesCount: number;
    resultsCount: number;
    badFilters?: FilterRecords;
}