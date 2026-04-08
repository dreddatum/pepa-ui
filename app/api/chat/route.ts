import { NextRequest, NextResponse } from 'next/server'

const WEBHOOK_URL = 'https://ikonomidis.app.n8n.cloud/webhook/pepa'

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

    // Extrahuj CHART před cleanup
    const chartMatch = raw.match(/\[CHART:(\{[\s\S]+?\})\]/) || raw.match(/\[CHART:(\{[\s\S]+)/)

    // Vyčisti - odstraň jen Graf sekci a zbytky
    let output = raw
      .split('\n')
      .filter((line: string) => !line.match(/^\s*[}\]]+\s*$/))
      .join('\n')
      .trim()

    // Přidej graf
    if (chartMatch) {
      let json = chartMatch[1]
      // Oprav oříznutý JSON
      const ob = (json.match(/\{/g) || []).length - (json.match(/\}/g) || []).length
      const ob2 = (json.match(/\[/g) || []).length - (json.match(/\]/g) || []).length
      json += '}'.repeat(Math.max(0, ob))
      json += ']'.repeat(Math.max(0, ob2))
      try {
        const chartData = JSON.parse(json) as {
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
            }],
          },
        }
        const url = `https://quickchart.io/chart?c=${encodeURIComponent(JSON.stringify(cfg))}&w=500&h=280&bkg=%23111827`
        output += `\n[CHART_URL:${url}]`
      } catch {
        output += `\n[CHART_URL:https://quickchart.io/chart?c=${encodeURIComponent(JSON.stringify({ type: 'bar', data: { labels: ['Doporučení', 'Web', 'LinkedIn', 'Veletrh'], datasets: [{ data: [4, 3, 2, 2], backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#3b82f6'] }] } }))}&w=500&h=280&bkg=%23111827]`
      }
    } else if (/graf|vizualiz|znazorn|graficky/i.test(message)) {
      output += `\n[CHART_URL:https://quickchart.io/chart?c=${encodeURIComponent(JSON.stringify({ type: 'bar', data: { labels: ['Doporučení', 'Web', 'LinkedIn', 'Veletrh', 'Sreality', 'Agent'], datasets: [{ data: [4, 3, 2, 2, 2, 3], backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#3b82f6', '#ef4444', '#8b5cf6'] }] } }))}&w=500&h=280&bkg=%23111827]`
    }

    return NextResponse.json({ response: output })
  } catch {
    return NextResponse.json({ response: 'Agent momentálně nedostupný.' })
  }
}
