import { NextRequest, NextResponse } from 'next/server'

const SLIDES_WEBHOOK = 'https://ikonomidis.app.n8n.cloud/webhook/pepa-slides'

export async function POST(request: NextRequest) {
  try {
    const response = await fetch(SLIDES_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ trigger: 'manual' }),
      signal: AbortSignal.timeout(30000),
    })

    const text = await response.text()
    return NextResponse.json({ success: true, message: text })
  } catch (error) {
    console.error('Slides webhook error:', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
