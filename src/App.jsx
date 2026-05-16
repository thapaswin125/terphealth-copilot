import { useMemo, useRef, useState } from 'react'
import {
  AlertTriangle,
  Ambulance,
  ArrowRight,
  BadgeDollarSign,
  BookOpenText,
  Brain,
  Building2,
  CheckCircle2,
  CircleDollarSign,
  ClipboardList,
  HeartPulse,
  Loader2,
  MapPin,
  MessageSquareText,
  Pill,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  X,
} from 'lucide-react'

const UMD_SHIP_BENEFITS = {
  provider: 'Aetna Student Health',
  network: 'Aetna PPO',
  planYear: '2025-2026',
  annualStudentCostEstimate: '$2,806 total if buying Fall + Spring/Summer as listed in 2025-2026 summary',
  fallRate: '$1,176',
  springRate: '$1,630',
  summerRate: '$469',
  inNetworkDeductible: '$250',
  outOfNetworkDeductible: '$500',
  inNetworkOutOfPocketMax: '$1,500',
  outOfNetworkOutOfPocketMax: '$3,500',
  umdHealthCenterCoveredServices: '$0 for covered services at UMD Health Center, including sick visits, lab work, x-rays, behavioral health, immunizations, women\'s health, and international travel services',
  physicianSpecialistCopay: '$25 per visit, deductible waived',
  mentalHealthOfficeVisitCopay: '$25 per visit, deductible waived',
  emergencyRoomCopay: '$100 per visit, deductible waived, copay waived if admitted',
  prescriptionCopays: {
    generic: '$20',
    preferredBrand: '$40',
    nonPreferredBrand: '$60',
  },
  preventiveCare: '100% in-network, deductible waived',
  labAndXray: 'Generally 80% after deductible outside UMD Health Center, but covered UMD Health Center services may be $0',
  inpatientOutpatientSurgery: '80% in-network / 60% out-of-network after deductible',
}

const UMD_RESOURCES = [
  {
    name: 'University Health Center',
    type: 'Campus care',
    category: 'Campus',
    location: 'Building #140, UMD College Park',
    phone: '301-314-8184',
    bestFor: ['sick visit', 'primary care', 'x-ray', 'lab', 'immunizations', 'sexual health', 'prescription refill', 'minor injury'],
    estimatedCostWithSHIP: '$0 for many covered services at UHC',
    notes: 'Best first stop for non-emergency student health needs.',
    ask: 'Ask whether the visit, lab, x-ray, or vaccine is a covered UHC service under SHIP.',
  },
  {
    name: 'UMD Counseling Center',
    type: 'Free mental health support',
    category: 'Mental Health',
    location: 'Shoemaker Building',
    phone: '301-314-7651',
    bestFor: ['stress', 'anxiety', 'burnout', 'relationship issues', 'roommate stress', 'academic pressure', 'career anxiety'],
    estimatedCostWithSHIP: 'Free for registered UMD students',
    notes: 'Brief assessment, urgent visits during business hours, after-hours crisis support by phone.',
    ask: 'Ask about urgent visits, groups, brief assessment, and after-hours support.',
  },
  {
    name: 'UMD Psychiatry & Substance Use Services / PASS',
    type: 'Campus psychiatry and behavioral health',
    category: 'Mental Health',
    location: 'University Health Center',
    phone: '301-314-8184',
    bestFor: ['medication management', 'psychiatry', 'substance use support', 'behavioral health'],
    estimatedCostWithSHIP: 'Often covered through SHIP; use UHC/campus care pathway first',
    notes: 'Good for psychiatric medication or substance-use related concerns.',
    ask: 'Ask whether an intake, referral, or medication appointment is needed.',
  },
  {
    name: 'College Park Medical Center',
    type: 'Nearby urgent/primary care',
    category: 'Urgent Care',
    location: 'College Park, MD',
    phone: '301-345-4400',
    bestFor: ['urgent care', 'walk-in care', 'strep test', 'flu test', 'COVID test', 'minor wounds'],
    estimatedCostWithSHIP: 'Likely $25 physician visit if in-network; confirm Aetna network before going',
    notes: 'Nearby option when UHC is closed or unavailable.',
    ask: 'Ask whether they are in-network with Aetna Student Health and whether tests bill separately.',
  },
  {
    name: 'Urgent Care / Aetna in-network urgent care',
    type: 'Urgent care',
    category: 'Urgent Care',
    location: 'Nearby College Park / Hyattsville / Greenbelt',
    phone: 'Use Aetna provider search',
    bestFor: ['sprain', 'minor injury', 'fever', 'infection', 'strep', 'non-life-threatening urgent issue'],
    estimatedCostWithSHIP: 'Estimate around $25-$75 depending on provider/coding; confirm in-network',
    notes: 'Cheaper than ER for non-emergencies.',
    ask: 'Ask for the visit copay estimate and whether imaging or labs are billed separately.',
  },
  {
    name: 'Emergency Room',
    type: 'Emergency care',
    category: 'Emergency',
    location: 'Nearest ER',
    phone: '911',
    bestFor: ['chest pain', 'trouble breathing', 'severe allergic reaction', 'major injury', 'suicidal intent', 'stroke symptoms'],
    estimatedCostWithSHIP: '$100 ER copay listed in UMD SHIP summary; other charges may apply depending on services',
    notes: 'Use for true emergencies only. Copay may be waived if admitted.',
    ask: 'For emergencies, do not delay care to ask billing questions.',
  },
  {
    name: '988 Suicide & Crisis Lifeline',
    type: '24/7 crisis support',
    category: 'Emergency',
    location: 'Call or text 988',
    phone: '988',
    bestFor: ['suicidal thoughts', 'mental health crisis', 'urgent emotional distress'],
    estimatedCostWithSHIP: 'Free',
    notes: 'For immediate mental health crisis support.',
    ask: 'Use now if there is immediate emotional danger or suicidal thoughts.',
  },
  {
    name: 'UMD Mental Health & Well-being Hub',
    type: 'Campus resource directory',
    category: 'Mental Health',
    location: 'UMD',
    phone: 'N/A',
    bestFor: ['wellness events', 'mental health campaigns', 'campus support', 'connection', 'student resources'],
    estimatedCostWithSHIP: 'Free campus resources',
    notes: 'One-stop hub for UMD mental health and wellness resources.',
    ask: 'Ask which support path fits your situation and schedule.',
  },
  {
    name: 'Center for Healthy Families',
    type: 'Sliding-scale therapy',
    category: 'Low Cost',
    location: 'UMD School of Public Health',
    phone: 'Check center website',
    bestFor: ['couples therapy', 'family therapy', 'individual therapy', 'relationship conflict'],
    estimatedCostWithSHIP: 'Sliding-scale / lower-cost option',
    notes: 'Good for roommate/relationship/family stress support.',
    ask: 'Ask about sliding-scale fees, appointment wait time, and student eligibility.',
  },
  {
    name: 'Community clinic / CCI Health & Wellness type clinics',
    type: 'Low-cost community care',
    category: 'Low Cost',
    location: 'Prince George\'s County / nearby Maryland',
    phone: 'Check clinic',
    bestFor: ['low-cost primary care', 'uninsured care', 'family planning', 'behavioral health'],
    estimatedCostWithSHIP: 'Low-cost/sliding-scale; varies by clinic',
    notes: 'Useful for students worried about cost or access.',
    ask: 'Ask about sliding-scale fees, insurance billing, and appointment availability.',
  },
]

