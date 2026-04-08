import { NextRequest, NextResponse } from 'next/server'

const WEBHOOK_URL = 'https://ikonomidis.app.n8n.cloud/webhook/pepa'

export async function POST(request: NextRequest) {
  const { message } = await request.json()

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
      signal: AbortSignal.timeout(120000),
    })

    const text = await response.text()
    console.log('n8n raw response:', text)

    let data
    try {
      data = JSON.parse(text)
    } catch {
      return NextResponse.json({ response: text })
    }

    const output = data.response || data.output || data.message || JSON.stringify(data)
    return NextResponse.json({ response: output })

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { response: 'Agent momentálně nedostupný. Zkuste to prosím znovu.' },
      { status: 200 }
    )
  }
}