import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://njhuxhzlxhonzbxasljg.supabase.co'
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_SlNqbg_8plmGN-I6xGIbkw_BxgHgqQA'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
})

/**
 * Saves a form submission into Supabase public.form_submissions.
 */
export async function saveSubmission({
  name,
  email,
  phone = '',
  topic = '',
  form = 'Website enquiry',
  page = '',
  message,
  submissionId = null,
  ip = '',
  emailSent = false,
  emailError = null,
}) {
  try {
    const record = {
      name,
      email,
      phone: phone || '',
      topic: topic || '',
      form: form || 'Website enquiry',
      page: page || '',
      message,
      submission_id: submissionId || null,
      ip: ip || '',
      status: 'new',
      email_sent: !!emailSent,
      email_error: emailError || null,
    }

    const { data, error } = await supabase.from('form_submissions').insert([record])
    if (error) {
      console.error('[supabase] Failed to save form submission:', error.message)
      return { ok: false, error: error.message }
    }
    return { ok: true, data }
  } catch (err) {
    console.error('[supabase] Error saving form submission:', err?.message || err)
    return { ok: false, error: err?.message || 'Unknown database error' }
  }
}
