'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { FileText, Download, Copy, Check, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const CONTRACT_TYPES = [
  {
    id: 'rezervace',
    label: 'Rezervační smlouva',
    description: 'Pro rezervaci nemovitosti před podpisem kupní smlouvy',
    color: 'border-blue-500',
  },
  {
    id: 'kupni',
    label: 'Kupní smlouva',
    description: 'Převod vlastnictví nemovitosti',
    color: 'border-green-500',
  },
  {
    id: 'najemni',
    label: 'Nájemní smlouva',
    description: 'Pronájem bytu nebo komerčního prostoru',
    color: 'border-amber-500',
  },
  {
    id: 'spravcovska',
    label: 'Správcovská smlouva',
    description: 'Správa nemovitosti pro vlastníka',
    color: 'border-purple-500',
  },
]

const TEMPLATES: Record<string, string> = {
  rezervace: `REZERVAČNÍ SMLOUVA

uzavřená níže uvedeného dne, měsíce a roku mezi:

Prodávající:
Jméno/Firma: ___________________________
Adresa: ___________________________
IČO/RČ: ___________________________

a

Kupující:
Jméno/Firma: ___________________________
Adresa: ___________________________
IČO/RČ: ___________________________

I. Předmět rezervace
Prodávající touto smlouvou rezervuje nemovitost:
Adresa: ___________________________
LV č.: ___________________________
Katastrální území: ___________________________

II. Rezervační záloha
Kupující se zavazuje uhradit rezervační zálohu ve výši: ___________ Kč
Splatnost: do ___________ dnů od podpisu této smlouvy
Na účet: ___________________________

III. Rezervační lhůta
Nemovitost je rezervována do: ___________________________
V této lhůtě se prodávající zavazuje nenabízet nemovitost třetím osobám.

IV. Podmínky
1. Rezervační záloha bude započtena na kupní cenu.
2. Neuzavřou-li strany kupní smlouvu v rezervační lhůtě z důvodů na straně kupujícího, záloha propadá prodávajícímu.
3. Neuzavřou-li strany kupní smlouvu z důvodů na straně prodávajícího, vrátí zálohu ve dvojnásobné výši.

V. Závěrečná ustanovení
Tato smlouva je vyhotovena ve dvou stejnopisech.

V Praze dne: ___________________________

Prodávající: ___________________________    Kupující: ___________________________`,

  kupni: `SMLOUVA O KOUPI NEMOVITÉ VĚCI

uzavřená níže uvedeného dne, měsíce a roku mezi:

Prodávající:
Jméno/Firma: ___________________________
Adresa: ___________________________
IČO/RČ: ___________________________
Zapsán/a v OR: ___________________________

a

Kupující:
Jméno/Firma: ___________________________
Adresa: ___________________________
IČO/RČ: ___________________________

I. Předmět koupě
Prodávající prodává kupujícímu a kupující kupuje od prodávajícího nemovitou věc:
- Byt/dům/pozemek č.: ___________________________
- Adresa: ___________________________
- Zapsáno na LV č.: ___________ pro k.ú. ___________________________
- Výměra: ___________ m²
- Podíl na společných částech: ___________________________

II. Kupní cena
Smluvní strany se dohodly na kupní ceně: ___________ Kč (slovy: ___________________________)

Způsob úhrady:
□ Hotovost
□ Bankovním převodem na účet: ___________________________
□ Z hypotečního úvěru — banka: ___________________________
□ Prostřednictvím advokátní/notářské úschovy

III. Předání nemovitosti
Prodávající předá nemovitost kupujícímu do: ___________________________
Stav při předání: ___________________________

IV. Prohlášení prodávajícího
Prodávající prohlašuje, že:
1. Je výlučným vlastníkem nemovitosti.
2. Nemovitost není zatížena zástavním právem (s výjimkou: ___________________________)
3. Na nemovitosti neváznou žádné jiné právní vady.
4. Nejsou mu známy žádné skryté vady.

V. Vklad do katastru nemovitostí
Smluvní strany se zavazují podat návrh na vklad do KN do ___________ dnů od úhrady kupní ceny.
Náklady na vklad hradí: ___________________________

VI. Závěrečná ustanovení
Tato smlouva se řídí právním řádem ČR, zejm. § 2079 a násl. OZ.
Vyhotovena ve třech stejnopisech.

V Praze dne: ___________________________

Prodávající: ___________________________    Kupující: ___________________________

Ověření podpisů: ___________________________`,

  najemni: `NÁJEMNÍ SMLOUVA

uzavřená níže uvedeného dne, měsíce a roku mezi:

Pronajímatel:
Jméno/Firma: ___________________________
Adresa: ___________________________
IČO/RČ: ___________________________

a

Nájemce:
Jméno/Firma: ___________________________
Adresa: ___________________________
IČO/RČ: ___________________________

I. Předmět nájmu
Pronajímatel přenechává nájemci do užívání:
Byt/prostory č.: ___________________________
Adresa: ___________________________
Plocha: ___________ m²
Vybavení: □ Zařízený  □ Částečně zařízený  □ Nezařízený

II. Doba nájmu
□ Na dobu určitou: od ___________ do ___________
□ Na dobu neurčitou: od ___________
Výpovědní lhůta: ___________ měsíců

III. Nájemné a platby
Měsíční nájemné: ___________ Kč
Zálohy na služby: ___________ Kč
Celková měsíční platba: ___________ Kč

Splatnost: ___________ den v měsíci
Způsob platby: převodem na účet: ___________________________

IV. Kauce (jistota)
Výše kauce: ___________ Kč (max. 3 měsíční nájemné)
Splatnost: před předáním bytu
Vrácení: do 1 měsíce od skončení nájmu

V. Práva a povinnosti
Nájemce se zavazuje:
1. Platit nájemné řádně a včas.
2. Užívat byt pouze pro bydlení.
3. Provádět běžnou údržbu na vlastní náklady.
4. Hlásit závady pronajímateli bez zbytečného odkladu.
5. Neumožnit podnájem bez souhlasu pronajímatele.

Pronajímatel se zavazuje:
1. Předat byt ve stavu způsobilém k řádnému užívání.
2. Zajistit nerušené užívání bytu.

VI. Závěrečná ustanovení
Smlouva se řídí § 2235 a násl. OZ.

V Praze dne: ___________________________

Pronajímatel: ___________________________    Nájemce: ___________________________`,

  spravcovska: `SMLOUVA O SPRÁVĚ NEMOVITOSTI

uzavřená níže uvedeného dne, měsíce a roku mezi:

Vlastník (mandant):
Jméno/Firma: ___________________________
Adresa: ___________________________
IČO/RČ: ___________________________

a

Správce (mandatář):
Firma: ___________________________
Adresa: ___________________________
IČO: ___________________________
Číslo oprávnění RK: ___________________________

I. Předmět smlouvy
Vlastník svěřuje správci správu nemovitosti:
Adresa: ___________________________
LV č.: ___________________________

II. Rozsah správy
Správce se zavazuje zajišťovat:
□ Vyhledání nájemce
□ Uzavření nájemní smlouvy
□ Výběr nájemného
□ Dohled nad stavem nemovitosti
□ Zajištění oprav do výše ___________ Kč
□ Vedení evidence plateb
□ Vyúčtování služeb

III. Odměna správce
Měsíční odměna: ___________ Kč nebo ___________ % z nájemného
Splatnost: do ___________ dne v měsíci

IV. Trvání smlouvy
□ Na dobu určitou: do ___________
□ Na dobu neurčitou s výpovědní lhůtou ___________ měsíců

V. Závěrečná ustanovení
Smlouva se řídí § 2430 a násl. OZ.

V Praze dne: ___________________________

Vlastník: ___________________________    Správce: ___________________________`,
}

