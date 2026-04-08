import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { title, content } = (await request.json()) as { title?: string; content?: string }

  const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
  h1 { color: #4f46e5; border-bottom: 2px solid #4f46e5; padding-bottom: 10px; }
  h2 { color: #1f2937; margin-top: 24px; }
  .meta { color: #6b7280; font-size: 12px; margin-bottom: 24px; }
  .stat { display: inline-block; background: #f3f4f6; border-radius: 8px; padding: 12px 20px; margin: 8px; text-align: center; }
  .stat-value { font-size: 24px; font-weight: bold; color: #4f46e5; }
  .stat-label { font-size: 12px; color: #6b7280; }
  table { width: 100%; border-collapse: collapse; margin-top: 16px; }
  th { background: #4f46e5; color: white; padding: 10px; text-align: left; }
  td { padding: 8px 10px; border-bottom: 1px solid #e5e7eb; }
  tr:nth-child(even) { background: #f9fafb; }
  .alert { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 10px 16px; margin: 8px 0; border-radius: 4px; }
  .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e5e7eb; color: #9ca3af; font-size: 11px; }
</style>
</head>
<body>
<h1>${title ?? ''}</h1>
<p class="meta">Vygenerováno: ${new Date().toLocaleDateString('cs-CZ')} | Pepa Agent</p>
${content ?? ''}
<div class="footer">Pepa Back Office Agent | ${new Date().getFullYear()}</div>
</body>
</html>`

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  })
}
