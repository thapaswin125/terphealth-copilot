import { getCopilotAnswer } from '../server/copilotCore.js'

export default async function handler(request, response) {
  if (request.method === 'OPTIONS') {
    response.status(204).end()
    return
  }

  if (request.method !== 'POST') {
    response.status(405).json({ error: 'Method not allowed' })
    return
  }

  const result = await getCopilotAnswer(request.body ?? {})
  response.status(200).json(result)
}
