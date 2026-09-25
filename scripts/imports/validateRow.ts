// Validate row data before importing it into the database

import { PriceRow } from '../../src/types/price';
import { ProductRow } from '../../src/types/product';
import { StoreRow } from '../../src/types/store';

type ValidPriceRow =
  | { isValid: true; data: PriceRow }
  | { isValid: false; reason: string };

type ValidProductRow =
  | { isValid: true; data: ProductRow }
  | { isValid: false; reason: string };

type ValidStoreRow =
  | { isValid: true; data: StoreRow }
  | { isValid: false; reason: string };

function toNullIfEmpty(value: string | undefined): string | null {
    if (value === undefined || value.trim() === "") {
        return null;
    }
    return value;
}

export function validatePriceRow(row: Record<string, string>): ValidPriceRow{
    if (!row.product_name || row.product_name.trim() === "") {
        return { isValid: false, reason: "Missing product_name" };
    }
    if (!row.store_name || row.store_name.trim() === "") {
        return { isValid: false, reason: "Missing store_name" };
    }
    if (!row.price || row.price.trim() === "") {
        return { isValid: false, reason: "Missing price" };
    }
    if (isNaN(Number(row.price)) || Number(row.price) <= 0) {
        return { isValid: false, reason: "Price is not a valid number" };
    }
    if (!row.source || row.source.trim() === "") {
        return { isValid: false, reason: "Missing source" };
    }

    return { isValid: true, data: {product_name: row.product_name, store_name: row.store_name, price: Number(row.price), source: row.source} };
}

export function validateProductRow(row: Record<string, string>): ValidProductRow {
    if (!row.name || row.name.trim() === "") {
        return { isValid: false, reason: "Missing product name" };
    }


    return { isValid: true, data: {name: row.name, brand: toNullIfEmpty(row.brand), category: toNullIfEmpty(row.category), barcode: toNullIfEmpty(row.barcode)} };
}


export function validateStoreRow(row: Record<string, string>): ValidStoreRow {
    if (!row.name || row.name.trim() === "") {
        return { isValid: false, reason: "Missing store name" };
    }
    if (!row.address || row.address.trim() === "") {
        return { isValid: false, reason: "Missing store address" };
    }
    const lat = toNullIfEmpty(row.lat) === null ? null : Number(row.lat);
    const lng = toNullIfEmpty(row.lng) === null ? null : Number(row.lng);

    if (lat !== null && (isNaN(lat) || lat < -90 || lat > 90)) {
        return { isValid: false, reason: "Invalid latitude" };
    }
    if (lng !== null && (isNaN(lng) || lng < -180 || lng > 180)) {
        return { isValid: false, reason: "Invalid longitude" };
    }

    return { isValid: true, data: {name: row.name, address: row.address, lat, lng } };
}
