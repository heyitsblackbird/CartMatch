// insert rows into the database

import supabase from '@/lib/supabase/client';
import { PriceRow } from '../../src/types/price';
import { ProductRow } from '../../src/types/product';
import { StoreRow } from '../../src/types/store';



function makeProductKey(name: string): string {
    return `${name.toLowerCase()}`;
}

async function insertStores(validStores: StoreRow[]): Promise<Record<string, string>>{
    const storeMap: Record<string, string> = {};

    for(const store of validStores){
        const {data, error} = await supabase
        .from('stores')
        .insert(store)
        .select();

        if(error){
            throw new Error(`Error inserting store ${store.name}: ${error.message}`);
        }

        if(data && data.length > 0){
            storeMap[store.name] = data[0].id;
        }
        else{
            throw new Error(`No data returned after inserting store ${store.name}`);
        }
    }

    return storeMap;
}

async function insertProducts(validProducts: ProductRow[]): Promise<Record<string, string>>{
    const productMap: Record<string, string> = {};

    for(const product of validProducts){
        const {data, error} = await supabase
        .from('products')
        .insert(product)
        .select();

        if(error){
            throw new Error(`Error inserting products ${product.name}: ${error.message}`);
        }

        if(data && data.length > 0){
            productMap[makeProductKey(product.name)] = data[0].id;
        }
        else{
            throw new Error(`No data returned after inserting product ${product.name}`);
        }
    }

    return productMap;
}

async function insertPrices(validPrices: PriceRow[], storeMap: Record<string, string>, productMap: Record<string, string>): Promise<{insertedCount: number, errors: string[]}>{
    const errors: string[] = [];
    let insertedCount = 0;

    for(const price of validPrices){
        const storeId = storeMap[price.store_name];
        const productId = productMap[makeProductKey(price.product_name)];

        if(storeId === undefined){
            errors.push(`Store not found for price entry: ${price.store_name}`);
            continue;
        }

        if(productId === undefined){
            errors.push(`Product not found for price entry: ${price.product_name}`);
            continue;
        }

        const {error} = await supabase
        .from('prices')
        .insert({
            store_id: storeId,
            product_id: productId,
            price: price.price,
            source: price.source
        });

        if(error){
            errors.push(`Error inserting price for product ${price.product_name} at store ${price.store_name}: ${error.message}`);
            continue;
        }

        insertedCount++;
    }

    return {insertedCount, errors};
}

export { insertStores, insertProducts, insertPrices };
