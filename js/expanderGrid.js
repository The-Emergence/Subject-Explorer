// expanderGrid.js

const supabaseUrl = 'https://qednuirrccgrlcqrszmb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlZG51aXJyY2NncmxjcXJzem1iIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNDQxMDk0NiwiZXhwIjoyMDQ5OTg2OTQ2fQ.V8gRGHLQtYbtc69yYm0N5d0rs8dA5JM4lHB_0DHlXzU';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ... (Rest of your expanderGrid.js code) ...

async function fetchData() {
  try {
    const { data, error } = await supabase
      .from('subject_explorer_records')
      .select('*'); 

    if (error) {
      console.error('Error fetching data:', error);
      return []; 
    } else {
      return data;
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    return []; 
  }
}

function formatDataForExpander(data) {
  return data.map(record => `
    <div>
      <h3>${record.name}</h3> 
      <p>Description: ${record.description}</p>
      <a href="${record.link}">Link to ${record.name}</a> 
    </div>
  `).join('');
}

async function populateExpander(tile) {
  const data = await fetchData();
  const expanderContent = formatDataForExpander(data); 

  const expanderContainer = tile.nextElementSibling; 
  expanderContainer.innerHTML = expanderContent; 

  expanderContainer.style.maxHeight = 'auto'; 
  expanderContainer.style.maxHeight = expanderContainer.scrollHeight + 'px'; 
}

export { populateExpander };
