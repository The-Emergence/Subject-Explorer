// Import the createClient function (Important!)
const { createClient } = supabase;

// Initialize Supabase
const SUPABASE_URL = "https://qednuirrccgrlcqrszmb.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInFlZG51aXJyY2NncmxjcXJzem1iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ0MTA5NDYsImV4cCI6MjA0OTk4Njk0Nn0.Lb9OmaJN5TU_AOSoExbHLTBpCYcURTT3lG2bn1RJEr0";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY); // Use createClient here

console.log("Supabase client initialized:", supabase);

// ... (rest of your fetchData function and event listener)
document.addEventListener('DOMContentLoaded', () => {
  fetchData();
});

async function fetchData() {
    console.log("Function fetchData is running...");
    try {
        console.log("Attempting to fetch data...");
        const { data, error } = await supabase
            .from("subject_explorer_records") // Replace with your actual table name
            .select("*");

        if (error) {
            console.error("Error fetching data:", error);
            return;
        }

        console.log("Fetched data:", data);
        const output = document.getElementById("output");
        output.textContent = JSON.stringify(data, null, 2);
    } catch (err) {
        console.error("Unexpected error:", err);
    }
}
