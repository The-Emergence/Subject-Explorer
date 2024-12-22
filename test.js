console.log('Supabase library loaded:', window.supabase);

const SUPABASE_URL = "https://qednuirrccgrlcqrszmb.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlZG51aXJyY2NncmxjcXJzem1iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ0MTA5NDYsImV4cCI6MjA0OTk4Njk0Nn0.Lb9OmaJN5TU_AOSoExbHLTBpCYcURTT3lG2bn1RJEr0";
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function fetchData() {
    try {
        console.log('Fetching data...');
        const { data, error } = await supabase
            .from('subject_explorer_records') // Use your actual table name
            .select('*');

        if (error) {
            console.error('Error fetching data:', error);
            return;
        }

        console.log('Fetched data:', data);
        const output = document.getElementById('output');
        output.textContent = JSON.stringify(data, null, 2);
    } catch (err) {
        console.error('Unexpected error:', err);
    }
}

fetchData();

