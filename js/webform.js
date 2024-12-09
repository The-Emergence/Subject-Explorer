function exportProductHTML() {
    const form = document.getElementById('productForm');
    const formData = new FormData(form);

    // Collect form data
    const product = {};
    formData.forEach((value, key) => {
        product[key] = value || 'N/A'; // Use 'N/A' as fallback for empty fields
    });

    // Concatenate RDF6 Fields for data-description
    const rdf6Metadata = [
        product.rdfSubject || 'No subject',
        product.rdfPredicate || 'No predicate',
        product.rdfObject || 'No object',
        product.rdfType || 'No type',
        product.rdfSubtype || 'No subtype',
        product.rdfRelationship || 'No relationship'
    ].join(', ');

    // Generate HTML for Tile and Expander
    const htmlContent = `
<li>
    <a href="${product.productBuyLink || '#'}" 
       data-largesrc="${product.previewImage || ''}" 
       data-title="${product.previewTitle || 'Unnamed Product'}" 
       data-description="${product.previewDescription || 'No description provided.'} ${rdf6Metadata}"> 
        <div class="tile">
            <div class="product-badge">${product.previewTitle || 'Unnamed Product'}</div>
            <div class="text-group">
                <div class="word subject">${product.rdfSubject || 'No subject'}</div>
                <div class="word predicate">${product.rdfPredicate || 'No predicate'}</div>
                <div class="word object">${product.rdfObject || 'No object'}</div>
                <div class="word type">${product.rdfType || 'No type'}</div>
                <div class="word subtype">${product.rdfSubtype || 'No subtype'}</div>
                <div class="word relationship">${product.rdfRelationship || 'No relationship'}</div>
            </div>
        </div>
    </a>
    <div class="og-expander">
        <div class="og-expander-inner">
            <h3>${product.productName || 'Unnamed Product'}</h3>
            <p>${product.productDescription || 'No description provided.'}</p>
            <p><strong>Price:</strong> ${product.productPrice || 'Not specified'}</p>
            <p><a href="${product.productBuyLink || '#'}" target="_blank">Buy this product</a></p>
            <div class="rdf6-words">
                <p><strong>RDF6 Metadata:</strong></p>
                <ul>
                    <li><strong>Subject:</strong> ${product.rdfSubject || 'No subject'}</li>
                    <li><strong>Predicate:</strong> ${product.rdfPredicate || 'No predicate'}</li>
                    <li><strong>Object:</strong> ${product.rdfObject || 'No object'}</li>
                    <li><strong>Type:</strong> ${product.rdfType || 'No type'}</li>
                    <li><strong>Subtype:</strong> ${product.rdfSubtype || 'No subtype'}</li>
                    <li><strong>Relationship:</strong> ${product.rdfRelationship || 'No relationship'}</li>
                </ul>
            </div>
        </div>
    </div>
</li>`;

    // Create a Blob and download as HTML
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${(product.productName || 'Unnamed_Product').replace(/ /g, '_')}_record.html`;
    a.click();
}
