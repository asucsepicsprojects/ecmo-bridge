"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var supabase_js_1 = require("@supabase/supabase-js");
var supabaseUrl = 'https://ryiooykqhtgwkpirqydt.supabase.co';
// const supabaseKey = process.env.ECMOBRIDGE_DATABASE_API_KEY
var supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5aW9veWtxaHRnd2twaXJxeWR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc4Mjg5MTMsImV4cCI6MjA0MzQwNDkxM30.QE7Z6a_p4S_mrytO1PQVlgXS9Y9BwC6qr6T8_4z_VE4";
var supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey.toString());
