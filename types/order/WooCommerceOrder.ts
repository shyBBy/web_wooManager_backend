// Interfejs dla pojedynczego zamówienia z WooCommerce
export interface WooCommerceOrder {
    id: number;
    parent_id: number;
    status: string;
    currency: string;
    version: string;
    prices_include_tax: boolean;
    date_created: string;
    date_modified: string;
    discount_total: string;
    discount_tax: string;
    shipping_total: string;
    shipping_tax: string;
    cart_tax: string;
    total: string;
    total_tax: string;
    customer_id: number;
    order_key: string;
    billing: WooCommerceAddress;
    shipping: WooCommerceAddress;
    payment_method: string;
    payment_method_title: string;
    transaction_id: string;
    customer_ip_address: string;
    customer_user_agent: string;
    created_via: string;
    customer_note: string;
    date_completed: string | null;
    date_paid: string | null;
    cart_hash: string;
    number: string;
    meta_data: WooCommerceMetaData[];
    line_items: WooCommerceLineItem[];
    tax_lines: WooCommerceTaxLine[];
    shipping_lines: WooCommerceShippingLine[];
    fee_lines: any[];
    coupon_lines: any[];
    refunds: any[];
    payment_url: string;
    is_editable: boolean;
    needs_payment: boolean;
    needs_processing: boolean;
    date_created_gmt: string;
    date_modified_gmt: string;
    date_completed_gmt: string | null;
    date_paid_gmt: string | null;
    summary_page: string;
    currency_symbol: string;
    _links: WooCommerceLinks;
}

// Interfejs dla adresu w zamówieniu
export interface WooCommerceAddress {
    first_name: string;
    last_name: string;
    company: string;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
    email?: string;
    phone?: string;
}

// Interfejs dla metadanych zamówienia
export interface WooCommerceMetaData {
    id: number;
    key: string;
    value: any;
}

// Interfejs dla pozycji w zamówieniu
export interface WooCommerceLineItem {
    id: number;
    name: string;
    product_id: number;
    variation_id: number;
    quantity: number;
    tax_class: string;
    subtotal: string;
    subtotal_tax: string;
    total: string;
    total_tax: string;
    taxes: WooCommerceTax[];
    meta_data: WooCommerceMetaData[];
    sku: string;
    price: number;
    image: WooCommerceImage;
    parent_name: string | null;
}

// Interfejs dla podatków w pozycji zamówienia
export interface WooCommerceTax {
    id: number;
    total: string;
    subtotal: string;
}

// Interfejs dla obrazu produktu
export interface WooCommerceImage {
    id: number;
    src: string;
}

// Interfejs dla linii podatkowych w zamówieniu
export interface WooCommerceTaxLine {
    id: number;
    rate_code: string;
    rate_id: number;
    label: string;
    compound: boolean;
    tax_total: string;
    shipping_tax_total: string;
    rate_percent: number;
    meta_data: WooCommerceMetaData[];
}

// Interfejs dla linii wysyłkowych w zamówieniu
export interface WooCommerceShippingLine {
    id: number;
    method_title: string;
    method_id: string;
    instance_id: string;
    total: string;
    total_tax: string;
    taxes: WooCommerceTax[];
    tax_status: string;
    meta_data: WooCommerceMetaData[];
}

// Interfejs dla linków w zamówieniu
export interface WooCommerceLinks {
    self: Array<{ href: string; targetHints?: { allow: string[] } }>;
    collection: Array<{ href: string }>;
}

export type WooCommerceOrderResponse = WooCommerceOrder | null;

// Typ dla listy zamówień z WooCommerce
export type WooCommerceOrdersResponse = WooCommerceOrder[];

