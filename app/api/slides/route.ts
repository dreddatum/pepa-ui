import { NextRequest, NextResponse } from 'next/server'

const GOOGLE_CLIENT_ID = '16457411901-drd95i4crsa6lnnhsbsufifen3on4ej1.apps.googleusercontent.com'
const GOOGLE_CLIENT_SECRET = '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'
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN!
const PRESENTATION_ID = '1MQhUpAe-Zh7ssHkhP6SGUdXaEbyRgiD7AQv5VBAWMxY'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

async function getAccessToken(): Promise<string> {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      refresh_token: REFRESH_TOKEN,
      grant_type: 'refresh_token',
    }),
  })
  const data = await response.json()
  if (!data.access_token) {
    throw new Error('Failed to get access token: ' + JSON.stringify(data))
  }
  return data.access_token
}

async function fetchWeeklySummary() {
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/v_weekly_summary?select=*`,
    {
      headers: {
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
    }
  )
  const data = await response.json()
  return Array.isArray(data) ? data[0] : data
}

function formatCZK(value: number): string {
  if (!value) return '0 Kč'
  return new Intl.NumberFormat('cs-CZ', {
    style: 'currency',
    currency: 'CZK',
    maximumFractionDigits: 0,
  }).format(value)
}

function buildQuickChartUrl(config: object): string {
  const encoded = encodeURIComponent(JSON.stringify(config))
  return `https://quickchart.io/chart?c=${encoded}&width=600&height=300&backgroundColor=white`
}

export async function POST(_req: NextRequest) {
  try {
    const summary = await fetchWeeklySummary()
    if (!summary) {
      return NextResponse.json({ error: 'No data in v_weekly_summary' }, { status: 404 })
    }

    const accessToken = await getAccessToken()

    const portfolioChart = buildQuickChartUrl({
      type: 'doughnut',
      data: {
        labels: ['Aktivní', 'Potřebuje audit'],
        datasets: [
          {
            data: [
              summary.aktivni_nemovitosti || 0,
              summary.potrebuje_audit || 0,
            ],
            backgroundColor: ['#10B981', '#F59E0B'],
          },
        ],
      },
      options: {
        plugins: {
          legend: { position: 'bottom' },
          title: { display: true, text: 'Portfolio nemovitostí' },
        },
      },
    })

    const pipelineChart = buildQuickChartUrl({
      type: 'bar',
      data: {
        labels: ['Aktivní leady', 'V jednání', 'Prošlé followupy'],
        datasets: [
          {
            label: 'Počet',
            data: [
              summary.aktivni_leady || 0,
              summary.leady_v_jednani || 0,
              summary.prosle_followupy || 0,
            ],
            backgroundColor: ['#3B82F6', '#8B5CF6', '#EF4444'],
          },
        ],
      },
      options: {
        plugins: {
          legend: { display: false },
          title: { display: true, text: 'Pipeline leadů' },
        },
      },
    })

    const requests = [
      {
        deleteText: {
          objectId: 'p',
          textRange: { type: 'ALL' },
        },
      },
      {
        insertText: {
          objectId: 'p',
          text: `Týdenní report\n${new Date().toLocaleDateString('cs-CZ')}`,
        },
      },
      {
        deleteText: {
          objectId: 'g38704fe2573_2_10',
          textRange: { type: 'ALL' },
        },
      },
      {
        insertText: {
          objectId: 'g38704fe2573_2_10',
          text: [
            `Aktivních nemovitostí: ${summary.aktivni_nemovitosti || 0}`,
            `Celková valuace: ${formatCZK(summary.celkova_valuace || 0)}`,
            `Průměrný výnos: ${(summary.prumerny_yield || 0).toFixed(2)}%`,
            `Aktivní leady: ${summary.aktivni_leady || 0}`,
            `Leady v jednání: ${summary.leady_v_jednani || 0}`,
            `Celkový potenciál: ${formatCZK(summary.celkovy_potencial || 0)}`,
            `Aktivní transakce: ${summary.aktivni_transakce || 0}`,
            `Uzavřené transakce: ${summary.uzavrene_transakce || 0}`,
            `Celkový objem: ${formatCZK(summary.celkovy_objem || 0)}`,
          ].join('\n'),
        },
      },
      {
        createImage: {
          url: portfolioChart,
          elementProperties: {
            pageObjectId: 'g38704fe2573_0_4',
            size: {
              width: { magnitude: 3000000, unit: 'EMU' },
              height: { magnitude: 2000000, unit: 'EMU' },
            },
            transform: {
              scaleX: 1,
              scaleY: 1,
              translateX: 500000,
              translateY: 1000000,
              unit: 'EMU',
            },
          },
        },
      },
      {
        createImage: {
          url: pipelineChart,
          elementProperties: {
            pageObjectId: 'g38704fe2573_0_4',
            size: {
              width: { magnitude: 3000000, unit: 'EMU' },
              height: { magnitude: 2000000, unit: 'EMU' },
            },
            transform: {
              scaleX: 1,
              scaleY: 1,
              translateX: 4000000,
              translateY: 1000000,
              unit: 'EMU',
            },
          },
        },
      },
    ]

    const updateResponse = await fetch(
      `https://slides.googleapis.com/v1/presentations/${PRESENTATION_ID}:batchUpdate`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requests }),
      }
    )
    const updateData = await updateResponse.json()
    if (!updateResponse.ok) {
      throw new Error(JSON.stringify(updateData))
    }

    return NextResponse.json({ success: true, url: `https://docs.google.com/presentation/d/${PRESENTATION_ID}/edit` })
  } catch (error: any) {
    console.error('Slides generation error:', error)
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 })
  }
}