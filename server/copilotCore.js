import Anthropic from '@anthropic-ai/sdk'

const mockInsurance = {
  primaryCare: 'low copay',
  specialist: 'higher copay',
  urgentCare: 'moderate copay',
  emergencyRoom: 'high copay / coinsurance',
  mentalHealth: 'covered with copay',
  preventive: 'usually covered',
  prescriptions: 'tiered copay',
  networkRule: 'in-network care is cheaper than out-of-network care',
}

const emergencyTerms = [
  'chest pain',
  'trouble breathing',
  'difficulty breathing',
  'severe bleeding',
  'suicidal',
  'kill myself',
  'stroke',
  'fainted',
  'unconscious',
  'overdose',
]

export function hasAnthropicKey() {
  return Boolean(process.env.ANTHROPIC_API_KEY)
}

export async function getCopilotAnswer({ mode = 'navigator', prompt = '', insuranceText = '' }) {
  if (hasAnthropicKey()) {
    try {
      const answer = await askClaude({ mode, prompt, insuranceText })
      return { mode: 'claude-api', answer }
    } catch (error) {
      console.error('Claude API failed; using mock response.', error)
    }
  }

  return { mode: 'mock-fallback', answer: buildMockAnswer({ mode, prompt }) }
}

async function askClaude({ mode, prompt, insuranceText }) {
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  const message = await anthropic.messages.create({
    model: process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-latest',
    max_tokens: 950,
    temperature: 0.25,
    system: `You are TerpHealth Copilot, a healthcare navigator for University of Maryland students.
You are not a doctor and must not diagnose. Explain insurance and care options in plain English.
Always mention campus/free resources where relevant. Escalate emergency symptoms to 911/ER.
Use this exact response structure:
1. Best option
2. Why
3. Estimated cost
4. Backup options
5. Questions to ask before booking
6. Safety disclaimer

Mock SHIP-like data:
- Primary care visit: ${mockInsurance.primaryCare}
- Specialist visit: ${mockInsurance.specialist}
- Urgent care: ${mockInsurance.urgentCare}
- Emergency room: ${mockInsurance.emergencyRoom}
- Mental health outpatient visit: ${mockInsurance.mentalHealth}
- Preventive care: ${mockInsurance.preventive}
- Prescriptions: ${mockInsurance.prescriptions}
- ${mockInsurance.networkRule}`,
    messages: [
      {
        role: 'user',
        content: `Mode: ${mode}
Student input:
${prompt}

Insurance text:
${insuranceText}`,
      },
    ],
  })

  return message.content
    .filter((part) => part.type === 'text')
    .map((part) => part.text)
    .join('\n')
}

function buildMockAnswer({ mode, prompt }) {
  if (mode === 'insurance') return insuranceDecoderMock()
  if (mode === 'benefits') return benefitsMock()
  return navigatorMock(prompt)
}

