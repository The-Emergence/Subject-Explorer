// Initialize Supabase
const SUPABASE_URL = "https://qednuirrccgrlcqrszmb.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInFlZG51aXJyY2NncmxjcXJzem1iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ0MTA5NDYsImV4cCI6MjA0OTk4Njk0Nn0.Lb9OmaJN5TU_AOSoExbHLTBpCYcURTT3lG2bn1RJEr0";

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener("DOMContentLoaded", () => {
  console.log("Document loaded. Initializing fetch...");
  fetchData();
});

async function fetchData() {
  console.log("Fetching data from Supabase...");

  try {
    const { data, error } = await supabase
      .from("subject_explorer_records") // Replace with your actual table name
      .select("*");

    if (error) {
      console.error("Error fetching data:", error.message);
      const output = document.getElementById("output");
      output.textContent = "Error fetching data: " + error.message;
      return;
    }

    console.log("Fetched data:", data);

    const output = document.getElementById("output");
    output.innerHTML = ""; // Clear previous content

    // Dynamically create elements to display each record
    data.forEach(record => {
      const recordElement = document.createElement("div");
      recordElement.classList.add("record");

      recordElement.innerHTML = `
        <h3>${record.subject}</h3>
        <p>${record.description}</p>
        <a href="${record.subject_link}" target="_blank">Learn more</a>
        <img src="${record.subject_image}" alt="${record.subject}" width="150">
      `;

      output.appendChild(recordElement);
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    const output = document.getElementById("output");
    output.textContent = "Unexpected error: " + err.message;
  }
}
