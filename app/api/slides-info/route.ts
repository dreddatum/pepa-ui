import { NextResponse } from 'next/server'

const CLIENT_ID = '16457411901-drd95i4crsa6lnnhsbsufifen3on4ej1.apps.googleusercontent.com'
const CLIENT_SECRET = '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'
const REFRESH_TOKEN = '1//04xROtxZe4CqLCgYIARAAGAQSNwF-L9IrY3mpxWhN5pYE03Fqf2_JFCP4OexBZbqTB5dEAuTiLpnRnejdW8Vbuj26cT8qt2kqurE'
const PRESENTATION_ID = '1MQhUpAe-Zh7ssHkhP6SGUdXaEbyRgiD7AQv5VBAWMxY'

export async function GET() {
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      refresh_token: REFRESH_TOKEN,
      grant_type: 'refresh_token',
    }),
  })
  const { access_token } = await tokenRes.json()

  const res = await fetch(`https://slides.googleapis.com/v1/presentations/${PRESENTATION_ID}`, {
    headers: { Authorization: `Bearer ${access_token}` },
  })
  const data = await res.json()
  const slides = data.slides?.map((s: { objectId: string }, i: number) => ({
    slide: i + 1,
    id: s.objectId,
  }))
  return NextResponse.json({ slides })
}
