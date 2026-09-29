import parseCsv from "./parseCsv";
import {validateProductRow, validatePriceRow, validateStoreRow} from "./validateRow";
import {insertProducts, insertPrices, insertStores} from "./insertRows";
import {StoreRow} from "../../src/types/store";

function validateAndSplit<T>(
  rows: Record<string, string>[],
  validate: (row: Record<string, string>) => { isValid: true; data: T } | { isValid: false; reason: string }
): { valid: { rowNumber: number; data: T }[]; rejected: { rowNumber: number; reason: string }[] } 
{
  const valid: { rowNumber: number; data: T }[] = [];
  const rejected: { rowNumber: number; reason: string }[] = [];

  rows.forEach((row, i) => {
    const result = validate(row);
    const rowNumber = i + 2; // +1 for zero-index, +1 for the header line — check this against a real file
    if (result.isValid) {
      valid.push({ rowNumber, data: result.data });
    } else {
      rejected.push({ rowNumber, reason: result.reason });
    }
  });

  return { valid, rejected };
}




async function main(){
    const rawStoreRows = parseCsv('data/stores.csv');
    const rawProductRows = parseCsv('data/products.csv');
    const rawPriceRows = parseCsv('data/prices.csv');

    const {valid: validStores, rejected: rejectedStores} =  validateAndSplit<StoreRow>(rawStoreRows, validateStoreRow);
    const {valid: validProducts, rejected: rejectedProducts} =  validateAndSplit(rawProductRows, validateProductRow);
    const {valid: validPrices, rejected: rejectedPrices} =  validateAndSplit(rawPriceRows, validatePriceRow);

    console.log(`Stores: ${validStores.length} valid, ${rejectedStores.length} rejected`);
    rejectedStores.forEach(row =>
        console.log(` row ${row.rowNumber}: ${row.reason}`));
    
    console.log(`Products: ${validProducts.length} valid, ${rejectedProducts.length} rejected`);
    rejectedProducts.forEach(row =>
        console.log(` row ${row.rowNumber}: ${row.reason}`));
    
    console.log(`Prices: ${validPrices.length} valid, ${rejectedPrices.length} rejected`);
    rejectedPrices.forEach(row =>
        console.log(` row ${row.rowNumber}: ${row.reason}`));
    
    const storeMap = await insertStores(validStores.map(row => row.data));
    const productMap = await insertProducts(validProducts.map(row => row.data));
    const priceMap = await insertPrices(validPrices.map(row => row.data), storeMap, productMap);

    console.log(`Inserted ${priceMap.insertedCount} prices with ${priceMap.errors.length} errors`);
    priceMap.errors.forEach(error => console.log(`Error inserting price: ${error}`));                               
}

main().catch(error =>{
    console.error("Error during import to database:", error);
    process.exit(1);
})