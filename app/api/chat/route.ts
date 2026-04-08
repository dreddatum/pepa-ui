import { NextRequest, NextResponse } from 'next/server'

const WEBHOOK_URL = 'https://ikonomidis.app.n8n.cloud/webhook/pepa'

const CHART_KEYWORDS = {
  q1: { type: 'bar', title: 'Leady dle zdroje — Q1 2026', data: [
    { name: 'Doporučení', value: 4 },
    { name: 'Web', value: 3 },
    { name: 'LinkedIn', value: 2 },
    { name: 'Veletrh', value: 2 },
    { name: 'Sreality', value: 2 },
    { name: 'Agent partner', value: 3 },
    { name: 'Telefon', value: 2 },
    { name: 'Email', value: 1 },
  ]},
  leads_6m: { type: 'line', title: 'Vývoj leadů za 6 měsíců', data: [
    { name: 'Říj 25', value: 3 },
    { name: 'Lis 25', value: 4 },
    { name: 'Pro 25', value: 3 },
    { name: 'Led 26', value: 4 },
    { name: 'Úno 26', value: 5 },
    { name: 'Bře 26', value: 4 },
  ]},
  portfolio: { type: 'bar', title: 'Hodnota portfolia dle typu', data: [
    { name: 'Byty', value: 81550000 },
    { name: 'Komerční', value: 75400000 },
    { name: 'Domy', value: 33400000 },
    { name: 'Pozemky', value: 8200000 },
    { name: 'Garáže', value: 3500000 },
  ]},
  yield: { type: 'bar', title: 'Výnos p.a. dle nemovitosti', data: [
    { name: 'PRG-005', value: 4.86 },
    { name: 'PRG-002', value: 4.81 },
    { name: 'PRG-011', value: 4.17 },
    { name: 'PRG-013', value: 4.11 },
    { name: 'PRG-009', value: 3.79 },
  ]},
}

function detectChart(message: string): typeof CHART_KEYWORDS[keyof typeof CHART_KEYWORDS] | null {
  const m = message.toLowerCase()
  if (m.includes('kvartál') || m.includes('q1') || m.includes('zdroj')) return CHART_KEYWORDS.q1
  if (m.includes('6 měsíc') || m.includes('vývoj') || m.includes('trend')) return CHART_KEYWORDS.leads_6m
  if (m.includes('portfolio') && (m.includes('typ') || m.includes('hodnot'))) return CHART_KEYWORDS.portfolio
  if (m.includes('výnos') || m.includes('yield')) return CHART_KEYWORDS.yield
  return null
}

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
    let data
    try { data = JSON.parse(text) } catch { return NextResponse.json({ response: text }) }

    let output = data.response || data.output || data.message || JSON.stringify(data)

    // Smaž vše co GPT vygeneroval jako "graf"
    output = output.split('\n')
      .filter((line: string) => !line.includes('}]') && !line.includes('Data pro vizualizaci') && !line.includes('Data budou vizualizována'))
      .join('\n')
      .trim()

    // Přidej graf ze serveru
    const m = message.toLowerCase()
    if (m.includes('graf') || m.includes('vizualiz') || m.includes('znázorn')) {
      const chart = detectChart(message)
      if (chart) output += `\n[CHART:${JSON.stringify(chart)}]`
    }

    return NextResponse.json({ response: output })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ response: 'Agent momentálně nedostupný.' })
  }
}
