document.addEventListener('DOMContentLoaded', async () => {
  // Initialize Supabase
  const SUPABASE_URL = "https://qednuirrccgrlcqrszmb.supabase.co";
  const SUPABASE_ANON_KEY = "your-anon-key-here";
  
  const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  console.log('Supabase client initialized:', supabase);

  // Fetch data from Supabase
  async function fetchData() {
    console.log('Function fetchData is running...');
    try {
      console.log('Attempting to fetch data...');
      const { data, error } = await supabase
        .from('subject_explorer_records')
        .select('*');

      if (error) {
        console.error('Error fetching data:', error);
        return;
      }

      console.log('Fetched data:', data);
      const output = document.getElementById('output');
      output.textContent = JSON.stringify(data, null, 2);
    } catch (err) {
      console.error('Unexpected error:', err);
    }
  }

  await fetchData();
});
