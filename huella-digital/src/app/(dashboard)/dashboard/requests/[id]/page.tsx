import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { formatDate, formatDateTime, daysRemaining } from '@/lib/utils'
import { RequestActions } from '@/components/gdpr/request-actions'
import { ArrowLeft, Clock, Copy, Download, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import type { GdprRequestStatus, GdprRequestType } from '@/types'

const statusConfig: Record<GdprRequestStatus, { label: string; color: string }> = {
  draft: { label: 'Borrador', color: 'bg-gray-500' },
  ready: { label: 'Lista para enviar', color: 'bg-blue-500' },
  sent: { label: 'Enviada', color: 'bg-purple-500' },
  acknowledged: { label: 'Recibida', color: 'bg-cyan-500' },
  completed: { label: 'Completada', color: 'bg-green-500' },
  rejected: { label: 'Rechazada', color: 'bg-red-500' },
  escalated: { label: 'Escalada', color: 'bg-orange-500' },
}

const typeLabels: Record<GdprRequestType, string> = {
  erasure: 'Solicitud de eliminacion (Art. 17)',
  access: 'Solicitud de acceso (Art. 15)',
  rectification: 'Solicitud de rectificacion (Art. 16)',
  portability: 'Solicitud de portabilidad (Art. 20)',
}

export default async function RequestDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: request } = await supabase
    .from('gdpr_requests')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', user?.id)
    .single()

  if (!request) {
    notFound()
  }

  const status = statusConfig[request.status as GdprRequestStatus]
  const deadline = request.sent_at 
    ? new Date(new Date(request.sent_at).getTime() + 30 * 24 * 60 * 60 * 1000)
    : null
  const days = deadline ? daysRemaining(deadline) : null

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/requests">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{request.target_entity}</h1>
          <p className="text-muted-foreground">
            {typeLabels[request.request_type as GdprRequestType]}
          </p>
        </div>
      </div>

      {/* Status Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Estado de la solicitud</CardTitle>
            <Badge className={`${status.color} text-white`}>
              {status.label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Timeline */}
          <div className="flex items-center gap-2 text-sm">
            <div className={`w-3 h-3 rounded-full ${request.created_at ? 'bg-green-500' : 'bg-gray-300'}`} />
            <span className="flex-1">Creada</span>
            <span className="text-muted-foreground">{formatDateTime(request.created_at)}</span>
          </div>
          {request.sent_at && (
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="flex-1">Enviada</span>
              <span className="text-muted-foreground">{formatDateTime(request.sent_at)}</span>
            </div>
          )}
          {request.acknowledged_at && (
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="flex-1">Acuse de recibo</span>
              <span className="text-muted-foreground">{formatDateTime(request.acknowledged_at)}</span>
            </div>
          )}
          {request.response_at && (
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="flex-1">Respuesta recibida</span>
              <span className="text-muted-foreground">{formatDateTime(request.response_at)}</span>
            </div>
          )}
          {deadline && request.status === 'sent' && (
            <div className="flex items-center gap-2 text-sm">
              <div className={`w-3 h-3 rounded-full ${days && days <= 0 ? 'bg-red-500' : 'bg-gray-300'}`} />
              <span className="flex-1">Plazo legal (30 dias)</span>
              <Badge variant={days && days <= 7 ? 'destructive' : 'secondary'}>
                <Clock className="mr-1 h-3 w-3" />
                {days && days > 0 ? `${days} dias restantes` : 'Plazo vencido'}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Request Details */}
      <Card>
        <CardHeader>
          <CardTitle>Detalles de la solicitud</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Destinatario</p>
              <p className="font-medium">{request.target_entity}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email de contacto</p>
              <p className="font-medium">{request.target_email || 'No especificado'}</p>
            </div>
          </div>

          <Separator />

          <div>
            <p className="text-sm text-muted-foreground mb-2">Asunto</p>
            <p className="font-medium">{request.subject}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-2">Contenido</p>
            <div className="bg-muted/50 rounded-lg p-4 max-h-96 overflow-y-auto">
              <pre className="text-sm whitespace-pre-wrap font-sans">{request.body}</pre>
            </div>
          </div>

          {request.response_summary && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">Resumen de respuesta</p>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm">{request.response_summary}</p>
              </div>
            </div>
          )}

          {request.notes && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">Notas</p>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm">{request.notes}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <RequestActions request={request} />
    </div>
  )
}
