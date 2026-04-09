import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const PRESENTATION_ID = '1MQhUpAe-Zh7ssHkhP6SGUdXaEbyRgiD7AQv5VBAWMxY'
const CLIENT_ID = '16457411901-drd95i4crsa6lnnhsbsufifen3on4ej1.apps.googleusercontent.com'
const CLIENT_SECRET = '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'
const REFRESH_TOKEN = '1//04xROtxZe4CqLCgYIARAAGAQSNwF-L9IrY3mpxWhN5pYE03Fqf2_JFCP4OexBZbqTB5dEAuTiLpnRnejdW8Vbuj26cT8qt2kqurE'

const supabase = createClient(
  'https://bhcpotxdckwrahlsqlzf.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJoY3BvdHhkY2t3cmFobHNxbHpmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTU5MjAxNSwiZXhwIjoyMDkxMTY4MDE1fQ.2en-V7jZkqcFUUQ8i9acEeysjcsJeoyYgK-iZdSrBhM',
)

async function getAccessToken() {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      refresh_token: REFRESH_TOKEN,
      grant_type: 'refresh_token',
    }),
  })
  const data = await res.json()
  return data.access_token
}

export async function POST() {
  try {
    const { data } = await supabase
      .from('v_weekly_summary')
      .select('*')
      .limit(1)
      .single()

    if (!data) throw new Error('No Supabase data')

    const today = new Date().toLocaleDateString('cs-CZ')
    const accessToken = await getAccessToken()

    const requests = [
      { replaceAllText: { containsText: { text: '114 550 000 Kč', matchCase: false }, replaceText: `${(data.celkova_valuace / 1000000).toFixed(1)}M Kč` } },
      { replaceAllText: { containsText: { text: 'NaN%', matchCase: false }, replaceText: `${parseFloat(data.prumerny_yield).toFixed(2)}%` } },
      { replaceAllText: { containsText: { text: 'undefined aktivních nemovitostí', matchCase: false }, replaceText: `${data.aktivni_nemovitosti} aktivních nemovitostí` } },
      { replaceAllText: { containsText: { text: 'Aktivní leady: undefined', matchCase: false }, replaceText: `Aktivní leady: ${data.aktivni_leady}` } },
      { replaceAllText: { containsText: { text: 'Leady v jednání: undefined', matchCase: false }, replaceText: `Leady v jednání: ${data.leady_v_jednani}` } },
      { replaceAllText: { containsText: { text: 'Prošlé follow-upy: undefined', matchCase: false }, replaceText: `Prošlé follow-upy: ${data.prosle_followupy}` } },
      { replaceAllText: { containsText: { text: 'MARKET_SUMMARY', matchCase: false }, replaceText: `Praha Holešovice: 223 000 Kč/m² · +25% YoY` } },
      { replaceAllText: { containsText: { text: 'Nemovitosti k auditu: undefined', matchCase: false }, replaceText: `Nemovitosti k auditu: ${data.potrebuje_audit}` } },
      { replaceAllText: { containsText: { text: '9. 4. 2026', matchCase: false }, replaceText: today } },
      // Grafy jako obrázky - Slide 1
      {
        createImage: {
          url: `https://quickchart.io/chart?c=${encodeURIComponent(
            JSON.stringify({
              type: 'bar',
              data: {
                labels: ['Doporučení', 'Web', 'Agent', 'Veletrh', 'Telefon', 'Sreality'],
                datasets: [
                  {
                    data: [22, 22, 12, 8, 10, 6],
                    backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#3b82f6', '#ef4444', '#8b5cf6'],
                  },
                ],
              },
              options: {
                plugins: {
                  legend: { display: false },
                  title: { display: true, text: 'Leady dle zdroje' },
                },
              },
            }),
          )}&w=500&h=250&bkg=white`,
          elementProperties: {
            pageObjectId: 'p',
            size: {
              width: { magnitude: 320, unit: 'PT' },
              height: { magnitude: 180, unit: 'PT' },
            },
            transform: { scaleX: 1, scaleY: 1, translateX: 30, translateY: 200, unit: 'PT' },
          },
        },
      },
      // Graf vývoje - Slide 1
      {
        createImage: {
          url: `https://quickchart.io/chart?c=${encodeURIComponent(
            JSON.stringify({
              type: 'line',
              data: {
                labels: ['Říj', 'Lis', 'Pro', 'Led', 'Úno', 'Bře'],
                datasets: [{ label: 'Leady', data: [3, 4, 3, 4, 5, 4], borderColor: '#6366f1', fill: false }],
              },
            }),
          )}&w=500&h=250&bkg=white`,
          elementProperties: {
            pageObjectId: 'p',
            size: {
              width: { magnitude: 320, unit: 'PT' },
              height: { magnitude: 180, unit: 'PT' },
            },
            transform: { scaleX: 1, scaleY: 1, translateX: 370, translateY: 200, unit: 'PT' },
          },
        },
      },
      // Slide 2 - Pipeline graf
      {
        createImage: {
          url: `https://quickchart.io/chart?c=${encodeURIComponent(
            JSON.stringify({
              type: 'bar',
              data: {
                labels: ['Nový', 'Kontaktován', 'Nabídka', 'Jednáme'],
                datasets: [
                  {
                    data: [20, 25, 18, 21],
                    backgroundColor: ['#6b7280', '#3b82f6', '#f59e0b', '#10b981'],
                  },
                ],
              },
              options: {
                plugins: {
                  legend: { display: false },
                  title: { display: true, text: 'Pipeline leadů' },
                },
              },
            }),
          )}&w=500&h=250&bkg=white`,
          elementProperties: {
            pageObjectId: 'g38704fe2573_2_10',
            size: {
              width: { magnitude: 320, unit: 'PT' },
              height: { magnitude: 180, unit: 'PT' },
            },
            transform: { scaleX: 1, scaleY: 1, translateX: 30, translateY: 200, unit: 'PT' },
          },
        },
      },
      // Slide 3 - Tržní benchmark
      {
        createImage: {
          url: `https://quickchart.io/chart?c=${encodeURIComponent(
            JSON.stringify({
              type: 'bar',
              data: {
                labels: ['Holešovice', 'Karlín', 'Vinohrady', 'Smíchov', 'Dejvice'],
                datasets: [
                  { label: 'Kč/m²', data: [223000, 198000, 210000, 175000, 205000], backgroundColor: '#6366f1' },
                ],
              },
              options: {
                plugins: {
                  legend: { display: false },
                  title: { display: true, text: 'Tržní průměry Kč/m²' },
                },
              },
            }),
          )}&w=500&h=250&bkg=white`,
          elementProperties: {
            pageObjectId: 'g38704fe2573_0_4',
            size: {
              width: { magnitude: 640, unit: 'PT' },
              height: { magnitude: 200, unit: 'PT' },
            },
            transform: { scaleX: 1, scaleY: 1, translateX: 30, translateY: 200, unit: 'PT' },
          },
        },
      },
    ]

    const res = await fetch(
      `https://slides.googleapis.com/v1/presentations/${PRESENTATION_ID}:batchUpdate`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requests }),
      },
    )

    const result = await res.json()
    if (result.error) throw new Error(result.error.message)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Slides error:', error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}
