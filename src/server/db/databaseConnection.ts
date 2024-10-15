
import { createClient } from '@supabase/supabase-js'

const url = require('url')

const myURL = new URL("postgresql://postgres.ryiooykqhtgwkpirqydt:" + myURL.password + "@aws-0-us-west-1.pooler.supabase.com:6543/postgres")
myURL.password = "ASU_EPICS@2024"

// var supabaseUrl = 'https://ryiooykqhtgwkpirqydt.supabase.co'

var supabaseUrl = 'postgresql://postgres.ryiooykqhtgwkpirqydt:ASU_EPICS@2024@aws-0-us-west-1.pooler.supabase.com:6543/postgres'

// var supabaseUrl = 'postgres://postgres.dmzdavgodntkwzstpzog:qnsy0NHeAVB48mXe@aws-0-us-west-1.pooler.supabase.com:5432/postgres'
// const supabaseKey = process.env.ECMOBRIDGE_DATABASE_API_KEY

// var supabaseUrl = 'https://ryiooykqhtgwkpirqydt.supabase.co';

var supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5aW9veWtxaHRnd2twaXJxeWR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc4Mjg5MTMsImV4cCI6MjA0MzQwNDkxM30.QE7Z6a_p4S_mrytO1PQVlgXS9Y9BwC6qr6T8_4z_VE4"

const supabase = createClient(supabaseUrl, supabaseKey)

// Define the schema for the table
type EcmoRecord = {
    userID: string;
    id: string;
    name: string;
    ecmo_type: string;
    location: string;
    coordinates: JSON;  
    create_time: string;
    updated_time: string;
};
  

// Fetch the first record from the Supabase table
const fetchFirstRecord = async () => {
  try{
    
    let { data: ECMO_TEST_DB, error } = await supabase
    .from('ECMO_TEST_DB')
    .select('*')

    console.log("Pulled data!");

  }
  
  catch(error){
    console.error('Error fetching the record:', error);
  }

}

async function beautifulFunctionName(supabaseUrl: string) {
  let response = await fetch(supabaseUrl);
  console.log(response);
  return response;
}

console.log("Fetching the status");
console.log(beautifulFunctionName(supabaseUrl));


// console.log(fetchFirstRecord());