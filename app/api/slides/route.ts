import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const SLIDES_WEBHOOK = 'https://ikonomidis.app.n8n.cloud/webhook/pepa-slides'

const supabase = createClient(
  'https://bhcpotxdckwrahlsqlzf.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJoY3BvdHhkY2t3cmFobHNxbHpmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTU5MjAxNSwiZXhwIjoyMDkxMTY4MDE1fQ.2en-V7jZkqcFUUQ8i9acEeysjcsJeoyYgK-iZdSrBhM',
)

export async function POST(_request: NextRequest) {
  try {
    const { data } = await supabase
      .from('v_weekly_summary')
      .select('*')
      .limit(1)
      .single()

    const response = await fetch(SLIDES_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data || {}),
      signal: AbortSignal.timeout(30000),
    })

    const text = await response.text()
    return NextResponse.json({ success: true, message: text })
  } catch (error) {
    console.error('Slides error:', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
