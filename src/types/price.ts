// Price type definitions

export type PriceRow = {
    product_name: string;
    product_brand: string|null;
    store_name: string;
    price: number;
    source: string;
}