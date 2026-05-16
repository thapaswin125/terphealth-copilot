import { hasAnthropicKey } from '../server/copilotCore.js'

export default function handler(_request, response) {
  response.status(200).json({ ok: true, ai: hasAnthropicKey() ? 'claude' : 'mock' })
}
