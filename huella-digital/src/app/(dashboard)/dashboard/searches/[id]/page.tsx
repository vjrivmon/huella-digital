import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { formatDate, formatDateTime } from '@/lib/utils'
import { ResultCard } from '@/components/search/result-card'
import { ArrowLeft, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import type { SearchStatus, ResultSeverity } from '@/types'

const severityOrder: ResultSeverity[] = ['critical', 'high', 'medium', 'low']

export default async function SearchDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: search } = await supabase
    .from('searches')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', user?.id)
    .single()

  if (!search) {
    notFound()
  }

  const { data: results } = await supabase
    .from('search_results')
    .select('*')
    .eq('search_id', search.id)
    .eq('is_dismissed', false)
    .order('severity', { ascending: true })

  // Sort results by severity order
  const sortedResults = results?.sort((a, b) => {
    return severityOrder.indexOf(a.severity as ResultSeverity) - severityOrder.indexOf(b.severity as ResultSeverity)
  })

  const isProcessing = search.status === 'pending' || search.status === 'processing'
  const severityStats = search.results_by_severity as Record<ResultSeverity, number> || {}

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/searches">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{search.query_name}</h1>
          <p className="text-muted-foreground">
            Busqueda realizada el {formatDateTime(search.created_at)}
          </p>
        </div>
        {isProcessing && (
          <Button variant="outline" disabled>
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            Procesando...
          </Button>
        )}
      </div>

      {/* Search Info */}
      <Card>
        <CardHeader>
          <CardTitle>Informacion de la busqueda</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground">Estado</p>
              <Badge
                variant={
                  search.status === 'completed' ? 'outline' :
                  search.status === 'failed' ? 'destructive' : 'secondary'
                }
              >
                {search.status === 'completed' ? 'Completada' :
                 search.status === 'failed' ? 'Fallida' :
                 search.status === 'processing' ? 'En proceso' : 'Pendiente'}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email buscado</p>
              <p className="font-medium">{search.query_email || 'No especificado'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Usernames</p>
              <p className="font-medium">
                {search.query_usernames && (search.query_usernames as string[]).length > 0
                  ? (search.query_usernames as string[]).map(u => `@${u}`).join(', ')
                  : 'No especificados'}
              </p>
            </div>
          </div>

          {isProcessing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progreso</span>
                <span>Buscando...</span>
              </div>
              <Progress value={33} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Summary */}
      {search.status === 'completed' && (
        <Card>
          <CardHeader>
            <CardTitle>Resumen de resultados</CardTitle>
            <CardDescription>
              {search.total_results} resultados encontrados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                <p className="text-2xl font-bold text-red-500">{severityStats.critical || 0}</p>
                <p className="text-sm text-muted-foreground">Criticos</p>
              </div>
              <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
                <p className="text-2xl font-bold text-orange-500">{severityStats.high || 0}</p>
                <p className="text-sm text-muted-foreground">Altos</p>
              </div>
              <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <p className="text-2xl font-bold text-yellow-500">{severityStats.medium || 0}</p>
                <p className="text-sm text-muted-foreground">Medios</p>
              </div>
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                <p className="text-2xl font-bold text-green-500">{severityStats.low || 0}</p>
                <p className="text-sm text-muted-foreground">Bajos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results List */}
      {sortedResults && sortedResults.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Resultados</h2>
          {sortedResults.map((result) => (
            <ResultCard key={result.id} result={result} />
          ))}
        </div>
      )}

      {search.status === 'completed' && (!sortedResults || sortedResults.length === 0) && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              No se encontraron resultados o todos han sido descartados.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
