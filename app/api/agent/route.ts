import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
const W = 'https://ikonomidis.app.n8n.cloud/webhook/pepa'
export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json()
    // Detekuj monitoring dotaz
    if (/hole[sš]ovic|realitní server|sleduj.*server|ráno.*informuj|monitoring trhu/i.test(message)) {
      try {
        await fetch('https://ikonomidis.app.n8n.cloud/webhook/morning-watch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ trigger: 'manual' }),
          signal: AbortSignal.timeout(30000),
        })
        return NextResponse.json({
          response: '<h2>📊 STAV</h2><p>Spustil jsem monitoring realitních serverů pro lokalitu <strong>Praha Holešovice</strong>.</p><h2>🎯 AKCE</h2><p>Za pár minut ti přijde email s aktuálními nabídkami z Bezrealitky a Sreality.</p>',
        })
      } catch {
        return NextResponse.json({ response: 'Nepodařilo se spustit monitoring.' })
      }
    }
    const res = await fetch(W, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message }), signal: AbortSignal.timeout(120000) })
    const text = await res.text()
    return NextResponse.json({ response: text })
  } catch (err) {
    return NextResponse.json({ response: 'Chyba: ' + String(err) })
  }
}
