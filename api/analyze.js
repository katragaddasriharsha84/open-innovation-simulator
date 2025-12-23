export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )
  
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  const { method } = req

  if (method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { prompt } = req.body

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' })
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY
    if (!GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not configured')
      return res.status(500).json({ error: 'API key not configured' })
    }

    // Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Gemini API Error Response:', errorData, 'Status:', response.status)
      return res.status(response.status).json({ 
        error: errorData.error?.message || errorData.message || `API Error: ${response.status}`,
        details: errorData 
      })
    }

    const data = await response.json()
    console.log('Gemini Response received:', { hasData: !!data, hasCandidates: !!data?.candidates })
    
    // Detailed validation of response structure
    if (!data || !data.candidates) {
      console.error('No candidates in response:', data)
      return res.status(500).json({ 
        error: 'Invalid response from Gemini API - no candidates',
        details: data 
      })
    }

    if (!Array.isArray(data.candidates) || data.candidates.length === 0) {
      console.error('Candidates array is empty or invalid', data.candidates)
      return res.status(500).json({ 
        error: 'No candidates returned from Gemini API',
        details: { candidatesLength: data.candidates?.length }
      })
    }

    const candidate = data.candidates[0]
    if (!candidate || !candidate.content) {
      console.error('Candidate missing content:', candidate)
      return res.status(500).json({ 
        error: 'Candidate missing content field',
        details: { candidate }
      })
    }

    if (!candidate.content.parts || !Array.isArray(candidate.content.parts) || candidate.content.parts.length === 0) {
      console.error('Parts array invalid:', candidate.content.parts)
      return res.status(500).json({ 
        error: 'Parts array is invalid or empty',
        details: { parts: candidate.content.parts }
      })
    }

    const part = candidate.content.parts[0]
    if (!part || !part.text) {
      console.error('Part missing text:', part)
      return res.status(500).json({ 
        error: 'Response part is missing text field',
        details: { part }
      })
    }

    const responseText = part.text
    return res.status(200).json({ response: responseText })
    
  } catch (error) {
    console.error('Error calling Gemini API:', error.message, error.stack)
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    })
  }
}
