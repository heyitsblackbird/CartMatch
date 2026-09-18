// Test client connection to Supabase

import supabase from '../src/lib/supabase/client';

async function testConnection() {
    const {data, error} = await supabase.from('products').select('*');
    if (error) {
        console.error('Error connecting to Supabase:', error);
    } else {
        console.log('Successfully connected to Supabase. Data:', data.length);
    }                       
}

testConnection();