function navigatorMock(prompt) {
  const text = prompt.toLowerCase()
  const isEmergency = emergencyTerms.some((term) => text.includes(term))
  const isMentalHealth = /(anxious|anxiety|overwhelmed|burned out|burnout|therapy|depressed|panic|stress)/.test(text)
  const isInjury = /(ankle|twisted|sprain|injury|fell|hurt)/.test(text)
  const isBill = /(bill|charged|claim|deductible|copay|coinsurance|invoice)/.test(text)
  const isRefill = /(refill|prescription|medication|medicine)/.test(text)

  if (isEmergency) {
    return `1. Best option
Call 911 or go to the nearest emergency room now.

2. Why
Your concern includes symptoms or safety language that can require immediate professional care. The app should not route emergency situations to lower-cost options.

3. Estimated cost
ER care is usually the most expensive option under SHIP-like plans because it may include a high copay or coinsurance, but emergencies should be treated first and billed later.

4. Backup options
If you are on campus and it is safe to do so, contact UMD emergency support or a trusted person nearby while you wait for help.

5. Questions to ask before booking
For emergencies, do not delay care to ask billing questions. After you are safe, ask the insurer whether the ER visit was processed as in-network and whether any hospital financial assistance is available.

6. Safety disclaimer
This app is not medical advice. For emergencies call 911 or go to the ER.`
  }

  if (isMentalHealth) {
    return `1. Best option
Start with the UMD Counseling Center or Behavioral Health Services. If you want therapy but are worried about cost, ask specifically about free short-term counseling, groups, workshops, and referrals that accept SHIP-like coverage.

2. Why
For anxiety, burnout, stress, or therapy access, campus mental health resources are usually the lowest-cost and most student-specific first stop. They can also help you decide whether outpatient therapy, group support, or urgent mental health support is the right fit.

3. Estimated cost
Campus counseling and workshops are often free or low cost. Outpatient mental health visits are typically covered with a copay under SHIP-like plans. Out-of-network therapy can cost much more.

4. Backup options
Use peer/community support or wellness workshops for ongoing stress management. Use telehealth if available for faster access. If you feel unsafe or might hurt yourself, seek crisis support immediately.

5. Questions to ask before booking
Ask: Is this free for students? How many sessions are included? Do you accept SHIP? What is my copay? Can you refer me to an in-network therapist near College Park?

6. Safety disclaimer
This app is not medical advice. For emergencies call 911 or go to the ER.`
  }

  if (isBill) {
    return `1. Best option
Use the Insurance Decoder first, then call the provider billing office and your insurance plan with the bill in front of you.

2. Why
Medical bills often include deductible, copay, coinsurance, out-of-network, or claim-processing issues. You may not owe the full amount until insurance finishes processing the claim.

3. Estimated cost
It depends on whether the visit was in-network and what service was billed. Primary care is usually low copay, urgent care is moderate, and ER care can be high.

4. Backup options
Ask UMD Health Center or campus student services whether there is a billing advocate or student insurance support contact. Ask the provider about financial assistance or a payment plan.

5. Questions to ask before booking
Ask: Was this claim processed by insurance? What CPT codes were billed? Was the provider in-network? Did this apply to deductible, copay, or coinsurance? Can you reprocess the claim?

6. Safety disclaimer
This app is not medical advice. For emergencies call 911 or go to the ER.`
  }

  if (isInjury) {
    return `1. Best option
UMD Health Center is the best first stop if the injury is painful but not severe. Nearby urgent care is the backup if campus care is closed or you need faster imaging access.

2. Why
A twisted ankle or minor injury is often appropriate for student health or urgent care. The ER is usually unnecessary unless there is severe deformity, loss of sensation, uncontrolled pain, or you cannot safely walk.

3. Estimated cost
UMD Health Center is usually low or free depending on service. Urgent care is a moderate copay. ER care is expensive and should be saved for emergencies.

4. Backup options
Use urgent care after hours. Ask whether X-ray or specialist referral is needed. Use ER only for severe symptoms or emergencies.

5. Questions to ask before booking
Ask: Are you in-network? What is the visit copay? Are X-rays billed separately? Can UMD Health Center refer me to an in-network specialist if needed?

6. Safety disclaimer
This app is not medical advice. For emergencies call 911 or go to the ER.`
  }

  if (isRefill) {
    return `1. Best option
Contact UMD Health Center or your current prescribing clinician to ask about a prescription refill.

2. Why
Refills are often cheaper and faster through primary care, campus health, or telehealth than through urgent care. A pharmacy can also explain generic options and tiered copays.

3. Estimated cost
Primary care is usually low copay. Prescriptions use tiered copays, so generic medications are usually cheaper than brand-name options.

4. Backup options
Use telehealth if available. Use urgent care only if you cannot reach a clinician and the medication issue is time-sensitive but not an emergency.

5. Questions to ask before booking
Ask: Is a visit required for this refill? Is there a generic? Is the pharmacy in-network? What tier is this medication on?

6. Safety disclaimer
This app is not medical advice. For emergencies call 911 or go to the ER.`
  }

  return `1. Best option
Start with UMD Health Center for a non-emergency concern like "${prompt || 'a common health concern'}."

2. Why
It is usually the cheapest and most campus-specific first stop. They can treat common issues, advise on prescriptions, and refer you to in-network care if you need a specialist.

3. Estimated cost
UMD Health Center is often low or free depending on service. Urgent care is a moderate copay. ER care can be high copay or coinsurance and should be avoided unless it is truly urgent.

4. Backup options
Use nearby urgent care if campus care is closed or you need faster same-day care. Use a community/free clinic if cost is the main barrier. Use ER only for emergency symptoms.

5. Questions to ask before booking
Ask: Are you in-network? What is my copay? Will labs, tests, or prescriptions cost extra? Is telehealth available? Can you refer me to an in-network specialist if needed?

6. Safety disclaimer
This app is not medical advice. For emergencies call 911 or go to the ER.`
}

function insuranceDecoderMock() {
  return `1. Best option
Use in-network care first, especially UMD Health Center for primary care and student-specific services.

2. Why
In-network providers have negotiated prices with your insurance, so you usually pay less. Out-of-network care can trigger higher bills or may not be covered well.

3. Estimated cost
- Deductible: the amount you may pay before insurance starts sharing costs for some services.
- Primary care: low copay.
- Specialist visit: higher copay.
- Urgent care: moderate copay.
- ER: high copay or coinsurance, so avoid unless it is an emergency.
- Mental health outpatient visit: covered with a copay.
- Prescriptions: tiered copay. Generics are usually cheapest.
- Preventive care: usually covered, especially annual checkups, vaccines, and screenings.

4. Backup options
If you are unsure where to go, call the number on your insurance card, UMD Health Center, or the provider's billing office before the visit.

5. Questions to ask before booking
Ask: Are you in-network for my plan? What is the copay? Will labs or imaging be billed separately? Do I need a referral? Is there a cheaper campus or telehealth option?

6. Safety disclaimer
This app is not medical advice. For emergencies call 911 or go to the ER.`
}

function benefitsMock() {
  return `1. Best option
Check your plan and campus resources for benefits that help before a problem becomes expensive.

2. Why
Students often only look for coverage after they are sick, but SHIP-like plans and campus programs may include lower-cost preventive and wellness services.

3. Estimated cost
Preventive care is usually covered. Vaccines, annual screenings, counseling, telehealth, and generic prescriptions may be low cost compared with urgent care or ER visits.

4. Backup options
Ask UMD Health Center about vaccines, sexual health, nutrition, wellness workshops, and prescription support. Ask Counseling Center about groups and burnout support.

5. Questions to ask before booking
Ask: Is this preventive? Is it covered before deductible? Is there a campus version of this service? Is telehealth cheaper? Is there a generic prescription option?

6. Safety disclaimer
This app is not medical advice. For emergencies call 911 or go to the ER.`
}
