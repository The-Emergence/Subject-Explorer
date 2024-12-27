// Supabase Configuration to pull data into DIF from DB
const SUPABASE_URL = "https://qednuirrccgrlcqrszmb.supabase.co";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";

// Ensure the script runs after the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  console.log("Initializing Supabase...");
  const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const tilesContainer = document.getElementById("tiles-container");

  if (!tilesContainer) {
    console.error("Tiles container not found. Check your HTML structure.");
    return;
  }

  // Fetch Records from Supabase
  async function fetchRecords() {
    try {
      const { data, error } = await supabase.from("subject_explorer_records").select("*");

      if (error) throw error;

      console.log("Fetched records:", data);
      renderTiles(data);
    } catch (err) {
      console.error("Error fetching records:", err.message);
    }
  }

  // Render Tiles Dynamically
  function renderTiles(records) {
    if (!records || records.length === 0) {
      console.warn("No records found in Supabase.");
      tilesContainer.innerHTML = "<p>No records available.</p>";
      return;
    }

    const tiles = records.map(record => `
      <li>
        <a href="${record.subject_link || '#'}"
           data-largesrc="${record.subject_image || 'https://via.placeholder.com/150'}"
           data-title="${record.subject || 'Unknown Subject'}"
           data-description="${record.description || 'No description available.'}">

          <div class="tile">
            <div class="product-badge">${(record.record_type || 'Product').toUpperCase()}</div>
            <div class="text-group">
              <div class="word subject">${record.subject || 'No Subject'}</div>
              <div class="word predicate">${record.predicate || 'No Predicate'}</div>
              <div class="word object">${record.object || 'No Object'}</div>
              <div class="word type">${record.type || 'No Type'}</div>
              <div class="word subtype">${record.subtype || 'No Subtype'}</div>
              <div class="word relationship">${record.relationship || 'No Relationship'}</div>
            </div>
          </div>
        </a>
      </li>
    `);

    tilesContainer.innerHTML = tiles.join("");

    // Initialize Grid.js if needed for newly added elements
    if (typeof Grid !== "undefined" && typeof Grid.init === "function") {
      console.log("Reinitializing Grid...");
      Grid.init();
    } else {
      console.warn("Grid.js is not defined or Grid.init is missing.");
    }
  }

  // Fetch and render records
  fetchRecords();
});
