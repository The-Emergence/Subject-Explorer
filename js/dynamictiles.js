// Supabase Configuration to pull data into DIF from DB
const SUPABASE_URL = "https://qednuirrccgrlcqrszmb.supabase.co";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";

// Ensure the script runs after the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const tilesContainer = document.getElementById("tiles-container");

  // Fetch Records from Supabase
  async function fetchRecords() {
    const { data, error } = await supabase.from("subject_explorer_records").select("*");

    if (error) {
      console.error("Error fetching records:", error);
      return;
    }

    renderTiles(data);
  }

  // Render Tiles Dynamically
  function renderTiles(records) {
    const tiles = records.map(record => `
      <li>
        <a href="${record.subject_link}"
           data-largesrc="${record.data_largesrc}"
           data-title="${record.subject}"
           data-description="${record.data_description}">

          <div class="tile">
            <div class="product-badge">${record.record_type.toUpperCase()}</div>
            <div class="text-group">
              <div class="word subject">${record.subject}</div>
              <div class="word predicate">${record.predicate}</div>
              <div class="word object">${record.object}</div>
              <div class="word type">${record.type}</div>
              <div class="word subtype">${record.subtype}</div>
              <div class="word relationship">${record.relationship}</div>
            </div>
          </div>
        </a>
      </li>
    `);

    tilesContainer.innerHTML = tiles.join("");
    // Initialize Grid.js if needed for newly added elements
  }

  fetchRecords(); // Call the function to fetch and render records
});
