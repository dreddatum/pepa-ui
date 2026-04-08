import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
const W = 'https://ikonomidis.app.n8n.cloud/webhook/pepa'
export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json()
    const res = await fetch(W, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message }), signal: AbortSignal.timeout(120000) })
    const text = await res.text()
    return NextResponse.json({ response: text })
  } catch (err) {
    return NextResponse.json({ response: 'Chyba: ' + String(err) })
  }
}
