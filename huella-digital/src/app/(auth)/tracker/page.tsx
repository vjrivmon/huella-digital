'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ClipboardList, Clock, CheckCircle, AlertCircle, Send, FileText, ExternalLink, Calendar } from 'lucide-react'
import Link from 'next/link'

// Status config
const statusConfig = {
  draft: { label: 'Borrador', color: 'bg-gray-500', textColor: 'text-gray-700' },
  ready: { label: 'Lista', color: 'bg-blue-500', textColor: 'text-blue-700' },
  sent: { label: 'Enviada', color: 'bg-purple-500', textColor: 'text-purple-700' },
  acknowledged: { label: 'Recibida', color: 'bg-cyan-500', textColor: 'text-cyan-700' },
  completed: { label: 'Completada', color: 'bg-green-500', textColor: 'text-green-700' },
  rejected: { label: 'Rechazada', color: 'bg-red-500', textColor: 'text-red-700' },
  escalated: { label: 'Escalada', color: 'bg-orange-500', textColor: 'text-orange-700' },
}

// Mock data
const mockRequests = [
  {
    id: '1',
    targetEntity: 'Twitter, Inc.',
    requestType: 'erasure',
    status: 'sent',
    sentAt: '2026-02-04T12:00:00Z',
    daysRemaining: 26,
    createdAt: '2026-02-04T10:30:00Z',
  },
  {
    id: '2',
    targetEntity: 'LinkedIn',
    requestType: 'erasure',
    status: 'sent',
    sentAt: '2026-02-01T12:00:00Z',
    daysRemaining: 23,
    createdAt: '2026-02-01T09:00:00Z',
  },
  {
    id: '3',
    targetEntity: 'Google',
    requestType: 'access',
    status: 'completed',
    sentAt: '2026-01-15T12:00:00Z',
    completedAt: '2026-01-28T14:00:00Z',
    createdAt: '2026-01-15T10:00:00Z',
  },
]

// Timeline component
function RequestTimeline({ status }: { status: string }) {
  const steps = ['draft', 'ready', 'sent', 'acknowledged', 'completed']
  const currentIndex = steps.indexOf(status)

  return (
    <div className="flex items-center gap-1 w-full max-w-xs">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center flex-1">
          <div
            className={`w-3 h-3 rounded-full ${
              index <= currentIndex
                ? statusConfig[status as keyof typeof statusConfig]?.color || 'bg-gray-300'
                : 'bg-gray-200'
            }`}
          />
          {index < steps.length - 1 && (
            <div
              className={`flex-1 h-0.5 ${
                index < currentIndex ? statusConfig[status as keyof typeof statusConfig]?.color || 'bg-gray-300' : 'bg-gray-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )
}

export default function TrackerPage() {
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // In real app, this would fetch from API
  const hasRequests = false // Set to true to show mock data
  const requests = hasRequests ? mockRequests : []

  const filteredRequests = statusFilter === 'all'
    ? requests
    : requests.filter(r => r.status === statusFilter)

  // Summary counts
  const statusCounts = requests.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Tracker de solicitudes</h1>
        <p className="text-muted-foreground">
          Haz seguimiento del estado de tus solicitudes GDPR
        </p>
      </div>

      {hasRequests ? (
        <>
          {/* Summary cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">{statusCounts.draft || 0}</p>
                    <p className="text-sm text-muted-foreground">Borradores</p>
                  </div>
                  <FileText className="h-8 w-8 text-gray-400" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">{statusCounts.sent || 0}</p>
                    <p className="text-sm text-muted-foreground">Enviadas</p>
                  </div>
                  <Send className="h-8 w-8 text-purple-400" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">{statusCounts.completed || 0}</p>
                    <p className="text-sm text-muted-foreground">Completadas</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-400" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">
                      {(statusCounts.rejected || 0) + (statusCounts.escalated || 0)}
                    </p>
                    <p className="text-sm text-muted-foreground">Requieren acción</p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-orange-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filter */}
          <div className="flex justify-between items-center">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="draft">Borrador</SelectItem>
                <SelectItem value="ready">Lista</SelectItem>
                <SelectItem value="sent">Enviada</SelectItem>
                <SelectItem value="acknowledged">Recibida</SelectItem>
                <SelectItem value="completed">Completada</SelectItem>
                <SelectItem value="rejected">Rechazada</SelectItem>
                <SelectItem value="escalated">Escalada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Requests list */}
          <div className="space-y-4">
            {filteredRequests.map((request) => (
              <Card key={request.id}>
                <CardContent className="p-4">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={statusConfig[request.status as keyof typeof statusConfig]?.textColor}
                        >
                          {statusConfig[request.status as keyof typeof statusConfig]?.label}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {request.requestType === 'erasure' ? 'Supresión' : 'Acceso'}
                        </span>
                      </div>
                      <h3 className="font-semibold text-lg">{request.targetEntity}</h3>
                      <RequestTimeline status={request.status} />
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Creada: {new Date(request.createdAt).toLocaleDateString('es')}
                        </span>
                        {request.sentAt && (
                          <span className="flex items-center gap-1">
                            <Send className="h-4 w-4" />
                            Enviada: {new Date(request.sentAt).toLocaleDateString('es')}
                          </span>
                        )}
                        {request.daysRemaining && request.status === 'sent' && (
                          <span className="flex items-center gap-1 text-orange-600">
                            <Clock className="h-4 w-4" />
                            {request.daysRemaining} días restantes
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {request.status === 'sent' && (
                        <Button variant="outline" size="sm">
                          Marcar respondida
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        Ver detalles
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      ) : (
        /* Empty state */
        <Card>
          <CardContent className="py-16 text-center">
            <ClipboardList className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No tienes solicitudes para rastrear</h3>
            <p className="text-muted-foreground mb-6">
              Crea y envía solicitudes GDPR para hacer seguimiento aquí
            </p>
            <Link href="/gdpr">
              <Button>
                <FileText className="h-4 w-4 mr-2" />
                Ir a solicitudes GDPR
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Info about deadlines */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="hidden sm:flex h-10 w-10 rounded-full bg-primary/10 items-center justify-center flex-shrink-0">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Plazos legales</h3>
              <p className="text-sm text-muted-foreground">
                Según el RGPD, las empresas tienen <strong>30 días</strong> para responder a tu solicitud.
                Si no responden o rechazas su respuesta, puedes escalar a la autoridad de protección de datos
                de tu país (AEPD en España).
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
