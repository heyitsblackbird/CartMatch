// Validate row data before importing it into the database

import { ValidPriceRow } from '../../src/types/price';

type ValidationResult =
  | { isValid: true; data: ValidPriceRow }
  | { isValid: false; reason: string };

function validateRow(row: Record<string, string>): ValidationResult{
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

export default validateRow;