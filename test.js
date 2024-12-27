
// Supabase configuration
const SUPABASE_URL = "https://qednuirrccgrlcqrszmb.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlZG51aXJyY2NncmxjcXJzem1iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ0MTA5NDYsImV4cCI6MjA0OTk4Njk0Nn0.Lb9OmaJN5TU_AOSoExbHLTBpCYcURTT3lG2bn1RJEr0";

// Ensure code runs only after DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  console.log("Initializing Supabase...");

  // Initialize Supabase client *after DOM is loaded*
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
    outputDiv.innerHTML = "<p class='no-records'>No records found.</p>";
  } else {
    // Create a simple structure for each record
    const recordList = records
      .map(record => `

 <div class="record">
          <h2>${record.subject}</h2>
          <p>${record.description}</p>
          <p><strong>Class:</strong> ${record.class}</p>
          <p><strong>Collection:</strong> ${record.collection}</p>
          <p><strong>Breadcrumbs:</strong> ${record.breadcrumbs.join(", ")}</p>
          <p><strong>Color Words:</strong> ${record.color_words.join(", ")}</p>
          <a href="${record.subject_link}" target="_blank">More Info</a>
        </div>

       
      `)
      .join("");
    outputDiv.innerHTML = recordList;
  }
}
  // Call fetchRecords function
  fetchRecords();
});

