// Initialize Supabase
const supabaseUrl = "https://qednuirrccgrlcqrszmb.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlZG51aXJyY2NncmxjcXJzem1iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ0MTA5NDYsImV4cCI6MjA0OTk4Njk0Nn0.Lb9OmaJN5TU_AOSoExbHLTBpCYcURTT3lG2bn1RJEr0";
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Fetch records from Supabase
async function fetchRecords() {
    try {
        const { data, error } = await supabase
            .from('subject_explorer_records')
            .select('*');

        if (error) throw error;

        console.log("Fetched records:", data);
        return data;
    } catch (err) {
        console.error("Error fetching records:", err.message);
        return [];
    }
}

// Render dynamic tiles into the grid
async function renderDynamicGrid() {
    const tilesContainer = document.getElementById("og-grid");
    const records = await fetchRecords();

    if (records.length === 0) {
        console.error("No records fetched from Supabase.");
        return;
    }

    // Clear existing tiles
    tilesContainer.innerHTML = "";

    // Create tiles dynamically
    records.forEach(record => {
        const tile = document.createElement('li');
        tile.innerHTML = `
            <a href="${record.subject_link || '#'}" 
               data-largesrc="${record.subject_image || 'https://via.placeholder.com/150'}" 
               data-title="${record.subject || 'Unknown Subject'}" 
               data-description="${record.description || 'No description available.'}">
                <div class="tile">
                    <div class="product-badge">${record.type ? record.type.toUpperCase() : 'PRODUCT'}</div>
                    <div class="text-group">
                        <div class="word subject">${record.subject || 'No Subject'}</div>
                        <div class="word predicate">${record.predicate || 'No Predicate'}</div>
                        <div class="word object">${record.object || 'No Object'}</div>
                        <div class="word type">${record.subtype || 'No Subtype'}</div>
                        <div class="word relationship">${record.relationship || 'No Relationship'}</div>
                    </div>
                </div>
            </a>
        `;
        tilesContainer.appendChild(tile);
    });

    // Reinitialize Grid functionality
    if (typeof Grid !== "undefined" && typeof Grid.init === "function") {
        console.log("Initializing Grid...");
        Grid.init();
    } else {
        console.error("Grid is not defined or init function is missing.");
    }
}

// Ensure rendering occurs after DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
    renderDynamicGrid();
});
