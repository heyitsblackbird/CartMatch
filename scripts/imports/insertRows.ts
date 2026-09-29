// insert rows into the database

import supabase from '@/lib/supabase/client';
import { PriceRow } from '../../src/types/price';
import { ProductRow } from '../../src/types/product';
import { StoreRow } from '../../src/types/store';


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