const formatPriceNumber = (value?: string | null) => {
  if (!value) return ''
  const num = Number(value)
  if (Number.isNaN(num)) return value
  return new Intl.NumberFormat('cs-CZ', { maximumFractionDigits: 0 }).format(num)
}

const prefillTemplate = (
  template: string,
  type: string,
  params: { property?: string | null; propertyName?: string | null; district?: string | null; price?: string | null; lead?: string | null },
) => {
  const propertyCode = params.property || ''
  const propertyName = params.propertyName || ''
  const district = params.district || ''
  const lead = params.lead || ''
  const price = formatPriceNumber(params.price)

  let result = template

  if (type === 'rezervace') {
    const addressText = [propertyCode, propertyName, district].filter(Boolean).join(' · ')
    result = result
      .replace('Kupující:\nJméno/Firma: ___________________________', `Kupující:\nJméno/Firma: ${lead || '___________________________'}`)
      .replace('Adresa: ___________________________\nLV č.:', `Adresa: ${addressText || '___________________________'}\nLV č.:`)
      .replace('Katastrální území: ___________________________', `Katastrální území: ${district || '___________________________'}`)
      .replace(
        'Kupující se zavazuje uhradit rezervační zálohu ve výši: ___________ Kč',
        `Kupující se zavazuje uhradit rezervační zálohu ve výši: ${price ? `${price} Kč` : '___________ Kč'}`,
      )
  } else if (type === 'kupni') {
    const addressText = [propertyName, district].filter(Boolean).join(' · ')
    result = result
      .replace('Kupující:\nJméno/Firma: ___________________________', `Kupující:\nJméno/Firma: ${lead || '___________________________'}`)
      .replace('- Byt/dům/pozemek č.: ___________________________', `- Byt/dům/pozemek č.: ${propertyCode || '___________________________'}`)
      .replace('- Adresa: ___________________________', `- Adresa: ${addressText || '___________________________'}`)
      .replace(
        'Smluvní strany se dohodly na kupní ceně: ___________ Kč (slovy: ___________________________)',
        `Smluvní strany se dohodly na kupní ceně: ${price ? `${price} Kč` : '___________ Kč'} (slovy: ___________________________)`,
      )
  }

  return result
}

