'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, ExternalLink, FileText, X, AlertTriangle, AlertCircle, Info } from 'lucide-react'
import Link from 'next/link'

// Severity badge component
function SeverityBadge({ severity }: { severity: string }) {
  const config = {
    critical: { label: 'Crítica', className: 'bg-red-500 text-white' },
    high: { label: 'Alta', className: 'bg-orange-500 text-white' },
    medium: { label: 'Media', className: 'bg-yellow-500 text-white' },
    low: { label: 'Baja', className: 'bg-green-500 text-white' },
  }[severity] || { label: severity, className: '' }

  return <Badge className={config.className}>{config.label}</Badge>
}

// Category badge component
function CategoryBadge({ category }: { category: string }) {
  const config = {
    social_media: { label: 'Red Social', className: 'bg-blue-100 text-blue-800' },
    data_breach: { label: 'Filtración', className: 'bg-red-100 text-red-800' },
    forum: { label: 'Foro', className: 'bg-purple-100 text-purple-800' },
    news: { label: 'Noticia', className: 'bg-cyan-100 text-cyan-800' },
    professional: { label: 'Profesional', className: 'bg-emerald-100 text-emerald-800' },
    other: { label: 'Otro', className: 'bg-gray-100 text-gray-800' },
  }[category] || { label: category, className: '' }

  return <Badge variant="outline" className={config.className}>{config.label}</Badge>
}

// Mock data for demonstration
const mockResults = [
  {
    id: '1',
    source: 'hibp',
    title: 'Data Breach: LinkedIn (2021)',
    snippet: 'Tu email fue encontrado en la filtración de datos de LinkedIn. Datos expuestos: emails, contraseñas, nombres.',
    url: null,
    category: 'data_breach',
    severity: 'critical',
    breachDate: '2021-06-22',
  },
  {
    id: '2',
    source: 'google',
    title: 'Twitter: @juangarcia',
    snippet: 'Juan García (@juangarcia). 150 seguidores. Ingeniero de software. Madrid, España...',
    url: 'https://twitter.com/juangarcia',
    category: 'social_media',
    severity: 'high',
  },
  {
    id: '3',
    source: 'google',
    title: 'GitHub: juangarcia',
    snippet: 'juangarcia has 12 repositories. Contributions in the last year: 234...',
    url: 'https://github.com/juangarcia',
    category: 'professional',
    severity: 'medium',
  },
]

export default function ResultsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // In real app, this would fetch from API
  const hasResults = false // Set to true to show mock results
  const results = hasResults ? mockResults : []

  const filteredResults = results.filter((result) => {
    if (selectedCategory !== 'all' && result.category !== selectedCategory) return false
    if (selectedSeverity !== 'all' && result.severity !== selectedSeverity) return false
    if (searchQuery && !result.title.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  // Summary counts
  const severityCounts = results.reduce((acc, r) => {
    acc[r.severity] = (acc[r.severity] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Mis búsquedas</h1>
        <p className="text-muted-foreground">
          Resultados de tus búsquedas de huella digital
        </p>
      </div>

      {hasResults ? (
        <>
          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Resumen por severidad</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-red-500" />
                  <span>Crítica: {severityCounts.critical || 0}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-orange-500" />
                  <span>Alta: {severityCounts.high || 0}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-yellow-500" />
                  <span>Media: {severityCounts.medium || 0}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-green-500" />
                  <span>Baja: {severityCounts.low || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar en resultados..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                <SelectItem value="social_media">Redes sociales</SelectItem>
                <SelectItem value="data_breach">Filtraciones</SelectItem>
                <SelectItem value="forum">Foros</SelectItem>
                <SelectItem value="news">Noticias</SelectItem>
                <SelectItem value="professional">Profesional</SelectItem>
                <SelectItem value="other">Otros</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Severidad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las severidades</SelectItem>
                <SelectItem value="critical">Crítica</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
                <SelectItem value="medium">Media</SelectItem>
                <SelectItem value="low">Baja</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Results list */}
          <div className="space-y-4">
            {filteredResults.map((result) => (
              <Card key={result.id}>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <SeverityBadge severity={result.severity} />
                        <CategoryBadge category={result.category} />
                        <span className="text-xs text-muted-foreground">
                          Fuente: {result.source.toUpperCase()}
                        </span>
                      </div>
                      <h3 className="font-semibold">{result.title}</h3>
                      <p className="text-sm text-muted-foreground">{result.snippet}</p>
                      {result.url && (
                        <a
                          href={result.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                        >
                          {result.url}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <X className="h-4 w-4 mr-1" />
                        Descartar
                      </Button>
                      <Button size="sm">
                        <FileText className="h-4 w-4 mr-1" />
                        Solicitud GDPR
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
            <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No tienes resultados todavía</h3>
            <p className="text-muted-foreground mb-6">
              Realiza una búsqueda para descubrir tu huella digital
            </p>
            <Link href="/dashboard">
              <Button>
                <Search className="h-4 w-4 mr-2" />
                Nueva búsqueda
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
