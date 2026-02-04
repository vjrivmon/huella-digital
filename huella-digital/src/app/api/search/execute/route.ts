import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Use service role for background operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { searchId } = await req.json()

    if (!searchId) {
      return NextResponse.json({ error: 'Search ID required' }, { status: 400 })
    }

    // Get search details
    const { data: search, error: searchError } = await supabase
      .from('searches')
      .select('*')
      .eq('id', searchId)
      .single()

    if (searchError || !search) {
      return NextResponse.json({ error: 'Search not found' }, { status: 404 })
    }

    // Update status to processing
    await supabase
      .from('searches')
      .update({ 
        status: 'processing',
        started_at: new Date().toISOString(),
        sources_queried: ['google', 'hibp', 'username'],
      })
      .eq('id', searchId)

    const results: Array<{
      search_id: string
      source: string
      source_query: string
      url: string | null
      title: string
      snippet: string | null
      category: string
      severity: string
      confidence_score: number
      breach_name?: string
      breach_date?: string
      breach_data_classes?: string[]
      metadata: Record<string, unknown>
    }> = []

    // 1. Search Have I Been Pwned (if email provided)
    if (search.query_email) {
      try {
        const hibpResults = await searchHIBP(search.query_email)
        results.push(...hibpResults.map(r => ({
          ...r,
          search_id: searchId,
        })))
      } catch (error) {
        console.error('HIBP error:', error)
      }
    }

    // 2. Username enumeration (simulated for MVP)
    if (search.query_usernames && search.query_usernames.length > 0) {
      for (const username of search.query_usernames) {
        const usernameResults = await searchUsernames(username)
        results.push(...usernameResults.map(r => ({
          ...r,
          search_id: searchId,
        })))
      }
    }

    // 3. Google Custom Search (if API key configured)
    if (process.env.GOOGLE_SEARCH_API_KEY && process.env.GOOGLE_SEARCH_ENGINE_ID) {
      try {
        const googleResults = await searchGoogle(search.query_name, search.query_email)
        results.push(...googleResults.map(r => ({
          ...r,
          search_id: searchId,
        })))
      } catch (error) {
        console.error('Google Search error:', error)
      }
    } else {
      // Simulate some results for demo
      results.push({
        search_id: searchId,
        source: 'google',
        source_query: search.query_name,
        url: `https://www.google.com/search?q="${encodeURIComponent(search.query_name)}"`,
        title: `Resultados de busqueda para "${search.query_name}"`,
        snippet: 'Configura la API de Google Custom Search para obtener resultados reales.',
        category: 'other',
        severity: 'low',
        confidence_score: 0.5,
        metadata: { simulated: true },
      })
    }

    // Insert results
    if (results.length > 0) {
      await supabase
        .from('search_results')
        .insert(results)
    }

    // Calculate summary stats
    const resultsByCategory = results.reduce((acc, r) => {
      acc[r.category] = (acc[r.category] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const resultsBySeverity = results.reduce((acc, r) => {
      acc[r.severity] = (acc[r.severity] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Update search as completed
    await supabase
      .from('searches')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        total_results: results.length,
        results_by_category: resultsByCategory,
        results_by_severity: resultsBySeverity,
        sources_completed: ['google', 'hibp', 'username'],
      })
      .eq('id', searchId)

    return NextResponse.json({ 
      success: true, 
      resultsCount: results.length 
    })
  } catch (error) {
    console.error('Search execution error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Have I Been Pwned API
async function searchHIBP(email: string) {
  const results = []
  
  try {
    // Note: HIBP requires an API key for the breaches endpoint
    // For MVP, we'll check if the API key is configured
    const apiKey = process.env.HIBP_API_KEY
    
    if (!apiKey) {
      // Simulate a breach result for demo purposes
      return [{
        source: 'hibp',
        source_query: email,
        url: null,
        title: 'Verificacion de filtraciones',
        snippet: 'Configura la API de Have I Been Pwned para verificar si tu email aparece en filtraciones de datos conocidas.',
        category: 'data_breach',
        severity: 'medium',
        confidence_score: 0.5,
        metadata: { simulated: true, email },
      }]
    }

    const response = await fetch(
      `https://haveibeenpwned.com/api/v3/breachedaccount/${encodeURIComponent(email)}?truncateResponse=false`,
      {
        headers: {
          'hibp-api-key': apiKey,
          'user-agent': 'HuellaDigital-App',
        },
      }
    )

    if (response.status === 200) {
      const breaches = await response.json()
      
      for (const breach of breaches) {
        results.push({
          source: 'hibp',
          source_query: email,
          url: null,
          title: `Data Breach: ${breach.Name}`,
          snippet: breach.Description?.substring(0, 200) || `Tu email fue encontrado en la filtracion de ${breach.Name}.`,
          category: 'data_breach',
          severity: breach.IsVerified && breach.IsSensitive ? 'critical' : breach.IsVerified ? 'high' : 'medium',
          confidence_score: 1.0,
          breach_name: breach.Name,
          breach_date: breach.BreachDate,
          breach_data_classes: breach.DataClasses,
          metadata: {
            domain: breach.Domain,
            pwnCount: breach.PwnCount,
            isVerified: breach.IsVerified,
            isSensitive: breach.IsSensitive,
          },
        })
      }
    }
  } catch (error) {
    console.error('HIBP API error:', error)
  }

  return results
}

// Username enumeration (simplified)
async function searchUsernames(username: string) {
  const results = []
  
  // List of platforms to check
  const platforms = [
    { name: 'GitHub', url: `https://github.com/${username}`, category: 'professional' },
    { name: 'Twitter/X', url: `https://twitter.com/${username}`, category: 'social_media' },
    { name: 'Instagram', url: `https://instagram.com/${username}`, category: 'social_media' },
    { name: 'LinkedIn', url: `https://linkedin.com/in/${username}`, category: 'professional' },
    { name: 'Reddit', url: `https://reddit.com/user/${username}`, category: 'forum' },
  ]

  for (const platform of platforms) {
    // For MVP, we just add these as potential matches
    // In production, you'd actually check if the profile exists
    results.push({
      source: 'username',
      source_query: username,
      url: platform.url,
      title: `${platform.name}: @${username}`,
      snippet: `Posible perfil encontrado en ${platform.name}. Verifica si es tuyo.`,
      category: platform.category,
      severity: 'medium',
      confidence_score: 0.6,
      metadata: { platform: platform.name, username },
    })
  }

  return results
}

// Google Custom Search API
async function searchGoogle(name: string, email?: string | null) {
  const results = []
  
  const apiKey = process.env.GOOGLE_SEARCH_API_KEY
  const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID
  
  if (!apiKey || !searchEngineId) {
    return results
  }

  const queries = [`"${name}"`]
  if (email) {
    queries.push(`"${email}"`)
  }

  for (const query of queries) {
    try {
      const response = await fetch(
        `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(query)}&num=5`
      )

      if (response.ok) {
        const data = await response.json()
        
        if (data.items) {
          for (const item of data.items) {
            // Determine category and severity based on URL/content
            let category = 'other'
            let severity = 'low'

            const url = item.link.toLowerCase()
            if (url.includes('twitter') || url.includes('facebook') || url.includes('instagram')) {
              category = 'social_media'
              severity = 'medium'
            } else if (url.includes('linkedin')) {
              category = 'professional'
              severity = 'low'
            } else if (url.includes('forum') || url.includes('reddit')) {
              category = 'forum'
              severity = 'medium'
            }

            results.push({
              source: 'google',
              source_query: query,
              url: item.link,
              title: item.title,
              snippet: item.snippet,
              category,
              severity,
              confidence_score: 0.7,
              metadata: { displayLink: item.displayLink },
            })
          }
        }
      }
    } catch (error) {
      console.error('Google Search error for query:', query, error)
    }
  }

  return results
}
