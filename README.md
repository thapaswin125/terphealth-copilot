<<<<<<< HEAD
# TerpHealth Copilot

TurboTax + Google Maps for UMD student healthcare.

TerpHealth Copilot is a hackathon MVP for University of Maryland College Park students. It helps students choose where to go for care, understand UMD SHIP/Aetna-style cost estimates, find campus and nearby resources, and avoid surprise bills.

## Current Product Focus

- Built for UMD students using UMD SHIP/Aetna 2025-2026 benefit estimates.
- No insurance upload or PDF parsing.
- Hardcoded care navigation logic works without an AI API.
- Sample scenario cards auto-fill the navigator, scroll to the answer, show loading, and render a structured recommendation.

## Features

- UMD-branded hero, emergency banner, sticky navigation, and Go Terps microcopy.
- Clickable sample scenarios:
  - I have a sore throat
  - I twisted my ankle
  - I feel burned out
  - I need therapy but I'm worried about cost
  - I need a prescription refill
  - I got a medical bill
  - I need STI testing
  - I need urgent care after hours
- AI Care Navigator-style response card:
  - Best first stop
  - Estimated cost with UMD SHIP
  - Why
  - Cheaper alternative / backup
  - Red flags / when to escalate
  - Questions to ask before booking
  - Safety disclaimer
- UMD SHIP cost cheat sheet.
- Resource directory filtered by Campus, Mental Health, Urgent Care, Low Cost, and Emergency.
- Hidden benefits section.
- Judge demo script modal.

## Setup

```bash
npm install
npm run dev
```

Open:

```bash
http://localhost:5173
```

## Deploy

```bash
npm run build
npx vercel --prod --yes
```

## Disclaimer

This is not medical advice or a final insurance quote. For emergencies call 911. For mental health crisis call/text 988 or UMD Counseling Center 301-314-7651.
=======
# terphealth-copilot
>>>>>>> 0538ce9fcbd7572edd5072f711e90eb6026789a4
