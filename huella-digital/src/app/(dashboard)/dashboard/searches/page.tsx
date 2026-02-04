import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import { ArrowRight, Clock, CheckCircle, XCircle, Loader2, Search } from 'lucide-react'
import type { SearchStatus } from '@/types'

const statusConfig: Record<SearchStatus, { label: string; icon: typeof Clock; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  pending: { label: 'Pendiente', icon: Clock, variant: 'secondary' },
  processing: { label: 'En proceso', icon: Loader2, variant: 'default' },
  completed: { label: 'Completada', icon: CheckCircle, variant: 'outline' },
  failed: { label: 'Fallida', icon: XCircle, variant: 'destructive' },
}

export default async function SearchesPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: searches } = await supabase
    .from('searches')
    .select('*')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mis busquedas</h1>
          <p className="text-muted-foreground">
            Historial de todas tus busquedas de huella digital.
          </p>
        </div>
        <Link href="/dashboard">
          <Button>
            <Search className="mr-2 h-4 w-4" />
            Nueva busqueda
          </Button>
        </Link>
      </div>

      {!searches || searches.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Sin busquedas</h3>
            <p className="text-muted-foreground mb-4">
              Aun no has realizado ninguna busqueda.
            </p>
            <Link href="/dashboard">
              <Button>Hacer mi primera busqueda</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {searches.map((search) => {
            const config = statusConfig[search.status as SearchStatus]
            const StatusIcon = config.icon
            
            return (
              <Card key={search.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{search.query_name}</CardTitle>
                    <Badge variant={config.variant} className="gap-1">
                      <StatusIcon className={`h-3 w-3 ${config.icon === Loader2 ? 'animate-spin' : ''}`} />
                      {config.label}
                    </Badge>
                  </div>
                  <CardDescription>
                    {formatDate(search.created_at)}
                    {search.query_email && ` - ${search.query_email}`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {search.status === 'completed' && (
                        <>
                          <span>{search.total_results} resultados</span>
                          {search.results_by_severity && (
                            <>
                              {(search.results_by_severity as Record<string, number>).critical > 0 && (
                                <Badge variant="critical">
                                  {(search.results_by_severity as Record<string, number>).critical} criticos
                                </Badge>
                              )}
                              {(search.results_by_severity as Record<string, number>).high > 0 && (
                                <Badge variant="high">
                                  {(search.results_by_severity as Record<string, number>).high} altos
                                </Badge>
                              )}
                            </>
                          )}
                        </>
                      )}
                      {search.query_usernames && search.query_usernames.length > 0 && (
                        <span>
                          Usernames: {(search.query_usernames as string[]).map(u => `@${u}`).join(', ')}
                        </span>
                      )}
                    </div>
                    <Link href={`/dashboard/searches/${search.id}`}>
                      <Button variant="ghost" size="sm">
                        Ver detalles
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
