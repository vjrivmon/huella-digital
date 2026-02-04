'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, Shield, FileText, Bell, Check, ArrowRight } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">Huella Digital</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Funciones
            </Link>
            <Link href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Precios
            </Link>
            <Link href="#about" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Sobre nosotros
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Acceder</Button>
            </Link>
            <Link href="/register">
              <Button>Empezar gratis</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container py-24 md:py-32 flex flex-col items-center text-center">
        <Badge variant="secondary" className="mb-4">
          🔒 Protege tu privacidad online
        </Badge>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 max-w-4xl">
          Descubre y controla tu{' '}
          <span className="text-primary">presencia en internet</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
          Encuentra dónde aparece tu información online y ejerce tu derecho al olvido
          con solicitudes GDPR generadas automáticamente.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/register">
            <Button size="lg" className="gap-2">
              Empezar gratis <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="#demo">
            <Button size="lg" variant="outline">
              Ver demo
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container py-24 bg-muted/50">
        <h2 className="text-3xl font-bold text-center mb-4">¿Cómo funciona?</h2>
        <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
          En tres simples pasos, toma el control de tu huella digital
        </p>
        
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>1. Busca tu huella</CardTitle>
              <CardDescription>
                Introduce tu nombre, email y usernames. Escaneamos múltiples fuentes
                incluyendo Google, redes sociales y bases de datos de filtraciones.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>2. Identifica riesgos</CardTitle>
              <CardDescription>
                Clasificamos los resultados por severidad y tipo. Verás claramente
                qué requiere acción urgente y qué es menos preocupante.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>3. Solicita eliminación</CardTitle>
              <CardDescription>
                Generamos solicitudes GDPR legalmente válidas. Solo tienes que
                enviarlas y hacer seguimiento hasta su resolución.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="container py-24">
        <h2 className="text-3xl font-bold text-center mb-4">Precios transparentes</h2>
        <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
          Empieza gratis. Mejora cuando lo necesites.
        </p>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <Card>
            <CardHeader>
              <CardTitle>Gratis</CardTitle>
              <CardDescription>Para empezar a explorar</CardDescription>
              <div className="text-3xl font-bold mt-4">0€<span className="text-lg font-normal text-muted-foreground">/mes</span></div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>3 búsquedas/día</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Templates GDPR básicos</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Resultados 30 días</span>
                </li>
              </ul>
              <Link href="/register" className="block mt-6">
                <Button className="w-full" variant="outline">Empezar gratis</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Pro Plan */}
          <Card className="border-primary">
            <CardHeader>
              <Badge className="w-fit mb-2">Popular</Badge>
              <CardTitle>Pro</CardTitle>
              <CardDescription>Para usuarios serios</CardDescription>
              <div className="text-3xl font-bold mt-4">9€<span className="text-lg font-normal text-muted-foreground">/mes</span></div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>30 búsquedas/día</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Todo lo del plan Gratis</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Monitoreo continuo</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Soporte prioritario</span>
                </li>
              </ul>
              <Link href="/register" className="block mt-6">
                <Button className="w-full">Elegir Pro</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Enterprise Plan */}
          <Card>
            <CardHeader>
              <CardTitle>Enterprise</CardTitle>
              <CardDescription>Para equipos y empresas</CardDescription>
              <div className="text-3xl font-bold mt-4">Contactar</div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Búsquedas ilimitadas</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Todo lo del plan Pro</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Acceso API</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>SLA garantizado</span>
                </li>
              </ul>
              <Button className="w-full mt-6" variant="outline">Contactar</Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/50">
        <div className="container py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-5 w-5 text-primary" />
                <span className="font-bold">Huella Digital</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Toma el control de tu presencia online con herramientas simples y legales.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Producto</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#features" className="hover:text-foreground">Funciones</Link></li>
                <li><Link href="#pricing" className="hover:text-foreground">Precios</Link></li>
                <li><Link href="/faq" className="hover:text-foreground">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/privacy" className="hover:text-foreground">Privacidad</Link></li>
                <li><Link href="/terms" className="hover:text-foreground">Términos</Link></li>
                <li><Link href="/cookies" className="hover:text-foreground">Cookies</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contacto</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>soporte@huelladigital.app</li>
                <li><Link href="https://twitter.com/huelladigital" className="hover:text-foreground">Twitter</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Huella Digital. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  )
}
