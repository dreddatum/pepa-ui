import { NextRequest, NextResponse } from 'next/server'

const WEBHOOK_URL = 'https://ikonomidis.app.n8n.cloud/webhook/pepa'

export async function POST(request: NextRequest) {
  const { title, client, date, time, location, note } = await request.json()

  const message = `Vytvoř událost v Google Calendar: "${title}" pro klienta ${client} dne ${date} v ${time}. Místo: ${location}. Poznámka: ${note || '—'}. Odešli pozvánku.`

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
      signal: AbortSignal.timeout(60000),
    })
    const data = await response.json()
    return NextResponse.json({ success: true, response: data.response })
  } catch {
    return NextResponse.json({ success: false })
  }
}
