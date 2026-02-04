'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { ExternalLink, X, FileText, AlertTriangle, Globe, Database, MessageSquare } from 'lucide-react'
import type { SearchResult, ResultCategory, ResultSeverity } from '@/types'

const severityConfig: Record<ResultSeverity, { label: string; variant: 'critical' | 'high' | 'medium' | 'low' }> = {
  critical: { label: 'Critico', variant: 'critical' },
  high: { label: 'Alto', variant: 'high' },
  medium: { label: 'Medio', variant: 'medium' },
  low: { label: 'Bajo', variant: 'low' },
}

const categoryConfig: Record<ResultCategory, { label: string; icon: typeof Globe }> = {
  social_media: { label: 'Red social', icon: Globe },
  data_breach: { label: 'Filtracion', icon: Database },
  forum: { label: 'Foro', icon: MessageSquare },
  news: { label: 'Noticias', icon: Globe },
  professional: { label: 'Profesional', icon: Globe },
  government: { label: 'Gobierno', icon: Globe },
  other: { label: 'Otro', icon: Globe },
}

interface ResultCardProps {
  result: SearchResult
}

export function ResultCard({ result }: ResultCardProps) {
  const [dismissed, setDismissed] = useState(false)
  const { toast } = useToast()
  const supabase = createClient()

  const severity = severityConfig[result.severity]
  const category = categoryConfig[result.category]
  const CategoryIcon = category.icon

  const handleDismiss = async () => {
    try {
      const { error } = await supabase
        .from('search_results')
        .update({ is_dismissed: true, dismissed_at: new Date().toISOString() })
        .eq('id', result.id)

      if (error) throw error

      setDismissed(true)
      toast({
        title: 'Resultado descartado',
        description: 'El resultado ha sido marcado como descartado.',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo descartar el resultado.',
        variant: 'destructive',
      })
    }
  }

  if (dismissed) return null

  return (
    <Card className="relative">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2">
            <Badge variant={severity.variant}>
              <AlertTriangle className="h-3 w-3 mr-1" />
              {severity.label}
            </Badge>
            <Badge variant="outline" className="gap-1">
              <CategoryIcon className="h-3 w-3" />
              {category.label}
            </Badge>
            <Badge variant="secondary">{result.source}</Badge>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleDismiss}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <CardTitle className="text-lg mt-2">{result.title}</CardTitle>
        {result.url && (
          <CardDescription className="truncate">{result.url}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {result.snippet && (
          <p className="text-sm text-muted-foreground mb-4">{result.snippet}</p>
        )}

        {/* Data breach specific info */}
        {result.category === 'data_breach' && result.breach_name && (
          <div className="bg-muted/50 rounded-lg p-4 mb-4">
            <p className="font-medium mb-2">Filtracion: {result.breach_name}</p>
            {result.breach_date && (
              <p className="text-sm text-muted-foreground">
                Fecha: {new Date(result.breach_date).toLocaleDateString('es-ES')}
              </p>
            )}
            {result.breach_data_classes && (result.breach_data_classes as string[]).length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-muted-foreground">Datos expuestos:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {(result.breach_data_classes as string[]).map((dc) => (
                    <Badge key={dc} variant="secondary" className="text-xs">
                      {dc}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center gap-2">
          {result.url && (
            <a href={result.url} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm">
                <ExternalLink className="mr-2 h-4 w-4" />
                Abrir enlace
              </Button>
            </a>
          )}
          <Link href={`/dashboard/requests/new?resultId=${result.id}`}>
            <Button size="sm">
              <FileText className="mr-2 h-4 w-4" />
              Crear solicitud GDPR
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
