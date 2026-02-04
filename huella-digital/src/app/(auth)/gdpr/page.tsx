'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FileText, Plus, Download, Send, Clock, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'

// Status badge component
function StatusBadge({ status }: { status: string }) {
  const config = {
    draft: { label: 'Borrador', className: 'bg-gray-100 text-gray-800', icon: FileText },
    ready: { label: 'Lista', className: 'bg-blue-100 text-blue-800', icon: FileText },
    sent: { label: 'Enviada', className: 'bg-purple-100 text-purple-800', icon: Send },
    acknowledged: { label: 'Recibida', className: 'bg-cyan-100 text-cyan-800', icon: CheckCircle },
    completed: { label: 'Completada', className: 'bg-green-100 text-green-800', icon: CheckCircle },
    rejected: { label: 'Rechazada', className: 'bg-red-100 text-red-800', icon: AlertCircle },
    escalated: { label: 'Escalada', className: 'bg-orange-100 text-orange-800', icon: AlertCircle },
  }[status] || { label: status, className: '', icon: FileText }

  const Icon = config.icon

  return (
    <Badge variant="outline" className={config.className}>
      <Icon className="h-3 w-3 mr-1" />
      {config.label}
    </Badge>
  )
}

// Mock data for templates
const templates = [
  {
    id: 'template_001',
    type: 'erasure',
    name: 'Solicitud de supresión estándar',
    description: 'Template general para solicitar eliminación de datos personales',
    legalBasis: 'RGPD Artículo 17 - Derecho de supresión',
  },
  {
    id: 'template_002',
    type: 'access',
    name: 'Solicitud de acceso estándar',
    description: 'Template para solicitar acceso a datos personales',
    legalBasis: 'RGPD Artículo 15 - Derecho de acceso',
  },
  {
    id: 'template_003',
    type: 'rectification',
    name: 'Solicitud de rectificación',
    description: 'Template para solicitar corrección de datos incorrectos',
    legalBasis: 'RGPD Artículo 16 - Derecho de rectificación',
  },
]

export default function GdprPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')

  // In real app, this would fetch from API
  const hasRequests = false
  const requests: any[] = []

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Solicitudes GDPR</h1>
          <p className="text-muted-foreground">
            Genera y gestiona solicitudes para ejercer tus derechos de privacidad
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nueva solicitud
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Crear nueva solicitud GDPR</DialogTitle>
              <DialogDescription>
                Selecciona el tipo de solicitud y completa los datos
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Tipo de solicitud</Label>
                <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        <div className="flex flex-col">
                          <span>{template.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedTemplate && (
                  <p className="text-xs text-muted-foreground">
                    {templates.find(t => t.id === selectedTemplate)?.legalBasis}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetEntity">Entidad/Empresa *</Label>
                <Input id="targetEntity" placeholder="Ej: Twitter, Inc." />
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetEmail">Email de contacto (DPO)</Label>
                <Input id="targetEmail" type="email" placeholder="privacy@empresa.com" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción de los datos</Label>
                <Textarea
                  id="description"
                  placeholder="Describe qué datos quieres que eliminen/accedan..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={() => setIsDialogOpen(false)}>
                  Generar solicitud
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Templates overview */}
      <div className="grid gap-4 md:grid-cols-3">
        {templates.map((template) => (
          <Card key={template.id} className="cursor-pointer hover:border-primary transition-colors">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{template.name}</CardTitle>
              <CardDescription className="text-xs">{template.legalBasis}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{template.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Requests list */}
      <Card>
        <CardHeader>
          <CardTitle>Mis solicitudes</CardTitle>
          <CardDescription>
            Historial de solicitudes GDPR generadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {hasRequests ? (
            <div className="space-y-4">
              {requests.map((request: any) => (
                <div
                  key={request.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={request.status} />
                      <span className="text-sm text-muted-foreground">
                        {request.requestType === 'erasure' ? 'Supresión' : 'Acceso'}
                      </span>
                    </div>
                    <p className="font-medium">{request.targetEntity}</p>
                    <p className="text-sm text-muted-foreground">
                      Creada: {new Date(request.createdAt).toLocaleDateString('es')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      PDF
                    </Button>
                    <Button variant="outline" size="sm">
                      Ver detalles
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No tienes solicitudes todavía</h3>
              <p className="text-muted-foreground mb-6">
                Crea tu primera solicitud GDPR para ejercer tus derechos
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Crear solicitud
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info card */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="hidden sm:flex h-10 w-10 rounded-full bg-primary/10 items-center justify-center flex-shrink-0">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">¿Qué son las solicitudes GDPR?</h3>
              <p className="text-sm text-muted-foreground">
                El RGPD (Reglamento General de Protección de Datos) te da derechos sobre tus datos personales.
                Puedes solicitar acceso, rectificación o eliminación de tus datos a cualquier empresa que los procese.
                Las empresas tienen 30 días para responder.
              </p>
              <Link href="/about" className="text-sm text-primary hover:underline inline-flex items-center gap-1 mt-2">
                Más información <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
