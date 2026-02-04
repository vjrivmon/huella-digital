'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'
import { Loader2, X, Plus } from 'lucide-react'

interface SearchFormProps {
  defaultName?: string
  defaultEmail?: string
  remainingSearches: number
}

export function SearchForm({ defaultName = '', defaultEmail = '', remainingSearches }: SearchFormProps) {
  const [name, setName] = useState(defaultName)
  const [email, setEmail] = useState(defaultEmail)
  const [usernames, setUsernames] = useState<string[]>([])
  const [usernameInput, setUsernameInput] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  const addUsername = () => {
    if (usernameInput && usernames.length < 5 && !usernames.includes(usernameInput)) {
      setUsernames([...usernames, usernameInput])
      setUsernameInput('')
    }
  }

  const removeUsername = (username: string) => {
    setUsernames(usernames.filter((u) => u !== username))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (remainingSearches <= 0) {
      toast({
        title: 'Limite alcanzado',
        description: 'Has alcanzado el limite diario de busquedas. Actualiza tu plan para continuar.',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        toast({
          title: 'Error',
          description: 'Debes iniciar sesion para buscar',
          variant: 'destructive',
        })
        return
      }

      // Create search record
      const { data: search, error } = await supabase
        .from('searches')
        .insert({
          user_id: user.id,
          query_name: name,
          query_email: email || null,
          query_usernames: usernames.length > 0 ? usernames : null,
          status: 'pending',
        })
        .select()
        .single()

      if (error) throw error

      // Update searches_today
      await supabase.rpc('increment_searches_today', { user_id: user.id })

      toast({
        title: 'Busqueda iniciada',
        description: 'Te notificaremos cuando los resultados esten listos.',
      })

      // Start the search process (in a real app this would be a background job)
      // For MVP, we'll simulate it with a direct call
      await fetch('/api/search/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ searchId: search.id }),
      })

      router.push(`/dashboard/searches/${search.id}`)
      router.refresh()
    } catch (error) {
      console.error('Search error:', error)
      toast({
        title: 'Error',
        description: 'Ha ocurrido un error al iniciar la busqueda',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre completo *</Label>
          <Input
            id="name"
            placeholder="Juan Garcia Lopez"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email (opcional)</Label>
          <Input
            id="email"
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="username">Usernames (opcional, max 5)</Label>
        <div className="flex gap-2">
          <Input
            id="username"
            placeholder="juangarcia"
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addUsername()
              }
            }}
            disabled={usernames.length >= 5}
          />
          <Button
            type="button"
            variant="outline"
            onClick={addUsername}
            disabled={usernames.length >= 5 || !usernameInput}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {usernames.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {usernames.map((username) => (
              <Badge key={username} variant="secondary" className="gap-1">
                @{username}
                <button
                  type="button"
                  onClick={() => removeUsername(username)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {remainingSearches} busqueda{remainingSearches !== 1 ? 's' : ''} disponible{remainingSearches !== 1 ? 's' : ''} hoy
        </p>
        <Button type="submit" disabled={loading || remainingSearches <= 0}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Iniciar busqueda
        </Button>
      </div>
    </form>
  )
}
