import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import { getCopilotAnswer, hasAnthropicKey } from './copilotCore.js'

const app = express()
const port = process.env.PORT || 3001

app.use(cors())
app.use(express.json({ limit: '2mb' }))

app.get('/api/health', (_request, response) => {
  response.json({ ok: true, ai: hasAnthropicKey() ? 'claude' : 'mock' })
})

app.post('/api/copilot', async (request, response) => {
  const result = await getCopilotAnswer(request.body ?? {})
  response.json(result)
})

app.listen(port, () => {
  console.log(`TerpHealth Copilot API running on http://localhost:${port}`)
})
