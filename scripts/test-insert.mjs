import { createClient } from '@supabase/supabase-js';

const url = process.env.VITE_SUPABASE_URL || 'https://tyrwapasrnfohjldfrnq.supabase.co';
const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_HRdlls3hKYGbnNUWszVaqQ_jqqA2EFk';

console.log('URL:', url);
console.log('Key prefix:', key?.slice(0, 20));

const supabase = createClient(url, key);

const payload = {
  category: 'ads',
  name: 'Test User',
  email: 'test@example.com',
  phone: null,
  project_type: 'Test project',
  hours_required: null,
  num_shooters: null,
  deliverables: null,
  additional_requirements: null,
  preferred_date: null,
  budget_range: 'under_2k',
  attachment_urls: null,
};

const { data, error } = await supabase.from('booking_enquiries').insert(payload);
console.log('Insert result:', { data, error });
if (error) {
  console.log('Error details:', JSON.stringify(error, null, 2));
  console.log('instanceof Error:', error instanceof Error);
  console.log('message:', error.message);
  process.exit(1);
}
console.log('SUCCESS');
process.exit(0);
