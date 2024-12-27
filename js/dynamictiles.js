// Supabase Configuration
const SUPABASE_URL = "https://qednuirrccgrlcqrszmb.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlZG51aXJyY2NncmxjcXJzem1iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ0MTA5NDYsImV4cCI6MjA0OTk4Njk0Nn0.Lb9OmaJN5TU_AOSoExbHLTBpCYcURTT3lG2bn1RJEr0";

document.addEventListener("DOMContentLoaded", () => {
  console.log("Initializing Supabase...");

  const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  const tilesContainer = document.getElementById("og-grid");

  if (!tilesContainer) {
    console.error("Tiles container (og-grid) not found.");
    return;
  }

  async function fetchRecords() {
    try {
      console.log("Fetching records...");
      const { data, error } = await supabase.from("subject_explorer_records").select("*");

      if (error) throw error;

      console.log("Fetched records:", data);
      renderTiles(data);
    } catch (err) {
      console.error("Error fetching records:", err.message);
      tilesContainer.innerHTML = "<li>Error loading tiles. Please try again later.</li>";
    }
  }

  function renderTiles(records) {
    if (!records || records.length === 0) {
      tilesContainer.innerHTML = "<li>No records available.</li>";
      return;
    }

    tilesContainer.innerHTML = records
      .map(record => `
        <li>
          <a href="${record.subject_link || '#'}"
             data-largesrc="${record.subject_image || 'https://via.placeholder.com/150'}"
             data-title="${record.subject || 'Unknown Subject'}"
             data-description="${record.description || 'No description available.'}">
            <div class="tile">
              <div class="product-badge">${record.class || 'Class'}</div>
              <div class="text-group">
                <div class="word subject">${record.subject || 'No Subject'}</div>
                <div class="word breadcrumbs">${record.breadcrumbs.join(", ") || 'No Breadcrumbs'}</div>
              </div>
            </div>
          </a>
        </li>
      `)
      .join("");

    // Reinitialize Grid functionality
    if (typeof Grid !== "undefined" && typeof Grid.init === "function") {
      Grid.init();
    } else {
      console.warn("Grid.js is not loaded or Grid.init is missing.");
    }
  }

  fetchRecords();
});
