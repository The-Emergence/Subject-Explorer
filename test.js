// Verify Supabase client is initialized
console.log("Initializing Supabase...");

const SUPABASE_URL = "https://qednuirrccgrlcqrszmb.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInFlZG51aXJyY2NncmxjcXJzem1iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ0MTA5NDYsImV4cCI6MjA0OTk4Njk0Nn0.Lb9OmaJN5TU_AOSoExbHLTBpCYcURTT3lG2bn1RJEr0";

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
console.log("Supabase client initialized:", supabase);

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOMContentLoaded event fired.");
  fetchData();
});

async function fetchData() {
  console.log("fetchData function is running...");
  
  try {
    const { data, error } = await supabase
      .from("subject_explorer_records")
      .select("*");

    if (error) {
      console.error("Error fetching data:", error.message);
      return;
    }

    console.log("Supabase data fetched successfully:", data);

    const output = document.getElementById("output");
    output.innerHTML = ""; // Clear previous content

    data.forEach(record => {
      const recordElement = document.createElement("div");
      recordElement.innerHTML = `
        <h3>${record.subject}</h3>
        <p>${record.description}</p>
        <img src="${record.subject_image}" alt="${record.subject}" style="width:150px;">
        <a href="${record.subject_link}" target="_blank">Learn More</a>
      `;
      output.appendChild(recordElement);
    });
  } catch (err) {
    console.error("Unexpected error:", err.message);
  }
}