const scenarios = [
  'I have a sore throat',
  'I twisted my ankle',
  'I feel burned out',
  "I need therapy but I'm worried about cost",
  'I need a prescription refill',
  'I got a medical bill',
  'I need STI testing',
  'I need urgent care after hours',
]

const costCards = [
  ['UMD Health Center covered services', 'Likely $0', UMD_SHIP_BENEFITS.umdHealthCenterCoveredServices, Building2],
  ['Doctor/specialist office visit', '$25 copay', UMD_SHIP_BENEFITS.physicianSpecialistCopay, Stethoscope],
  ['Mental health office visit', '$25 copay', UMD_SHIP_BENEFITS.mentalHealthOfficeVisitCopay, Brain],
  ['Emergency room', '$100 copay', `${UMD_SHIP_BENEFITS.emergencyRoomCopay}; other charges may apply.`, Ambulance],
  ['Prescriptions', '$20 / $40 / $60', `Generic ${UMD_SHIP_BENEFITS.prescriptionCopays.generic}, preferred brand ${UMD_SHIP_BENEFITS.prescriptionCopays.preferredBrand}, non-preferred brand ${UMD_SHIP_BENEFITS.prescriptionCopays.nonPreferredBrand}.`, Pill],
  ['In-network deductible', UMD_SHIP_BENEFITS.inNetworkDeductible, `In-network out-of-pocket max: ${UMD_SHIP_BENEFITS.inNetworkOutOfPocketMax}.`, ShieldCheck],
  ['Preventive care', '100%', UMD_SHIP_BENEFITS.preventiveCare, CheckCircle2],
  ['Out-of-network deductible', UMD_SHIP_BENEFITS.outOfNetworkDeductible, `Out-of-network out-of-pocket max: ${UMD_SHIP_BENEFITS.outOfNetworkOutOfPocketMax}.`, CircleDollarSign],
]

const hiddenBenefits = [
  'Many covered services at UMD Health Center may be $0',
  'Free UMD Counseling Center services for registered students',
  '24-hour nurse line / telehealth may help with next-step guidance',
  'Preventive care is 100% in-network, deductible waived',
  'Prescription copay tiers can make generics cheaper',
  'Mental health and crisis resources are available on and off campus',
  'International student-friendly insurance education can prevent surprise bills',
]

