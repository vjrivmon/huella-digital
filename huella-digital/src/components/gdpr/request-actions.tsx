'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Copy, Send, CheckCircle, XCircle, AlertTriangle, Loader2 } from 'lucide-react'
import type { GdprRequest, GdprRequestStatus } from '@/types'

interface RequestActionsProps {
  request: GdprRequest
}

export function RequestActions({ request }: RequestActionsProps) {
  const [loading, setLoading] = useState(false)
  const [notes, setNotes] = useState(request.notes || '')
  const [responseSummary, setResponseSummary] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  const updateStatus = async (status: GdprRequestStatus, extraData?: Record<string, unknown>) => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from('gdpr_requests')
        .update({ 
          status,
          ...extraData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', request.id)

      if (error) throw error

      toast({
        title: 'Estado actualizado',
        description: 'El estado de la solicitud ha sido actualizado.',
      })

      router.refresh()
      setDialogOpen(false)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el estado.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCopyEmail = () => {
    const emailContent = `Para: ${request.target_email || '[EMAIL]'}
Asunto: ${request.subject}

${request.body}`
    
    navigator.clipboard.writeText(emailContent)
    toast({
      title: 'Copiado',
      description: 'El contenido ha sido copiado al portapapeles.',
    })
  }

  const handleMarkAsSent = () => {
    const nextReminder = new Date()
    nextReminder.setDate(nextReminder.getDate() + 30)
    
    updateStatus('sent', {
      sent_at: new Date().toISOString(),
      sent_method: 'email',
      next_reminder_at: nextReminder.toISOString(),
    })
  }

  const handleMarkAsCompleted = () => {
    updateStatus('completed', {
      response_at: new Date().toISOString(),
      response_summary: responseSummary,
    })
  }

  const handleMarkAsRejected = () => {
    updateStatus('rejected', {
      response_at: new Date().toISOString(),
      response_summary: responseSummary,
    })
  }

  const handleEscalate = () => {
    updateStatus('escalated', {
      escalated_to: 'aepd',
      escalated_at: new Date().toISOString(),
    })
  }

  const handleSaveNotes = async () => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from('gdpr_requests')
        .update({ notes, updated_at: new Date().toISOString() })
        .eq('id', request.id)

      if (error) throw error

      toast({
        title: 'Notas guardadas',
        description: 'Las notas han sido guardadas.',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudieron guardar las notas.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Acciones</CardTitle>
        <CardDescription>
          Gestiona el estado de tu solicitud.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Copy/Send Actions */}
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handleCopyEmail}>
            <Copy className="mr-2 h-4 w-4" />
            Copiar contenido
          </Button>

          {request.status === 'ready' && (
            <Button onClick={handleMarkAsSent}>
              <Send className="mr-2 h-4 w-4" />
              Marcar como enviada
            </Button>
          )}

          {request.status === 'sent' && (
            <>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Marcar respuesta
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Registrar respuesta</DialogTitle>
                    <DialogDescription>
                      Indica el resultado de tu solicitud.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Resumen de la respuesta</Label>
                      <Textarea
                        placeholder="Describe brevemente la respuesta recibida..."
                        value={responseSummary}
                        onChange={(e) => setResponseSummary(e.target.value)}
                        rows={4}
                      />
                    </div>
                  </div>
                  <DialogFooter className="flex-col sm:flex-row gap-2">
                    <Button
                      variant="outline"
                      onClick={handleMarkAsRejected}
                      disabled={loading}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Rechazada
                    </Button>
                    <Button
                      onClick={handleMarkAsCompleted}
                      disabled={loading}
                    >
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Completada
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Button variant="destructive" onClick={handleEscalate}>
                <AlertTriangle className="mr-2 h-4 w-4" />
                Escalar a AEPD
              </Button>
            </>
          )}
        </div>

        {/* Notes */}
        <div className="space-y-2 pt-4 border-t">
          <Label>Notas personales</Label>
          <Textarea
            placeholder="Anade notas sobre esta solicitud..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
          <Button variant="outline" size="sm" onClick={handleSaveNotes} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Guardar notas
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
