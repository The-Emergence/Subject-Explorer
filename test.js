// Verify Supabase client initialization
console.log("Initializing Supabase...");

// Set the Supabase URL and ANON API Key
const SUPABASE_URL = "https://qednuirrccgrlcqrszmb.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInFlZG51aXJyY2NncmxjcXJzem1iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ0MTA5NDYsImV4cCI6MjA0OTk4Njk0Nn0.Lb9OmaJN5TU_AOSoExbHLTBpCYcURTT3lG2bn1RJEr0";
console.log("Supabase URL:", SUPABASE_URL);
console.log("Supabase ANON Key:", SUPABASE_ANON_KEY);

// Initialize Supabase client BEFORE any references to it
try {
  console.log("Initializing Supabase...");
  const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  console.log("Supabase client initialized:", supabase);

  // Add event listener for DOMContentLoaded
  document.addEventListener("DOMContentLoaded", () => {
    console.log("DOMContentLoaded event fired.");
    fetchData();
  });

  // Async function to fetch data from Supabase
  async function fetchData() {
    console.log("Fetching data from Supabase...");
    try {
      // Make the API request
      const { data, error } = await supabase
        .from("subject_explorer_records") // Replace with your table name
        .select("*");

      // Check for errors
      if (error) {
        console.error("Error fetching data from Supabase:", error.message);
        document.getElementById("output").textContent =
          "Error fetching data: " + error.message;
        return;
      }

      // Log the data
      console.log("Data fetched successfully:", data);

      // Display the data on the page
      const outputElement = document.getElementById("output");
      outputElement.textContent = JSON.stringify(data, null, 2);
    } catch (err) {
      console.error("Unexpected error during data fetch:", err.message);
      document.getElementById("output").textContent =
        "Unexpected error: " + err.message;
    }
  }
} catch (err) {
  console.error("Error initializing Supabase client:", err.message);
}
