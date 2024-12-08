function generateListItem(formData) {
  return `
<li>
  <a href="${formData.link}" 
     data-largesrc="${formData.image}" 
     data-title="${formData.title}" 
     data-description="${formData.description}
     <br><br>
     <strong>BREADCRUMBS</strong><br>
     ${formData.breadcrumbs.join(" + | ")}<br><br>
     <strong>ASSOCIATIONS</strong><br>
     ${formData.associations.join(" | ")}
     <br><br><strong>Share This</strong>">
    <div class="tile">
      <div class="product-badge">${formData.badge}</div>
      <div class="text-group">
        <div class="word subject">${formData.subject}</div>
        <div class="word object">${formData.object}</div>
        <div class="word type">${formData.type}</div>
        ${formData.subtypes.map(subtype => `<div class="word subtype">${subtype}</div>`).join("")}
      </div>
    </div>
  </a>
</li>`;
}

function submitRecord() {
  // Gather form data
  const formData = {
    link: document.getElementById("link").value,
    image: document.getElementById("image").value,
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    breadcrumbs: document.getElementById("breadcrumbs").value.split(","),
    associations: document.getElementById("associations").value.split(","),
    badge: document.getElementById("badge").value,
    subject: document.getElementById("subject").value,
    object: document.getElementById("object").value,
    type: document.getElementById("type").value,
    subtypes: document.getElementById("subtypes").value.split(",")
  };

  // Generate HTML and append to output
  const listItemHTML = generateListItem(formData);
  document.getElementById("output").innerHTML = listItemHTML;
}


