// Initialize Supabase
const SUPABASE_URL = "https://qednuirrccgrlcqrszmb.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlZG51aXJyY2NncmxjcXJzem1iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ0MTA5NDYsImV4cCI6MjA0OTk4Njk0Nn0.Lb9OmaJN5TU_AOSoExbHLTBpCYcURTT3lG2bn1RJEr0";
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Fetch data from Supabase
async function fetchData() {
    try {
        const { data, error } = await supabase
            .from('subject_explorer_records') // Replace with your table name
            .select('*');

        if (error) throw error;

        console.log('Supabase data:', data);
        const output = document.getElementById('output');
        output.textContent = JSON.stringify(data, null, 2); // Display data
    } catch (err) {
        console.error('Error fetching data:', err);
    }
}

fetchData();