const disclaimer = 'This is not medical advice or a final insurance quote. For emergencies call 911. For mental health crisis call/text 988 or UMD Counseling Center 301-314-7651.'

function classifyConcern(symptomText) {
  const text = symptomText.toLowerCase()
  if (/chest pain|trouble breathing|difficulty breathing|stroke|severe allergic|major injury|unconscious|overdose|severe bleeding/.test(text)) return 'emergency'
  if (/suicidal|kill myself|self harm|hurt myself|mental health crisis|crisis/.test(text)) return 'mental_health_crisis'
  if (/anxious|anxiety|burned out|burnout|therapy|therapist|depressed|stress|overwhelmed|panic|roommate|relationship|academic pressure/.test(text)) return 'mental_health_nonurgent'
  if (/sore throat|throat|fever|strep|flu|covid|cough|infection/.test(text)) return 'sore_throat_fever'
  if (/ankle|sprain|twisted|injury|hurt|fall|fell|minor injury|x-ray|xray/.test(text)) return 'injury_sprain'
  if (/refill|prescription|medicine|medication|pharmacy|generic/.test(text)) return 'prescription_refill'
  if (/bill|charged|claim|deductible|copay|coinsurance|invoice|itemized/.test(text)) return 'medical_bill'
  if (/preventive|checkup|annual|vaccine|immunization|screening|sti|std|testing|sexual health/.test(text)) return 'preventive_care'
  if (/after hours|urgent care|closed|walk-in|walk in/.test(text)) return 'sore_throat_fever'
  return 'general_primary_care'
}

