export interface OrderProfileInterface {
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
    billing: AddressInterface;
    shipping: AddressInterface;
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
    meta_data: MetaDataInterface[];
    line_items: LineItemInterface[];
    tax_lines: TaxLineInterface[];
    shipping_lines: ShippingLineInterface[];
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
    _links: LinksInterface;
}

export interface AddressInterface {
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

export interface MetaDataInterface {
    id: number;
    key: string;
    value: any;
}

export interface LineItemInterface {
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
    taxes: TaxInterface[];
    meta_data: MetaDataInterface[];
    sku: string;
    price: number;
    image: ImageInterface;
    parent_name: null | string;
}

export interface TaxInterface {
    id: number;
    total: string;
    subtotal: string;
}

export interface ImageInterface {
    id: string;
    src: string;
}

export interface TaxLineInterface {
    id: number;
    rate_code: string;
    rate_id: number;
    label: string;
    compound: boolean;
    tax_total: string;
    shipping_tax_total: string;
    rate_percent: number;
    meta_data: MetaDataInterface[];
}

export interface ShippingLineInterface {
    id: number;
    method_title: string;
    method_id: string;
    instance_id: string;
    total: string;
    total_tax: string;
    taxes: TaxInterface[];
    tax_status: string;
    meta_data: MetaDataInterface[];
}

export interface LinksInterface {
    self: Array<{ href: string }>;
    collection: Array<{ href: string }>;
    customer?: Array<{ href: string }>;
}

export interface ShippingInterface {
    package_id: string;
    group_id: null | string;
    pickup: PickupInterface;
    sender: SenderReceiverInterface;
    receiver: SenderReceiverInterface;
    parcels: ParcelInterface[];
    additional_services: AdditionalServicesInterface;
    type: string;
    pricing: PricingInterface;
    service: string;
    transport_service: string;
    transport_service_description: null | string;
    service_id: number;
    state: string;
    service_contract: string;
    cancel_available: boolean;
    complaint_available: boolean;
    cancel_details: CancelDetailsInterface;
    edit_url: null | string;
    documents_url: string;
    add_similar_url: string;
    repickup: boolean;
    pickup_available: boolean;
    name: string;
    pickup_number: null | string;
    label: LabelInterface;
    documents: DocumentInterface[];
    pickup_date: null | string;
    datetime_order: string;
    datetime_add: string;
    datetime_delivery: string;
    delivery_time: string;
    changes: any[];
    related_packages: any[];
    changes_relations: any[];
    return_disposition: null | string;
    readdressing_disposition: null | string;
    system_fees: null | string;
    digital_label: any[];
    group_size: null | string;
    group_type: null | string;
    courier_phone: null | string;
    promotion_code: null | string;
    order_uuid: string;
    order_number: string;
}

export interface PickupInterface {
    name: string;
    company: string;
    street: string;
    postcode: string;
    city: string;
    country_code: string;
    county: null | string;
    email: string;
    phone: string;
    point: string;
    point_label: string;
    point_data: PointDataInterface;
}

export interface SenderReceiverInterface {
    uuid?: null | string;
    name: string;
    company: null | string;
    street: string;
    postcode: string;
    city: string;
    country_code: string;
    county: null | string;
    email: string;
    phone: string;
    point?: null | string;
    point_data?: PointDataInterface | null;
    point_label?: null | string;
}

export interface ParcelInterface {
    package_no: string;
    description: string;
    state_description: string;
    state: string;
    station: null | string;
    width: number;
    depth: number;
    height: number;
    weight: number;
    dimensional_weight: null | number;
    pallet_info: null | string;
    value: number;
    tracking_url: string;
    service: string;
    delivery_time: number;
    gauge: null | string;
    datetime_status: string;
}

export interface AdditionalServicesInterface {
    cod?: CodInterface;
    rod?: boolean;
    cud?: boolean;
    private_shipping?: boolean;
    guarantee_0900?: boolean;
    guarantee_0930?: boolean;
    guarantee_1200?: boolean;
    saturday_delivery?: boolean;
    additional_handling?: boolean;
    sms_predelivery_information?: boolean;
    documents_supply?: boolean;
    saturday_sunday_delivery?: boolean;
    guarantee_next_day?: boolean;
    fedex_priority?: boolean;
    ups_saver?: boolean;
    ups_standard?: boolean;
    valuable_shipment?: boolean;
    fragile?: boolean;
    personal_delivery?: boolean;
    poczta_kurier24?: boolean;
    poczta_kurier48?: boolean;
    pocztex?: boolean;
    weight_30_50?: boolean;
    delivery_on_day?: string;
    courier_drive_up?: boolean;
    registered_letter?: boolean;
    registered_company_letter?: boolean;
    registered_letter_international?: boolean;
    poczta_globalexpres?: boolean;
    delivery_confirmation?: boolean;
    selected_pickup_date?: boolean;
    valuable_package?: boolean;
    self_pickup?: boolean;
    insurance?: boolean;
    ambro_size20?: null | string;
    xpress_service?: null | string;
    xpress_service_name?: null | string;
    premium?: boolean;
    receiver_sms_notification?: boolean;
    inpost_letter?: boolean;
    standard?: boolean;
    mini?: boolean;
    mini_or_standard?: boolean;
    deligoo_express?: boolean;
    city_size_small?: boolean;
    srs?: boolean;
    service_description?: string;
    dox?: boolean;
    long_package?: boolean;
    large_package?: boolean;
    avizo_pickup_sms?: boolean;
    avizo_pickup_tel?: boolean;
    avizo_delivery_tel?: boolean;
    pickup_same_day?: boolean;
    oversized_package?: boolean;
    customs_clearance?: boolean;
    additional_manipulative_fee?: boolean;
    odb_sat?: boolean;
    ps?: boolean;
    destination_remote_area?: boolean;
    destination_extended_area?: boolean;
    origin_extended_area?: boolean;
    city_size_large?: boolean;
    city_size_medium?: boolean;
    delivery_to_door?: boolean;
    pickup_from_door?: boolean;
    energy_fee?: boolean;
    dimensional_weight_fee?: boolean;
    ups_ship_notification?: boolean;
    ups_exception_notification?: boolean;
    ups_delivery_notification?: boolean;
    digital_label?: boolean;
    low_cost?: boolean;
    letterprint_additional_page?: null | string;
    letterprint_color_print?: null | string;
    letterprint_blackandwhite_print?: null | string;
    green_area?: boolean;
    food?: null | string;
    help_with_loading?: boolean;
    client_agreement_order?: boolean;
    declaredvalue?: null | string;
    receiver_email_notification?: boolean;
}

export interface CodInterface {
    amount: number;
    currency: string;
    express: boolean;
    iban: string;
    name: string;
    swift: string;
    transferDone: boolean;
    transferDateInfo: string;
    transferStatus: null | string;
}

export interface PointDataInterface {
    code: string;
    name: string;
    original_name: string;
    active: boolean;
    opening_hours: Record<string, { start_hour: string; end_hour: string }>;
    max_supported_weight: null | number;
    cod: boolean;
    type: string;
    service: string;
    is_send_point: boolean;
    is_delivery_point: boolean;
    description: string;
    coordinates: { latitude: number; longitude: number };
    distance: null | number;
    address: {
        postcode: string;
        street: string;
        city: string;
        country_code: null | string;
        province: null | string;
    };
    phone: null | string;
    photos: any[];
    point_type_str: string;
    email: null | string;
    boxes_specification: null | string;
    holiday: boolean;
    service_type: string;
    holiday_period: null | string;
    furgonetka_point: null | string;
    facebook_url: null | string;
    digital_label: null | string;
    food: null | string;
    is_poczta_points_partner: boolean;
    label: string;
}

export interface CancelDetailsInterface {
    available: boolean;
    cancellation_done: boolean;
    cancellation_date: null | string;
    scheduled_cancel_date: null | string;
    before_cancel_message_type: null | string;
    pricelist_url: null | string;
}

export interface LabelInterface {
    file_format: string;
}

export interface DocumentInterface {
    type: string;
    format: string;
    details: null | string;
}

export interface PricingInterface {
    price_gross: number;
    price_net: number;
    price_base_net: number;
    price_org: number;
    adjusted_price: number;
    tax: number;
    price_info: string;
    details: Array<{ service: string; price_net: number; description: string }>;
}

export interface ShippingTrackingInterface {
    tracking: Array<{
        state: string;
        status: string;
        datetime: string;
        branch: string;
    }>;
}

export interface GetOneOrderResponse {
    order: OrderProfileInterface;
    shipping: ShippingInterface | null;
    shipping_tracking: ShippingTrackingInterface | null;
}

export type GetListOfAllOrdersResponse = GetOneOrderResponse[];

export enum OrderStatus {
    ALL = "all",
    SENT = "in-transit",
    IN_PROGRESS = "processing",
    COMPLETED = "completed",
    CANCELLED = "cancelled",
}

export enum OrderStatusColor {
    PENDING = "#ffd166",
    PROCESSING = "#b3c7d6",
    ON_HOLD = "#ffb380",
    COMPLETED = "#679a75",
    CANCELLED = "#780000",
    REFUNDED = "#d6b3d6",
    FAILED = "#3f3f3f",
    IN_TRANSIT = "#be913d",
    TRASH = "black",
    DEFAULT = "gray",
}
