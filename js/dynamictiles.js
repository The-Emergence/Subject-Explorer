// Supabase Configuration to pull data into DIF from DB
const SUPABASE_URL = "https://qednuirrccgrlcqrszmb.supabase.co";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";

// Ensure the script runs after the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  console.log("Initializing Supabase...");
  
  // Initialize Supabase client
  let supabase;
  try {
    supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log("Supabase initialized successfully.");
  } catch (error) {
    console.error("Error initializing Supabase:", error.message);
    return;
  }

  // Find the tiles container
  const tilesContainer = document.getElementById("og-grid");
  if (!tilesContainer) {
    console.error("Tiles container with ID 'og-grid' not found. Check your HTML structure.");
    return;
  }

  // Fetch Records from Supabase
  async function fetchRecords() {
    try {
      console.log("Fetching records from Supabase...");
      const { data, error } = await supabase.from("subject_explorer_records").select("*");

      if (error) throw error;

      console.log("Records fetched successfully:", data);
      renderTiles(data);
    } catch (err) {
      console.error("Error fetching records:", err.message);
      tilesContainer.innerHTML = "<li>Error fetching records. Please try again later.</li>";
    }
  }

  // Render Tiles Dynamically
  function renderTiles(records) {
    if (!records || records.length === 0) {
      console.warn("No records found in Supabase.");
      tilesContainer.innerHTML = "<li>No records available.</li>";
      return;
    }

    // Create HTML structure for each record
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

    // Inject the tiles into the container
    tilesContainer.innerHTML = tiles.join("");

    // Reinitialize Grid.js functionality for dynamically added elements
    if (typeof Grid !== "undefined" && typeof Grid.init === "function") {
      console.log("Reinitializing Grid...");
      Grid.init();
    } else {
      console.warn("Grid.js is not defined or Grid.init is missing. Ensure Grid.js is loaded.");
    }
  }

  // Fetch and render records
  fetchRecords();
});
