'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Search, FileText, AlertTriangle, Clock, Plus, X, Loader2, ArrowRight } from 'lucide-react'
import { searchFormSchema, type SearchFormData } from '@/lib/validations/search'
import Link from 'next/link'

export default function DashboardPage() {
  const [isSearching, setIsSearching] = useState(false)
  const [usernames, setUsernames] = useState<string[]>([])
  const [newUsername, setNewUsername] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<SearchFormData>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      queryUsernames: [],
    },
  })

  function addUsername() {
    if (newUsername && usernames.length < 5 && newUsername.length >= 3) {
      const updated = [...usernames, newUsername]
      setUsernames(updated)
      setValue('queryUsernames', updated)
      setNewUsername('')
    }
  }

  function removeUsername(index: number) {
    const updated = usernames.filter((_, i) => i !== index)
    setUsernames(updated)
    setValue('queryUsernames', updated)
  }

  async function onSubmit(data: SearchFormData) {
    setIsSearching(true)
    try {
      const response = await fetch('/api/searches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const result = await response.json()
      console.log('Search created:', result)
      // TODO: Redirect to results or show progress
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setIsSearching(false)
    }
  }

  // Mock stats - these would come from API
  const stats = {
    searchesThisMonth: 2,
    searchesLimit: 3,
    pendingResults: 0,
    activeGdprRequests: 0,
    criticalAlerts: 0,
  }

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div>
        <h1 className="text-2xl font-bold">Bienvenido</h1>
        <p className="text-muted-foreground">
          Gestiona tu presencia digital desde aquí
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Búsquedas este mes</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.searchesThisMonth}</div>
            <p className="text-xs text-muted-foreground">
              de {stats.searchesLimit} permitidas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resultados pendientes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingResults}</div>
            <p className="text-xs text-muted-foreground">
              sin revisar
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Solicitudes GDPR</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeGdprRequests}</div>
            <p className="text-xs text-muted-foreground">
              activas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas críticas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.criticalAlerts}</div>
            <p className="text-xs text-muted-foreground">
              requieren acción
            </p>
          </CardContent>
        </Card>
      </div>

      {/* New search form */}
      <Card>
        <CardHeader>
          <CardTitle>Nueva búsqueda</CardTitle>
          <CardDescription>
            Introduce tus datos para encontrar tu huella digital en internet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="queryName">Nombre completo *</Label>
                <Input
                  id="queryName"
                  placeholder="Juan García López"
                  {...register('queryName')}
                  disabled={isSearching}
                />
                {errors.queryName && (
                  <p className="text-sm text-destructive">{errors.queryName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="queryEmail">Email (opcional)</Label>
                <Input
                  id="queryEmail"
                  type="email"
                  placeholder="tu@email.com"
                  {...register('queryEmail')}
                  disabled={isSearching}
                />
                {errors.queryEmail && (
                  <p className="text-sm text-destructive">{errors.queryEmail.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Usernames (opcional)</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Añade un username"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addUsername())}
                  disabled={isSearching || usernames.length >= 5}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={addUsername}
                  disabled={isSearching || usernames.length >= 5 || newUsername.length < 3}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {usernames.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {usernames.map((username, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {username}
                      <button
                        type="button"
                        onClick={() => removeUsername(index)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Máximo 5 usernames. Buscaremos en redes sociales y foros.
              </p>
            </div>

            <Button type="submit" disabled={isSearching} className="w-full md:w-auto">
              {isSearching ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Buscando...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Iniciar búsqueda
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Recent searches */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Últimas búsquedas</CardTitle>
            <CardDescription>
              Tus búsquedas más recientes
            </CardDescription>
          </div>
          <Link href="/results">
            <Button variant="ghost" size="sm">
              Ver todas <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {/* Empty state */}
          <div className="text-center py-8 text-muted-foreground">
            <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No tienes búsquedas todavía</p>
            <p className="text-sm">Realiza tu primera búsqueda para empezar</p>
          </div>

          {/* Example of how searches would look (commented out)
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <p className="font-medium">Juan García</p>
                  <p className="text-sm text-muted-foreground">04 Feb 2026</p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="secondary">15 resultados</Badge>
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    Completada
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          */}
        </CardContent>
      </Card>
    </div>
  )
}