function getCareRecommendation(symptomText) {
  const category = classifyConcern(symptomText)
  const base = {
    category,
    disclaimer,
    sourceNote: 'Estimated / based on UMD SHIP 2025-2026 summary; final costs depend on provider, network status, coding, and services performed.',
  }

  const recommendations = {
    emergency: {
      bestOption: 'Call 911 or go to the nearest Emergency Room now.',
      why: 'Your symptoms may need immediate emergency evaluation. Do not delay care to compare costs.',
      estimatedCost: '$100 ER copay is listed in the UMD SHIP summary, deductible waived and copay waived if admitted; other charges may apply depending on services.',
      cheaperAlternative: 'No cheaper alternative should replace emergency care when symptoms are serious.',
      whenToEscalate: 'Escalate immediately for chest pain, trouble breathing, stroke symptoms, severe allergic reaction, major injury, or severe bleeding.',
      questions: ['After you are safe, ask whether the hospital and physicians were in-network.', 'Ask for an itemized bill and explanation of benefits.'],
      resources: ['Emergency Room', '988 Suicide & Crisis Lifeline'],
    },
    mental_health_crisis: {
      bestOption: 'Call/text 988 now, call UMD Counseling Center at 301-314-7651, or call 911 if there is immediate danger.',
      why: 'Crisis support is designed for immediate emotional distress and safety planning.',
      estimatedCost: '988 is free. UMD Counseling Center support is free for registered UMD students.',
      cheaperAlternative: 'For non-immediate support, UMD Counseling Center is still the best low-cost first step.',
      whenToEscalate: 'Escalate now if there are suicidal thoughts, intent to self-harm, inability to stay safe, or danger to someone else.',
      questions: ['Can I get urgent support today?', 'What after-hours crisis support is available?'],
      resources: ['988 Suicide & Crisis Lifeline', 'UMD Counseling Center'],
    },
    mental_health_nonurgent: {
      bestOption: 'UMD Counseling Center first.',
      why: 'It is campus-specific, free for registered UMD students, and can route you to workshops, groups, brief assessment, or outside therapy if needed.',
      estimatedCost: 'Free for registered UMD students. Outside therapy through SHIP may estimate around a $25 mental health office visit copay, deductible waived.',
      cheaperAlternative: 'Wellness workshops, peer/community support, and the UMD Mental Health & Well-being Hub are free campus resources.',
      whenToEscalate: 'Call/text 988, call UMD Counseling Center, or call 911 if you feel unsafe or might hurt yourself.',
      questions: ['Is this free for registered students?', 'Can I get a brief assessment?', 'Can you refer me to an Aetna in-network therapist?', 'Is PASS/UHC appropriate for medication or psychiatry?'],
      resources: ['UMD Counseling Center', 'UMD Psychiatry & Substance Use Services / PASS', 'UMD Mental Health & Well-being Hub'],
    },
    sore_throat_fever: {
      bestOption: 'University Health Center.',
      why: 'For a sore throat, fever, strep/flu/COVID test, or non-emergency illness, UHC is usually the best first stop for UMD students and may avoid urgent care or ER costs.',
      estimatedCost: 'Likely $0 for covered sick visit/lab at UHC under SHIP. Nearby urgent care backup may estimate $25-$75 depending on Aetna network status and coding.',
      cheaperAlternative: 'Use UHC before urgent care when open. Use Aetna provider search before off-campus care.',
      whenToEscalate: 'Go to urgent care or ER for trouble breathing, severe dehydration, chest pain, severe worsening symptoms, or other emergency symptoms.',
      questions: ['Is this covered under SHIP?', 'Is the test or lab billed separately?', 'Is this provider in-network with Aetna Student Health?'],
      resources: ['University Health Center', 'College Park Medical Center', 'Urgent Care / Aetna in-network urgent care'],
    },
    injury_sprain: {
      bestOption: 'University Health Center if the injury is not severe.',
      why: 'UHC can handle many minor injuries, and covered UHC services may be $0. It is a cheaper first step than the ER for non-emergency sprains.',
      estimatedCost: 'X-ray at UHC may be covered at $0 if it is a covered UHC service. Outside facilities may involve deductible/coinsurance. Urgent care estimate: $25-$75. ER estimate: $100 copay plus possible additional costs.',
      cheaperAlternative: 'Use UHC first if open and symptoms are not severe.',
      whenToEscalate: 'Use urgent care or ER for severe swelling, inability to bear weight, deformity, numbness, major trauma, or uncontrolled pain.',
      questions: ['Can UHC do x-rays for this?', 'Is imaging covered at $0 here?', 'Will an outside x-ray bill separately?', 'Do I need an in-network referral?'],
      resources: ['University Health Center', 'Urgent Care / Aetna in-network urgent care', 'Emergency Room'],
    },
    prescription_refill: {
      bestOption: 'University Health Center or your primary care clinician.',
      why: 'A refill request is usually best handled through primary care/campus care instead of urgent care, unless it is time-sensitive and UHC is unavailable.',
      estimatedCost: `Prescription copay estimate at Aetna-contracted pharmacies: generic ${UMD_SHIP_BENEFITS.prescriptionCopays.generic}, preferred brand ${UMD_SHIP_BENEFITS.prescriptionCopays.preferredBrand}, non-preferred brand ${UMD_SHIP_BENEFITS.prescriptionCopays.nonPreferredBrand}.`,
      cheaperAlternative: 'Ask for a generic medication and use an Aetna-contracted pharmacy.',
      whenToEscalate: 'Seek urgent care if missing the medication could become medically urgent and your clinician cannot help in time.',
      questions: ['Is a visit required for this refill?', 'Is there a generic version?', 'Is my pharmacy in-network?', 'Which prescription tier is this?'],
      resources: ['University Health Center', 'UMD Psychiatry & Substance Use Services / PASS'],
    },
    medical_bill: {
      bestOption: 'Do not pay immediately. Compare the bill against UMD SHIP benefits and call Aetna/AHP plus provider billing.',
      why: 'Bills can be wrong, unprocessed, out-of-network, or missing insurance adjustments. An itemized bill and EOB can reveal what happened.',
      estimatedCost: 'Depends on network status, coding, deductible, copay, and services performed. UHC covered services may be $0, office visits may be $25, ER copay may be $100 plus other charges.',
      cheaperAlternative: 'Ask the provider about reprocessing the claim, financial assistance, payment plans, or correcting network/billing errors.',
      whenToEscalate: 'Escalate to the insurer/provider supervisor if insurance was not applied, the provider says out-of-network unexpectedly, or the charge looks inconsistent with the EOB.',
      questions: ['Can I get an itemized bill?', 'Was this processed by Aetna Student Health?', 'Was the provider in-network?', 'Which CPT codes were billed?', 'Did this apply to deductible, copay, or coinsurance?'],
      resources: ['University Health Center', 'Community clinic / CCI Health & Wellness type clinics'],
    },
    preventive_care: {
      bestOption: 'University Health Center for preventive care, vaccines, STI testing, sexual health, and immunizations.',
      why: 'UHC is built for UMD students, and preventive care is 100% in-network with deductible waived. Many covered UHC services may be $0.',
      estimatedCost: 'Preventive care is listed as 100% in-network, deductible waived. Covered UHC services may be $0. Final cost depends on service and coding.',
      cheaperAlternative: 'Use UHC before off-campus clinics when possible. Community clinics may help if cost/access is a barrier.',
      whenToEscalate: 'Escalate to urgent care for severe symptoms, high fever, or time-sensitive concerns when UHC is closed.',
      questions: ['Is this coded as preventive?', 'Is this a covered UHC service?', 'Will labs bill separately?', 'Do I need an appointment?'],
      resources: ['University Health Center', 'Community clinic / CCI Health & Wellness type clinics'],
    },
    general_primary_care: {
      bestOption: 'University Health Center.',
      why: 'For non-emergency student health needs, UHC is the safest first navigation step and may be the lowest-cost option under UMD SHIP.',
      estimatedCost: 'Many covered services at UHC may be $0. Off-campus doctor/specialist visits are listed around a $25 copay, deductible waived.',
      cheaperAlternative: 'Try UHC first, then Aetna in-network providers if you need off-campus care.',
      whenToEscalate: 'Use urgent care for non-life-threatening after-hours issues. Use ER/911 for emergencies.',
      questions: ['Is this a covered UHC service?', 'Do I need a referral?', 'Is an outside provider in-network?', 'Will labs or imaging bill separately?'],
      resources: ['University Health Center', 'College Park Medical Center'],
    },
  }

  return { ...base, ...recommendations[category] }
}

