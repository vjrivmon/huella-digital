import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate, daysRemaining } from '@/lib/utils'
import { ArrowRight, FileText, Clock, CheckCircle, XCircle, Send, AlertTriangle } from 'lucide-react'
import type { GdprRequestStatus } from '@/types'

const statusConfig: Record<GdprRequestStatus, { label: string; icon: typeof Clock; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  draft: { label: 'Borrador', icon: FileText, variant: 'secondary' },
  ready: { label: 'Lista', icon: CheckCircle, variant: 'default' },
  sent: { label: 'Enviada', icon: Send, variant: 'default' },
  acknowledged: { label: 'Recibida', icon: CheckCircle, variant: 'default' },
  completed: { label: 'Completada', icon: CheckCircle, variant: 'outline' },
  rejected: { label: 'Rechazada', icon: XCircle, variant: 'destructive' },
  escalated: { label: 'Escalada', icon: AlertTriangle, variant: 'destructive' },
}

export default async function RequestsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: requests } = await supabase
    .from('gdpr_requests')
    .select('*')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false })

  // Count by status
  const statusCounts = requests?.reduce((acc, req) => {
    acc[req.status as GdprRequestStatus] = (acc[req.status as GdprRequestStatus] || 0) + 1
    return acc
  }, {} as Record<GdprRequestStatus, number>) || {}

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Solicitudes GDPR</h1>
          <p className="text-muted-foreground">
            Gestiona tus solicitudes de eliminacion de datos.
          </p>
        </div>
        <Link href="/dashboard/requests/new">
          <Button>
            <FileText className="mr-2 h-4 w-4" />
            Nueva solicitud
          </Button>
        </Link>
      </div>

      {/* Status Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{statusCounts.draft || 0}</div>
            <p className="text-sm text-muted-foreground">Borradores</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{statusCounts.sent || 0}</div>
            <p className="text-sm text-muted-foreground">Enviadas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{statusCounts.completed || 0}</div>
            <p className="text-sm text-muted-foreground">Completadas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {(statusCounts.rejected || 0) + (statusCounts.escalated || 0)}
            </div>
            <p className="text-sm text-muted-foreground">Rechazadas/Escaladas</p>
          </CardContent>
        </Card>
      </div>

      {!requests || requests.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Sin solicitudes</h3>
            <p className="text-muted-foreground mb-4">
              Aun no has creado ninguna solicitud GDPR.
            </p>
            <Link href="/dashboard/requests/new">
              <Button>Crear mi primera solicitud</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => {
            const config = statusConfig[request.status as GdprRequestStatus]
            const StatusIcon = config.icon
            const deadline = request.sent_at 
              ? new Date(new Date(request.sent_at).getTime() + 30 * 24 * 60 * 60 * 1000)
              : null
            const days = deadline ? daysRemaining(deadline) : null
            
            return (
              <Card key={request.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{request.target_entity}</CardTitle>
                    <Badge variant={config.variant} className="gap-1">
                      <StatusIcon className="h-3 w-3" />
                      {config.label}
                    </Badge>
                  </div>
                  <CardDescription>
                    {request.request_type === 'erasure' ? 'Solicitud de eliminacion' :
                     request.request_type === 'access' ? 'Solicitud de acceso' :
                     request.request_type === 'rectification' ? 'Solicitud de rectificacion' :
                     'Solicitud de portabilidad'}
                    {' - '}{formatDate(request.created_at)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {request.target_email && (
                        <span>Email: {request.target_email}</span>
                      )}
                      {request.status === 'sent' && days !== null && (
                        <Badge variant={days <= 7 ? 'destructive' : days <= 14 ? 'high' : 'secondary'}>
                          <Clock className="mr-1 h-3 w-3" />
                          {days > 0 ? `${days} dias restantes` : 'Plazo vencido'}
                        </Badge>
                      )}
                    </div>
                    <Link href={`/dashboard/requests/${request.id}`}>
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
