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