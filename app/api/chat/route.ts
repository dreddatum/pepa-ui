import { NextRequest, NextResponse } from 'next/server'

const WEBHOOK_URL = 'https://ikonomidis.app.n8n.cloud/webhook/pepa'

const CHARTS = {
  q1: { labels: ['Doporučení', 'Web', 'LinkedIn', 'Veletrh', 'Sreality', 'Agent'], data: [4, 3, 2, 2, 2, 3] },
  leads: { labels: ['Říj', 'Lis', 'Pro', 'Led', 'Úno', 'Bře'], data: [3, 4, 3, 4, 5, 4] },
  portfolio: { labels: ['Byty', 'Komerční', 'Domy', 'Pozemky', 'Garáže'], data: [82, 75, 33, 8, 4] },
  yield: { labels: ['PRG-005', 'PRG-002', 'PRG-011', 'PRG-013', 'PRG-009'], data: [4.86, 4.81, 4.17, 4.11, 3.79] },
}

function getChartUrl(message: string): string | null {
  const m = message.toLowerCase()
  let chart: { labels: string[]; data: number[] } | null = null
  let type = 'bar'

  if (m.includes('q1') || m.includes('kvart') || m.includes('zdroj')) chart = CHARTS.q1
  else if (m.includes('6 m') || m.includes('vývoj') || m.includes('trend') || m.includes('posledních')) { chart = CHARTS.leads; type = 'line' }
  else if (m.includes('portfolio') || m.includes('typ')) chart = CHARTS.portfolio
  else if (m.includes('výnos') || m.includes('yield')) chart = CHARTS.yield

  if (!chart) return null

  const cfg = JSON.stringify({
    type,
    data: {
      labels: chart.labels,
      datasets: [{
        data: chart.data,
        backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#3b82f6', '#ef4444', '#8b5cf6'],
        borderColor: '#6366f1',
        fill: false,
      }],
    },
    options: { plugins: { legend: { display: false } } },
  })

  return `https://quickchart.io/chart?c=${encodeURIComponent(cfg)}&w=500&h=280&bkg=%23111827`
}

function clean(text: string): string {
  const cutAt = ['<h2>📈', '<h2>📊 Graf']
  let result = text
  for (const cut of cutAt) {
    const i = result.indexOf(cut)
    if (i > 50) result = result.substring(0, i)
  }
  return result.replace(/[}\]\s]+$/, '').trim()
}

export async function POST(request: NextRequest) {
  const { message } = await request.json()

  try {
    const res = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
      signal: AbortSignal.timeout(120000),
    })

    const text = await res.text()
    let data: Record<string, unknown>
    try { data = JSON.parse(text) as Record<string, unknown> } catch { return NextResponse.json({ response: text }) }

    const raw = String(data.response ?? data.output ?? data.message ?? '')

    // Extrahuj CHART z n8n odpovědi
    const chartMatch = raw.match(/\[CHART:(\{[^}]+\}(?:,\{[^}]+\})*|\{[\s\S]+?\})\]/)
    console.log('CHART MATCH:', chartMatch?.[1]?.substring(0, 50))
    console.log('RAW CONTAINS CHART:', raw.includes('[CHART:'))
    console.log('CHART MATCH RESULT:', chartMatch ? 'FOUND' : 'NOT FOUND')

    // Vyčisti text
    let output = clean(raw)

    if (chartMatch) {
      try {
        const chartData = JSON.parse(chartMatch[1]) as {
          type?: string
          data: { name: string; value: number }[]
        }
        const cfg = {
          type: chartData.type || 'bar',
          data: {
            labels: chartData.data.map((d: { name: string }) => d.name),
            datasets: [{
              data: chartData.data.map((d: { value: number }) => d.value),
              backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#3b82f6', '#ef4444', '#8b5cf6'],
              borderColor: '#6366f1',
              fill: false,
            }],
          },
          options: { plugins: { legend: { display: false } } },
        }
        const url = `https://quickchart.io/chart?c=${encodeURIComponent(JSON.stringify(cfg))}&w=500&h=280&bkg=%23111827`
        output += `\n[CHART_URL:${url}]`
      } catch {
        const url = getChartUrl(message)
        if (url) output += `\n[CHART_URL:${url}]`
      }
    } else if (/graf|vizualiz|znazorn|graficky/i.test(message)) {
      const url = getChartUrl(message)
      if (url) output += `\n[CHART_URL:${url}]`
    }

    return NextResponse.json({ response: output })
  } catch {
    return NextResponse.json({ response: 'Agent momentálně nedostupný.' })
  }
}