type CustomData = {
  propertyName: string
  propertyCode: string
  price: string
  priceNumber: string
  address: string
  sellerName: string
  buyerName: string
  date: string
}

function buildPrefillFromCustomData(data: CustomData, lead: string | null) {
  return {
    property: data.propertyCode || null,
    propertyName: data.propertyName || null,
    district: data.address || null,
    price: data.priceNumber || null,
    lead,
  }
}

function getTemplate(type: string, customData: CustomData, lead: string | null) {
  const t = TEMPLATES[type] || ''
  const fromParams = buildPrefillFromCustomData(customData, lead)
  let result = prefillTemplate(t, type, fromParams)
  result = result
    .replace(/Adresa: ___/g, `Adresa: ${customData.address || '___'}`)
    .replace(/___________________________\n.*?LV/g, `${customData.propertyName || '___'}\nLV`)
    .replace('___________ Kč (slovy', `${customData.price || '___'} Kč (slovy`)
  return result
}

function ContractsContent() {
  const searchParams = useSearchParams()
  const code = searchParams.get('code') || ''
  const name = searchParams.get('name') || ''
  const priceParam = searchParams.get('price') || ''
  const address = searchParams.get('address') || ''

  const [selected, setSelected] = useState<string | null>(null)
  const [templateText, setTemplateText] = useState('')
  const [copied, setCopied] = useState(false)
  const [customData, setCustomData] = useState<CustomData>({
    propertyName: name,
    propertyCode: code,
    price: priceParam ? new Intl.NumberFormat('cs-CZ', { maximumFractionDigits: 0 }).format(Number(priceParam)) : '',
    priceNumber: priceParam,
    address: address,
    sellerName: '',
    buyerName: '',
    date: new Date().toLocaleDateString('cs-CZ'),
  })

  useEffect(() => {
    const legacyProperty = searchParams.get('property') || ''
    const legacyName = searchParams.get('propertyName') || ''
    const legacyDistrict = searchParams.get('district') || ''
    const legacyPrice = searchParams.get('price') || ''
    const urlCode = searchParams.get('code') || ''
    const urlName = searchParams.get('name') || ''
    const urlAddress = searchParams.get('address') || ''

    const resolvedCode = urlCode || legacyProperty
    const resolvedName = urlName || legacyName
    const resolvedAddress = urlAddress || legacyDistrict
    const resolvedPrice = urlCode || urlName || urlAddress ? (searchParams.get('price') || '') : legacyPrice

    setCustomData({
      propertyName: resolvedName,
      propertyCode: resolvedCode,
      price: resolvedPrice
        ? new Intl.NumberFormat('cs-CZ', { maximumFractionDigits: 0 }).format(Number(resolvedPrice))
        : '',
      priceNumber: resolvedPrice,
      address: resolvedAddress,
      sellerName: '',
      buyerName: '',
      date: new Date().toLocaleDateString('cs-CZ'),
    })
  }, [searchParams])

  useEffect(() => {
    if (code) {
      setSelected('rezervace')
      return
    }
    const requestedType = searchParams.get('type')
    const validType =
      requestedType && CONTRACT_TYPES.some(t => t.id === requestedType) ? requestedType : null
    if (validType) setSelected(validType)
    else setSelected(CONTRACT_TYPES[0].id)
  }, [searchParams, code])

  useEffect(() => {
    if (!selected) return
    const lead = searchParams.get('lead')
    setTemplateText(getTemplate(selected, customData, lead))
  }, [selected, customData, searchParams])

  const handleCopy = () => {
    if (!selected) return
    navigator.clipboard.writeText(templateText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    if (!selected) return
    const blob = new Blob([templateText], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${selected}-smlouva.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/" className="text-gray-500 hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-xl font-semibold">Návrhy smluv</h1>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-8">
          {CONTRACT_TYPES.map(type => (
            <button
              key={type.id}
              type="button"
              onClick={() => setSelected(type.id)}
              className={`bg-gray-900 rounded-xl p-4 border-t-2 ${type.color} border-x border-b text-left transition-all ${
                selected === type.id ? 'border-x-2 border-b-2 opacity-100' : 'border-gray-800 opacity-70 hover:opacity-100'
              }`}
            >
              <FileText size={20} className="mb-2 text-gray-400" />
              <p className="font-medium text-sm">{type.label}</p>
              <p className="text-xs text-gray-500 mt-1">{type.description}</p>
            </button>
          ))}
        </div>

        {selected && (
          <div className="bg-gray-900 rounded-xl border border-gray-800">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
              <h2 className="font-medium">{CONTRACT_TYPES.find(t => t.id === selected)?.label}</h2>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-lg text-sm transition-colors"
                >
                  {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                  {copied ? 'Zkopírováno' : 'Kopírovat'}
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 rounded-lg text-sm transition-colors"
                >
                  <Download size={14} />
                  Stáhnout
                </button>
              </div>
            </div>
            <textarea
              value={templateText}
              onChange={(e) => setTemplateText(e.target.value)}
              className="w-full p-6 text-sm text-gray-300 whitespace-pre-wrap font-mono leading-relaxed overflow-auto max-h-[600px] min-h-[600px] bg-transparent outline-none resize-y"
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default function ContractsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-950 text-white p-6 flex items-center justify-center text-gray-400 text-sm">
          Načítání…
        </div>
      }
    >
      <ContractsContent />
    </Suspense>
  )
}
