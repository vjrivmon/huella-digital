import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SearchForm } from '@/components/search/search-form'
import { RecentSearches } from '@/components/search/recent-searches'
import { Search, FileText, AlertTriangle, Clock } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Get user profile
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user?.id)
    .single()

  // Get stats
  const { count: searchCount } = await supabase
    .from('searches')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user?.id)

  const { count: pendingResults } = await supabase
    .from('search_results')
    .select('*, searches!inner(*)', { count: 'exact', head: true })
    .eq('searches.user_id', user?.id)
    .eq('is_dismissed', false)

  const { count: activeRequests } = await supabase
    .from('gdpr_requests')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user?.id)
    .in('status', ['sent', 'acknowledged'])

  const displayName = profile?.full_name || user?.user_metadata?.full_name || 'Usuario'
  const searchesLimit = profile?.plan === 'pro' ? 30 : profile?.plan === 'enterprise' ? 999 : 3
  const searchesToday = profile?.searches_today || 0

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Hola, {displayName.split(' ')[0]}
        </h1>
        <p className="text-muted-foreground">
          Gestiona tu presencia en internet desde aqui.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Busquedas hoy</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{searchesToday}</div>
            <p className="text-xs text-muted-foreground">
              de {searchesLimit} permitidas
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resultados pendientes</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingResults || 0}</div>
            <p className="text-xs text-muted-foreground">
              sin revisar
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Solicitudes activas</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeRequests || 0}</div>
            <p className="text-xs text-muted-foreground">
              esperando respuesta
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total busquedas</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{searchCount || 0}</div>
            <p className="text-xs text-muted-foreground">
              en tu cuenta
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search Form */}
      <Card>
        <CardHeader>
          <CardTitle>Nueva busqueda</CardTitle>
          <CardDescription>
            Introduce tus datos para buscar tu huella digital en internet.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SearchForm 
            defaultName={displayName}
            defaultEmail={user?.email || ''}
            remainingSearches={searchesLimit - searchesToday}
          />
        </CardContent>
      </Card>

      {/* Recent Searches */}
      <Card>
        <CardHeader>
          <CardTitle>Busquedas recientes</CardTitle>
          <CardDescription>
            Tus ultimas busquedas de huella digital.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RecentSearches />
        </CardContent>
      </Card>
    </div>
  )
}
