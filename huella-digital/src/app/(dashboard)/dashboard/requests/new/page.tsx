'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/components/ui/use-toast'
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react'
import type { GdprRequestType, SearchResult } from '@/types'

const requestTypes = [
  {
    value: 'erasure',
    label: 'Derecho de supresion (Art. 17)',
    description: 'Solicitar la eliminacion de tus datos personales',
  },
  {
    value: 'access',
    label: 'Derecho de acceso (Art. 15)',
    description: 'Solicitar informacion sobre que datos tienen tuyos',
  },
  {
    value: 'rectification',
    label: 'Derecho de rectificacion (Art. 16)',
    description: 'Solicitar la correccion de datos incorrectos',
  },
  {
    value: 'portability',
    label: 'Derecho de portabilidad (Art. 20)',
    description: 'Solicitar una copia de tus datos en formato portable',
  },
]

export default function NewRequestPage() {
  const [step, setStep] = useState(1)
  const [requestType, setRequestType] = useState<GdprRequestType>('erasure')
  const [targetEntity, setTargetEntity] = useState('')
  const [targetEmail, setTargetEmail] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<SearchResult | null>(null)
  const [generatedBody, setGeneratedBody] = useState('')

  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const supabase = createClient()

  const resultId = searchParams.get('resultId')

  useEffect(() => {
    if (resultId) {
      loadResult(resultId)
    }
  }, [resultId])

  const loadResult = async (id: string) => {
    const { data } = await supabase
      .from('search_results')
      .select('*')
      .eq('id', id)
      .single()
    
    if (data) {
      setResult(data)
      // Auto-fill some fields based on result
      if (data.title) {
        const entity = data.title.split(':')[0] || data.source
        setTargetEntity(entity)
      }
    }
  }

  const generateBody = async () => {
    // Get user info
    const { data: { user } } = await supabase.auth.getUser()
    const userName = user?.user_metadata?.full_name || 'Usuario'
    const userEmail = user?.email || ''
    const today = new Date().toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })

    let body = ''
    
    if (requestType === 'erasure') {
      body = `Estimado/a responsable de proteccion de datos,

Por medio de la presente, y en ejercicio del derecho de supresion reconocido en el articulo 17 del Reglamento General de Proteccion de Datos (RGPD), solicito la eliminacion de todos mis datos personales que obran en sus sistemas.

Datos del solicitante:
- Nombre completo: ${userName}
- Correo electronico: ${userEmail}
- Fecha de la solicitud: ${today}

Datos a eliminar:
${description || 'Todos mis datos personales almacenados en sus sistemas.'}

Fundamento juridico:
De conformidad con el articulo 17 del RGPD, tengo derecho a obtener la supresion de mis datos personales cuando:
- Los datos ya no son necesarios para los fines para los que fueron recogidos
- Retiro mi consentimiento y no existe otro fundamento juridico para el tratamiento
- Los datos han sido tratados ilicitamente

Le recuerdo que, segun el articulo 12.3 del RGPD, dispone de un plazo maximo de un mes para responder a esta solicitud.

En caso de no recibir respuesta satisfactoria, me reservo el derecho de presentar una reclamacion ante la Agencia Espanola de Proteccion de Datos (AEPD).

Atentamente,
${userName}`
    } else if (requestType === 'access') {
      body = `Estimado/a responsable de proteccion de datos,

En ejercicio del derecho de acceso reconocido en el articulo 15 del Reglamento General de Proteccion de Datos (RGPD), solicito que me proporcionen la siguiente informacion:

Datos del solicitante:
- Nombre completo: ${userName}
- Correo electronico: ${userEmail}
- Fecha de la solicitud: ${today}

Informacion solicitada:
1. Confirmacion de si se estan tratando o no datos personales mios
2. En caso afirmativo:
   - Copia de todos mis datos personales
   - Fines del tratamiento
   - Categorias de datos tratados
   - Destinatarios a quienes se han comunicado los datos
   - Plazo de conservacion previsto
   - Origen de los datos (si no se obtuvieron de mi directamente)
   - Existencia de decisiones automatizadas, incluida la elaboracion de perfiles

Segun el articulo 12.3 del RGPD, disponen de un plazo maximo de un mes para responder.

Atentamente,
${userName}`
    } else {
      body = `Estimado/a responsable de proteccion de datos,

En ejercicio del derecho de ${requestType === 'rectification' ? 'rectificacion' : 'portabilidad'} reconocido en el articulo ${requestType === 'rectification' ? '16' : '20'} del Reglamento General de Proteccion de Datos (RGPD), solicito:

Datos del solicitante:
- Nombre completo: ${userName}
- Correo electronico: ${userEmail}
- Fecha de la solicitud: ${today}

${description || 'Por favor, proporcionen los datos solicitados.'}

Segun el articulo 12.3 del RGPD, disponen de un plazo maximo de un mes para responder.

Atentamente,
${userName}`
    }

    setGeneratedBody(body)
  }

  const handleNext = () => {
    if (step === 2) {
      generateBody()
    }
    setStep(step + 1)
  }

  const handleBack = () => {
    setStep(step - 1)
  }

  const handleSubmit = async () => {
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('No user')
      }

      const subject = requestType === 'erasure' 
        ? 'Solicitud de supresion de datos personales - RGPD Art. 17'
        : requestType === 'access'
        ? 'Solicitud de acceso a datos personales - RGPD Art. 15'
        : requestType === 'rectification'
        ? 'Solicitud de rectificacion de datos - RGPD Art. 16'
        : 'Solicitud de portabilidad de datos - RGPD Art. 20'

      const { data, error } = await supabase
        .from('gdpr_requests')
        .insert({
          user_id: user.id,
          search_result_id: resultId,
          request_type: requestType,
          target_entity: targetEntity,
          target_email: targetEmail || null,
          subject,
          body: generatedBody,
          status: 'ready',
        })
        .select()
        .single()

      if (error) throw error

      toast({
        title: 'Solicitud creada',
        description: 'Tu solicitud GDPR ha sido creada correctamente.',
      })

      router.push(`/dashboard/requests/${data.id}`)
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: 'Error',
        description: 'Ha ocurrido un error al crear la solicitud.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/requests">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nueva solicitud GDPR</h1>
          <p className="text-muted-foreground">
            Paso {step} de 3
          </p>
        </div>
      </div>

      <Progress value={(step / 3) * 100} className="h-2" />

      {/* Step 1: Select Type */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Tipo de solicitud</CardTitle>
            <CardDescription>
              Selecciona el tipo de solicitud que deseas generar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup value={requestType} onValueChange={(v) => setRequestType(v as GdprRequestType)}>
              {requestTypes.map((type) => (
                <div key={type.value} className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50">
                  <RadioGroupItem value={type.value} id={type.value} />
                  <Label htmlFor={type.value} className="flex-1 cursor-pointer">
                    <span className="font-medium">{type.label}</span>
                    <p className="text-sm text-muted-foreground">{type.description}</p>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Recipient Details */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Destinatario</CardTitle>
            <CardDescription>
              Indica a quien se enviara esta solicitud.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="targetEntity">Entidad/Empresa *</Label>
              <Input
                id="targetEntity"
                placeholder="Twitter, Inc."
                value={targetEntity}
                onChange={(e) => setTargetEntity(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetEmail">Email de contacto (DPO)</Label>
              <Input
                id="targetEmail"
                type="email"
                placeholder="privacy@empresa.com"
                value={targetEmail}
                onChange={(e) => setTargetEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Datos especificos a {requestType === 'erasure' ? 'eliminar' : 'solicitar'} (opcional)</Label>
              <Textarea
                id="description"
                placeholder="Mi perfil publico y todos los datos asociados..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>
            {result && (
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm font-medium">Resultado asociado:</p>
                <p className="text-sm text-muted-foreground">{result.title}</p>
                {result.url && (
                  <p className="text-sm text-muted-foreground truncate">{result.url}</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 3: Review */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Revisar solicitud</CardTitle>
            <CardDescription>
              Revisa el contenido antes de guardar.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="font-medium mb-2">Asunto:</p>
              <p className="text-sm">
                {requestType === 'erasure' 
                  ? 'Solicitud de supresion de datos personales - RGPD Art. 17'
                  : requestType === 'access'
                  ? 'Solicitud de acceso a datos personales - RGPD Art. 15'
                  : requestType === 'rectification'
                  ? 'Solicitud de rectificacion de datos - RGPD Art. 16'
                  : 'Solicitud de portabilidad de datos - RGPD Art. 20'}
              </p>
            </div>
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="font-medium mb-2">Destinatario:</p>
              <p className="text-sm">{targetEntity}</p>
              {targetEmail && <p className="text-sm text-muted-foreground">{targetEmail}</p>}
            </div>
            <div className="bg-muted/50 rounded-lg p-4 max-h-96 overflow-y-auto">
              <p className="font-medium mb-2">Contenido:</p>
              <pre className="text-sm whitespace-pre-wrap font-sans">{generatedBody}</pre>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={step === 1}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Anterior
        </Button>
        {step < 3 ? (
          <Button onClick={handleNext} disabled={step === 2 && !targetEntity}>
            Siguiente
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Crear solicitud
          </Button>
        )}
      </div>
    </div>
  )
}