function App() {
  const [input, setInput] = useState('')
  const [selectedScenario, setSelectedScenario] = useState('')
  const [recommendation, setRecommendation] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [resourceFilter, setResourceFilter] = useState('Campus')
  const [isDemoOpen, setIsDemoOpen] = useState(false)
  const navigatorRef = useRef(null)
  const inputRef = useRef(null)

  const filteredResources = useMemo(() => {
    if (resourceFilter === 'Campus') {
      return UMD_RESOURCES.filter((resource) => resource.category === 'Campus' || resource.name.includes('PASS'))
    }
    return UMD_RESOURCES.filter((resource) => resource.category === resourceFilter)
  }, [resourceFilter])

  function runNavigator(text) {
    const scenarioText = text.trim()
    if (!scenarioText) return
    setInput(scenarioText)
    setSelectedScenario(scenarioText)
    setRecommendation(null)
    setIsLoading(true)
    window.setTimeout(() => {
      setRecommendation(getCareRecommendation(scenarioText))
      setIsLoading(false)
      window.setTimeout(() => inputRef.current?.focus(), 50)
    }, 650)
    navigatorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function handleSubmit(event) {
    event.preventDefault()
    runNavigator(input)
  }

  return (
    <main className="min-h-screen bg-[#f7f5f0] text-neutral-950">
      <EmergencyBanner />
      <Nav />
      <Hero onStart={() => navigatorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })} />
      <ScenarioCards onSelect={runNavigator} selectedScenario={selectedScenario} />
      <NavigatorSection
        refEl={navigatorRef}
        inputRef={inputRef}
        input={input}
        setInput={setInput}
        isLoading={isLoading}
        recommendation={recommendation}
        onSubmit={handleSubmit}
      />
      <CostCheatSheet />
      <ResourceDirectory filter={resourceFilter} setFilter={setResourceFilter} resources={filteredResources} />
      <HiddenBenefits onDemo={() => setIsDemoOpen(true)} />
      <Footer />
      {isDemoOpen && <DemoModal onClose={() => setIsDemoOpen(false)} />}
    </main>
  )
}

function EmergencyBanner() {
  return (
    <div className="bg-neutral-950 text-white">
      <div className="mx-auto flex w-[min(1180px,calc(100%-32px))] flex-wrap items-center justify-center gap-x-4 gap-y-1 py-2 text-center text-sm font-bold">
        <span className="inline-flex items-center gap-2 text-[#ffd200]"><AlertTriangle size={16} /> Emergency? Call 911</span>
        <span className="hidden text-white/40 sm:inline">|</span>
        <span>Mental health crisis? Call/Text 988</span>
      </div>
    </div>
  )
}

function Nav() {
  const links = [
    ['Home', '#home'],
    ['Care Navigator', '#navigator'],
    ['SHIP Costs', '#ship-costs'],
    ['Mental Health', '#resources'],
    ['Nearby Care', '#resources'],
  ]
  return (
    <header className="sticky top-0 z-30 border-b border-black/10 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex w-[min(1180px,calc(100%-32px))] flex-wrap items-center justify-between gap-3 py-3">
        <a href="#home" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e21833] text-white shadow-sm">
            <HeartPulse size={22} />
          </span>
          <span>
            <span className="block text-lg font-black tracking-tight">TerpHealth Copilot</span>
            <span className="block text-xs font-bold text-neutral-500">Built for UMD students</span>
          </span>
        </a>
        <div className="flex max-w-full gap-1 overflow-x-auto rounded-xl border border-neutral-200 bg-neutral-50 p-1">
          {links.map(([label, href]) => (
            <a key={label} href={href} className="shrink-0 rounded-lg px-3 py-2 text-sm font-bold text-neutral-650 transition hover:bg-white hover:text-[#e21833]">
              {label}
            </a>
          ))}
        </div>
      </nav>
    </header>
  )
}

