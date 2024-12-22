// Import Supabase client
const { createClient } = window.supabase;

// Initialize Supabase
const SUPABASE_URL = "https://qednuirrccgrlcqrszmb.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlZG51aXJyY2NncmxjcXJzem1iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ0MTA5NDYsImV4cCI6MjA0OTk4Njk0Nn0.Lb9OmaJN5TU_AOSoExbHLTBpCYcURTT3lG2bn1RJEr0";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Fetch data from Supabase
async function fetchData() {
    try {
        const { data, error } = await supabase
            .from('your-table-name') // Replace 'your-table-name' with your actual table name
            .select('*');

        if (error) throw error;

        // Insert data into the DOM
        const output = document.getElementById('output');
        data.forEach(record => {
            const div = document.createElement('div');
            div.textContent = JSON.stringify(record, null, 2);
            output.appendChild(div);
        });

        console.log('Data fetched successfully:', data);
    } catch (err) {
        console.error('Error fetching data:', err);
    }
}

fetchData();
