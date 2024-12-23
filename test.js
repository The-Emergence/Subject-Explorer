// Check if Supabase is initialized
console.log("Supabase object:", supabase);

// Ensure fetchData is being called
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOMContentLoaded event fired.");
  fetchData();
});

// Inside fetchData
async function fetchData() {
  console.log("fetchData function is running...");

  try {
    const { data, error } = await supabase
      .from("subject_explorer_records") // Your table name
      .select("*");

    if (error) {
      console.error("Supabase error:", error.message);
      return;
    }

    console.log("Supabase data fetched successfully:", data);

    const output = document.getElementById("output");
    output.innerHTML = ""; // Clear existing content

    // Render fetched data
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
    console.error("Unexpected error:", err);
  }
}