function Hero({ onStart }) {
  return (
    <section id="home" className="relative overflow-hidden bg-white">
      <div className="absolute inset-x-0 top-0 h-2 bg-[linear-gradient(90deg,#e21833_0_25%,#ffd200_25%_50%,#111_50%_75%,#fff_75%_100%)]" />
      <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-[#ffd200]/20 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-[#e21833]/10 blur-3xl" />
      <div className="mx-auto grid w-[min(1180px,calc(100%-32px))] gap-8 py-12 lg:grid-cols-[minmax(0,1fr)_430px] lg:py-16">
        <div className="relative z-10 min-w-0">
          <div className="mb-5 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#e21833] px-3 py-1.5 text-sm font-black text-white">
              <Sparkles size={15} /> Built for UMD students
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#ffd200]/70 bg-[#ffd200]/20 px-3 py-1.5 text-sm font-black text-neutral-950">
              Go Terps
            </span>
          </div>
          <h1 className="max-w-3xl text-5xl font-black leading-[1.02] tracking-tight text-neutral-950 sm:text-6xl">
            Know where to go before you get the bill.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-neutral-650">
            TerpHealth Copilot helps UMD students understand SHIP costs, campus care, mental health support, and nearby low-cost options.
          </p>
          <p className="mt-4 max-w-2xl text-sm font-bold text-neutral-600">
            Built for UMD students using UMD SHIP/Aetna 2025-2026 benefit estimates.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button onClick={onStart} className="inline-flex items-center gap-2 rounded-xl bg-[#e21833] px-5 py-3 text-sm font-black text-white shadow-lg shadow-red-900/10 transition hover:-translate-y-0.5 hover:bg-[#b9152b]">
              Start with a symptom <ArrowRight size={17} />
            </button>
            <a href="#ship-costs" className="inline-flex items-center gap-2 rounded-xl border border-neutral-300 bg-white px-5 py-3 text-sm font-black text-neutral-950 transition hover:-translate-y-0.5 hover:border-[#ffd200] hover:bg-[#ffd200]/15">
              View SHIP cost cheat sheet
            </a>
          </div>
        </div>
        <div className="relative z-10 rounded-2xl border border-neutral-200 bg-neutral-950 p-4 text-white shadow-2xl shadow-neutral-950/15">
          <div className="rounded-xl border border-white/10 bg-white/[0.06] p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#ffd200]">Aetna Student Health</p>
                <h2 className="mt-2 text-2xl font-black">UMD SHIP 2025-2026</h2>
              </div>
              <ShieldCheck className="text-[#ffd200]" />
            </div>
            <div className="mt-5 grid gap-3">
              <HeroStat label="UHC covered services" value="Likely $0" />
              <HeroStat label="Doctor/specialist" value="$25 copay" />
              <HeroStat label="ER listed copay" value="$100" />
              <HeroStat label="In-network deductible" value="$250" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function HeroStat({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/10 px-4 py-3">
      <span className="text-sm font-semibold text-white/75">{label}</span>
      <span className="text-base font-black text-white">{value}</span>
    </div>
  )
}

function ScenarioCards({ onSelect, selectedScenario }) {
  return (
    <section className="border-y border-black/10 bg-[#fffaf0]">
      <div className="mx-auto w-[min(1180px,calc(100%-32px))] py-8">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.14em] text-[#e21833]">Demo mode</p>
            <h2 className="mt-1 text-2xl font-black tracking-tight">Pick a UMD student scenario</h2>
          </div>
          <p className="max-w-xl text-sm font-semibold leading-6 text-neutral-600">
            Clicking a card auto-fills the navigator, scrolls to the answer, and runs the recommendation.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {scenarios.map((scenario) => {
            const isSelected = selectedScenario === scenario
            return (
              <button
                key={scenario}
                onClick={() => onSelect(scenario)}
                className={`group min-h-[96px] rounded-2xl border-t-4 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                  isSelected ? 'border-t-[#e21833] ring-2 ring-[#ffd200]' : 'border-t-[#ffd200] border-x-neutral-200 border-b-neutral-200'
                }`}
              >
                <span className="flex items-center justify-between gap-3">
                  <span className="font-black text-neutral-950">{scenario}</span>
                  <ArrowRight size={17} className={`shrink-0 transition ${isSelected ? 'text-[#e21833]' : 'text-neutral-400 group-hover:text-[#e21833]'}`} />
                </span>
                {isSelected && <span className="mt-3 inline-flex rounded-full bg-[#e21833]/10 px-2 py-1 text-xs font-black text-[#e21833]">Selected</span>}
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function NavigatorSection({ refEl, inputRef, input, setInput, isLoading, recommendation, onSubmit }) {
  return (
    <section id="navigator" ref={refEl} className="mx-auto grid w-[min(1180px,calc(100%-32px))] gap-6 py-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <form onSubmit={onSubmit} className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm lg:sticky lg:top-24 lg:self-start">
        <SectionLabel icon={Stethoscope} label="AI Care Navigator" />
        <h2 className="mt-3 text-3xl font-black tracking-tight">What is going on?</h2>
        <p className="mt-3 text-sm font-semibold leading-6 text-neutral-600">
          Example: I have a sore throat and I am worried about cost.
        </p>
        <textarea
          ref={inputRef}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Describe your concern..."
          className="mt-5 min-h-40 w-full resize-y rounded-xl border border-neutral-250 bg-neutral-50 p-4 text-base leading-7 outline-none transition placeholder:text-neutral-400 focus:border-[#e21833] focus:bg-white focus:ring-4 focus:ring-red-100"
        />
        <button className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-950 px-5 py-3 text-sm font-black text-white transition hover:bg-[#e21833]">
          {isLoading ? <Loader2 size={18} className="animate-spin" /> : <MessageSquareText size={18} />}
          Generate recommendation
        </button>
        <p className="mt-4 text-xs font-semibold leading-5 text-neutral-500">
          Care navigation only. No diagnosis. Costs are estimates based on UMD SHIP/Aetna 2025-2026 summary.
        </p>
      </form>
      <RecommendationCard isLoading={isLoading} recommendation={recommendation} />
    </section>
  )
}

function RecommendationCard({ isLoading, recommendation }) {
  if (isLoading) {
    return (
      <div className="flex min-h-[560px] items-center justify-center rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
        <div className="text-center">
          <Loader2 size={38} className="mx-auto animate-spin text-[#e21833]" />
          <p className="mt-5 text-lg font-black">Finding the best UMD care route...</p>
          <p className="mt-2 max-w-md text-sm font-semibold leading-6 text-neutral-600">Checking campus care, SHIP estimates, urgent care backup, and safety escalation.</p>
        </div>
      </div>
    )
  }

  if (!recommendation) {
    return (
      <div className="min-h-[560px] rounded-2xl border border-dashed border-neutral-300 bg-white p-6 shadow-sm">
        <div className="flex h-full min-h-[500px] flex-col items-center justify-center text-center">
          <ClipboardList size={42} className="text-neutral-300" />
          <h3 className="mt-4 text-2xl font-black">Your answer appears here</h3>
          <p className="mt-3 max-w-md text-sm font-semibold leading-6 text-neutral-600">
            Choose a scenario above or type your own concern. The response will clearly show the best first stop, estimated SHIP cost, backups, and red flags.
          </p>
        </div>
      </div>
    )
  }

  return (
    <article className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-neutral-100 pb-4">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.14em] text-[#e21833]">Recommendation</p>
          <h3 className="mt-2 text-2xl font-black tracking-tight">{recommendation.bestOption}</h3>
        </div>
        <span className="rounded-full bg-[#ffd200]/25 px-3 py-1 text-xs font-black text-neutral-950">{recommendation.category.replaceAll('_', ' ')}</span>
      </div>
      <div className="mt-5 grid gap-4">
        <AnswerBlock title="Estimated cost with UMD SHIP" icon={BadgeDollarSign} tone="gold">
          {recommendation.estimatedCost}
        </AnswerBlock>
        <AnswerBlock title="Why this is best" icon={CheckCircle2}>
          {recommendation.why}
        </AnswerBlock>
        <AnswerBlock title="Cheaper alternative / backup" icon={MapPin}>
          {recommendation.cheaperAlternative}
        </AnswerBlock>
        <AnswerBlock title="Red flags / when to escalate" icon={AlertTriangle} tone="red">
          {recommendation.whenToEscalate}
        </AnswerBlock>
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
          <h4 className="font-black">Questions to ask before booking</h4>
          <ul className="mt-3 space-y-2">
            {recommendation.questions.map((question) => (
              <li key={question} className="flex gap-2 text-sm font-semibold leading-6 text-neutral-650">
                <CheckCircle2 size={16} className="mt-1 shrink-0 text-[#e21833]" />
                {question}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-bold leading-6 text-red-900">
          {recommendation.disclaimer}
        </div>
        <p className="text-xs font-bold leading-5 text-neutral-500">{recommendation.sourceNote}</p>
      </div>
    </article>
  )
}

function AnswerBlock({ title, icon: Icon, children, tone = 'neutral' }) {
  const toneClass = {
    neutral: 'bg-neutral-50 text-neutral-950',
    gold: 'bg-[#ffd200]/20 text-neutral-950',
    red: 'bg-red-50 text-red-900',
  }[tone]
  return (
    <div className={`rounded-xl border border-neutral-200 p-4 ${toneClass}`}>
      <div className="mb-2 flex items-center gap-2">
        <Icon size={18} className={tone === 'red' ? 'text-[#e21833]' : 'text-neutral-700'} />
        <h4 className="font-black">{title}</h4>
      </div>
      <p className="text-sm font-semibold leading-6 text-neutral-700">{children}</p>
    </div>
  )
}

function CostCheatSheet() {
  return (
    <section id="ship-costs" className="bg-white py-10">
      <div className="mx-auto w-[min(1180px,calc(100%-32px))]">
        <SectionLabel icon={ShieldCheck} label="SHIP Costs" />
        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black tracking-tight">UMD SHIP cost cheat sheet</h2>
            <p className="mt-2 text-sm font-semibold text-neutral-600">{UMD_SHIP_BENEFITS.provider} | {UMD_SHIP_BENEFITS.network} | Plan year {UMD_SHIP_BENEFITS.planYear}</p>
          </div>
          <span className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm font-black">{UMD_SHIP_BENEFITS.annualStudentCostEstimate}</span>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {costCards.map(([title, value, text, Icon]) => (
            <div key={title} className="rounded-2xl border border-neutral-200 border-t-[#e21833] border-t-4 bg-white p-5 shadow-sm">
              <Icon size={22} className="text-[#e21833]" />
              <h3 className="mt-4 text-sm font-black text-neutral-600">{title}</h3>
              <p className="mt-2 text-2xl font-black tracking-tight">{value}</p>
              <p className="mt-3 text-sm font-semibold leading-6 text-neutral-600">{text}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 rounded-xl border border-[#ffd200]/70 bg-[#ffd200]/20 p-4 text-sm font-bold leading-6 text-neutral-800">
          Always confirm network status and final cost with Aetna/provider. All amounts are estimated / based on UMD SHIP 2025-2026 summary; final costs depend on provider, network status, coding, and services performed.
        </div>
      </div>
    </section>
  )
}

function ResourceDirectory({ filter, setFilter, resources }) {
  const filters = ['Campus', 'Mental Health', 'Urgent Care', 'Low Cost', 'Emergency']
  return (
    <section id="resources" className="py-10">
      <div className="mx-auto w-[min(1180px,calc(100%-32px))]">
        <SectionLabel icon={MapPin} label="Resource Directory" />
        <h2 className="mt-3 text-3xl font-black tracking-tight">UMD and nearby care options</h2>
        <div className="mt-5 flex gap-2 overflow-x-auto rounded-2xl border border-neutral-200 bg-white p-2">
          {filters.map((item) => (
            <button key={item} onClick={() => setFilter(item)} className={`shrink-0 rounded-xl px-4 py-2 text-sm font-black transition ${filter === item ? 'bg-[#e21833] text-white' : 'bg-neutral-50 text-neutral-700 hover:bg-[#ffd200]/25'}`}>
              {item}
            </button>
          ))}
        </div>
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {resources.map((resource) => (
            <div key={resource.name} className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-black text-[#e21833]">{resource.type}</p>
                  <h3 className="mt-1 text-xl font-black tracking-tight">{resource.name}</h3>
                </div>
                <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-black text-neutral-700">{resource.category}</span>
              </div>
              <p className="mt-4 text-sm font-semibold leading-6 text-neutral-650"><strong>Best for:</strong> {resource.bestFor.join(', ')}</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-neutral-650"><strong>Estimated cost:</strong> {resource.estimatedCostWithSHIP}</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-neutral-650"><strong>Phone/location:</strong> {resource.phone} | {resource.location}</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-neutral-650"><strong>Ask before you go:</strong> {resource.ask}</p>
              <p className="mt-3 rounded-xl bg-neutral-50 p-3 text-sm font-semibold leading-6 text-neutral-600">{resource.notes}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function HiddenBenefits({ onDemo }) {
  return (
    <section className="bg-neutral-950 py-10 text-white">
      <div className="mx-auto w-[min(1180px,calc(100%-32px))]">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <SectionLabel icon={BookOpenText} label="Hidden Benefits" dark />
            <h2 className="mt-3 text-3xl font-black tracking-tight">Things Terps may not realize they already have</h2>
          </div>
          <button onClick={onDemo} className="rounded-xl bg-[#ffd200] px-4 py-3 text-sm font-black text-neutral-950 transition hover:-translate-y-0.5">
            Open Demo Script
          </button>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {hiddenBenefits.map((benefit) => (
            <div key={benefit} className="rounded-2xl border border-white/10 bg-white/8 p-5">
              <CheckCircle2 className="text-[#ffd200]" />
              <p className="mt-4 font-bold leading-6 text-white">{benefit}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function DemoModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.14em] text-[#e21833]">Judge demo mode</p>
            <h2 className="mt-2 text-2xl font-black">Demo Script</h2>
          </div>
          <button onClick={onClose} className="rounded-lg bg-neutral-100 p-2 transition hover:bg-neutral-200" aria-label="Close demo script">
            <X size={18} />
          </button>
        </div>
        <p className="mt-5 text-base font-semibold leading-8 text-neutral-700">
          Imagine a UMD student has a sore throat and is scared of surprise bills. Instead of guessing between ER, urgent care, or campus care, they click "I have a sore throat." TerpHealth Copilot recommends UMD Health Center first, estimates $0 for covered SHIP services, gives urgent care and ER backup costs, and tells them what questions to ask before booking.
        </p>
      </div>
    </div>
  )
}

function SectionLabel({ icon: Icon, label, dark = false }) {
  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-black ${dark ? 'bg-white/10 text-[#ffd200]' : 'bg-[#e21833]/10 text-[#e21833]'}`}>
      <Icon size={16} /> {label}
    </span>
  )
}

function Footer() {
  return (
    <footer className="bg-white py-6">
      <div className="mx-auto flex w-[min(1180px,calc(100%-32px))] flex-wrap items-center justify-between gap-3 text-sm font-semibold text-neutral-600">
        <span>TerpHealth Copilot | Go Terps</span>
        <span>{disclaimer}</span>
      </div>
    </footer>
  )
}

export default App
