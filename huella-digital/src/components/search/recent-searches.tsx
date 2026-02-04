import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import { ArrowRight, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import type { SearchStatus } from '@/types'

const statusConfig: Record<SearchStatus, { label: string; icon: typeof Clock; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  pending: { label: 'Pendiente', icon: Clock, variant: 'secondary' },
  processing: { label: 'En proceso', icon: Loader2, variant: 'default' },
  completed: { label: 'Completada', icon: CheckCircle, variant: 'outline' },
  failed: { label: 'Fallida', icon: XCircle, variant: 'destructive' },
}

export async function RecentSearches() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data: searches } = await supabase
    .from('searches')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  if (!searches || searches.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Aun no has realizado ninguna busqueda.</p>
        <p className="text-sm mt-1">Usa el formulario de arriba para empezar.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {searches.map((search) => {
        const config = statusConfig[search.status as SearchStatus]
        const StatusIcon = config.icon
        
        return (
          <Link
            key={search.id}
            href={`/dashboard/searches/${search.id}`}
            className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div>
                <p className="font-medium">{search.query_name}</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(search.created_at)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {search.status === 'completed' && (
                <span className="text-sm text-muted-foreground">
                  {search.total_results} resultado{search.total_results !== 1 ? 's' : ''}
                </span>
              )}
              <Badge variant={config.variant} className="gap-1">
                <StatusIcon className={`h-3 w-3 ${config.icon === Loader2 ? 'animate-spin' : ''}`} />
                {config.label}
              </Badge>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </Link>
        )
      })}
      
      <div className="pt-2">
        <Link href="/dashboard/searches">
          <Button variant="ghost" className="w-full">
            Ver todas las busquedas
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
