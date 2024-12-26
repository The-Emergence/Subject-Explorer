// Supabase configuration
const SUPABASE_URL = "https://qednuirrccgrlcqrszmb.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlZG51aXJyY2NncmxjcXJzem1iIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNDQxMDk0NiwiZXhwIjoyMDQ5OTg2OTQ2fQ.V8gRGHLQtYbtc69yYm0N5d0rs8dA5JM4lHB_0DHlXzU";

// Declare Supabase client variable
let supabase;

// Ensure code runs only after DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    console.log("Initializing Supabase...");

    // Initialize Supabase client
    supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log("Supabase client initialized:", supabase);

    // Fetch records from Supabase
    async function fetchRecords() {
        console.log("Fetching records...");

        // Query the Supabase table
        let { data, error } = await supabase.from("subject_explorer_records").select("*");
        
        if (error) {
            console.error("Error fetching records:", error);
        } else {
            console.log("Records fetched:", data);
            // Render data to the DOM
            renderRecords(data);
        }
    }

    // Render records to the page
    function renderRecords(records) {
        const outputDiv = document.getElementById("output");
        if (records.length === 0) {
            outputDiv.innerHTML = "<p>No records found.</p>";
        } else {
            const recordList = records.map(record => `<li>${JSON.stringify(record)}</li>`).join("");
            outputDiv.innerHTML = `<ul>${recordList}</ul>`;
        }
    }

    // Call fetchRecords function
    fetchRecords();
});
