import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, Shield, FileText, Bell, Check, ArrowRight } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Shield className="h-6 w-6" />
            <span className="font-bold text-xl">Huella Digital</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link href="#features" className="transition-colors hover:text-foreground/80">
              Funciones
            </Link>
            <Link href="#pricing" className="transition-colors hover:text-foreground/80">
              Precios
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost">Acceder</Button>
            </Link>
            <Link href="/register">
              <Button>Empezar gratis</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container py-24 md:py-32 lg:py-40">
          <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center">
            <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl lg:leading-[1.1]">
              Descubre y controla
              <br />
              tu presencia en internet
            </h1>
            <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
              Encuentra donde aparece tu informacion online y ejerce tu derecho al olvido con un clic.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="/register">
                <Button size="lg" className="gap-2">
                  Empezar gratis
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline">
                  Ver funciones
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="container py-24 md:py-32">
          <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center mb-16">
            <h2 className="text-2xl font-bold leading-tight tracking-tighter md:text-4xl">
              Todo lo que necesitas para proteger tu privacidad
            </h2>
            <p className="max-w-[750px] text-muted-foreground">
              Herramientas potentes para descubrir, gestionar y eliminar tu informacion personal de internet.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <Search className="h-10 w-10 mb-2 text-primary" />
                <CardTitle>Busca tu huella</CardTitle>
                <CardDescription>
                  Escaneamos multiples fuentes para encontrar donde aparece tu informacion personal.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Shield className="h-10 w-10 mb-2 text-primary" />
                <CardTitle>Identifica riesgos</CardTitle>
                <CardDescription>
                  Clasificamos los resultados por severidad para que sepas que es urgente.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <FileText className="h-10 w-10 mb-2 text-primary" />
                <CardTitle>Genera solicitudes GDPR</CardTitle>
                <CardDescription>
                  Crea solicitudes de eliminacion legalmente validas con un clic.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Bell className="h-10 w-10 mb-2 text-primary" />
                <CardTitle>Seguimiento automatico</CardTitle>
                <CardDescription>
                  Recordatorios cuando las empresas no responden dentro del plazo legal.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Shield className="h-10 w-10 mb-2 text-primary" />
                <CardTitle>Data breaches</CardTitle>
                <CardDescription>
                  Detectamos si tu email aparece en filtraciones de datos conocidas.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <FileText className="h-10 w-10 mb-2 text-primary" />
                <CardTitle>Exporta tus datos</CardTitle>
                <CardDescription>
                  Descarga toda tu informacion en cualquier momento. Tus datos son tuyos.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* How it works */}
        <section className="bg-muted/50 py-24 md:py-32">
          <div className="container">
            <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center mb-16">
              <h2 className="text-2xl font-bold leading-tight tracking-tighter md:text-4xl">
                Como funciona
              </h2>
            </div>
            <div className="grid gap-8 md:grid-cols-4">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-xl">
                  1
                </div>
                <h3 className="font-semibold mb-2">Introduce tus datos</h3>
                <p className="text-sm text-muted-foreground">
                  Nombre, email y usernames que quieras buscar
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-xl">
                  2
                </div>
                <h3 className="font-semibold mb-2">Recibe tu informe</h3>
                <p className="text-sm text-muted-foreground">
                  Resultados clasificados por severidad y categoria
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-xl">
                  3
                </div>
                <h3 className="font-semibold mb-2">Genera solicitudes</h3>
                <p className="text-sm text-muted-foreground">
                  Crea cartas GDPR listas para enviar
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-xl">
                  4
                </div>
                <h3 className="font-semibold mb-2">Haz seguimiento</h3>
                <p className="text-sm text-muted-foreground">
                  Controla el estado de cada solicitud
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="container py-24 md:py-32">
          <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center mb-16">
            <h2 className="text-2xl font-bold leading-tight tracking-tighter md:text-4xl">
              Precios simples y transparentes
            </h2>
            <p className="max-w-[750px] text-muted-foreground">
              Empieza gratis y actualiza cuando lo necesites.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            {/* Free Plan */}
            <Card>
              <CardHeader>
                <CardTitle>Gratis</CardTitle>
                <CardDescription>Para empezar a explorar</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">0</span>
                  <span className="text-muted-foreground"> EUR/mes</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    3 busquedas por dia
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Templates GDPR basicos
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Resultados por 30 dias
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Deteccion de data breaches
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/register" className="w-full">
                  <Button className="w-full" variant="outline">
                    Empezar gratis
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            {/* Pro Plan */}
            <Card className="border-primary">
              <CardHeader>
                <div className="inline-block px-3 py-1 text-xs font-semibold bg-primary text-primary-foreground rounded-full mb-2 w-fit">
                  Popular
                </div>
                <CardTitle>Pro</CardTitle>
                <CardDescription>Para usuarios activos</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">9</span>
                  <span className="text-muted-foreground"> EUR/mes</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    30 busquedas por dia
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Todo lo del plan Free
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Monitoreo continuo
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Soporte prioritario
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Templates GDPR avanzados
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/register" className="w-full">
                  <Button className="w-full">Elegir Pro</Button>
                </Link>
              </CardFooter>
            </Card>

            {/* Enterprise Plan */}
            <Card>
              <CardHeader>
                <CardTitle>Enterprise</CardTitle>
                <CardDescription>Para equipos y empresas</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">Contactar</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Busquedas ilimitadas
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Todo lo del plan Pro
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    API access
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    SLA garantizado
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Soporte dedicado
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline">
                  Contactar ventas
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary text-primary-foreground py-24 md:py-32">
          <div className="container">
            <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center">
              <h2 className="text-2xl font-bold leading-tight tracking-tighter md:text-4xl">
                Toma el control de tu privacidad hoy
              </h2>
              <p className="max-w-[750px] opacity-90">
                Empieza gratis y descubre que informacion tuya esta circulando por internet.
              </p>
              <Link href="/register">
                <Button size="lg" variant="secondary" className="gap-2 mt-4">
                  Crear cuenta gratis
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <Link href="/" className="flex items-center space-x-2 mb-4">
                <Shield className="h-6 w-6" />
                <span className="font-bold">Huella Digital</span>
              </Link>
              <p className="text-sm text-muted-foreground">
                Tu privacidad importa. Tomamos en serio la proteccion de tus datos.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Producto</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#features" className="hover:text-foreground">Funciones</Link></li>
                <li><Link href="#pricing" className="hover:text-foreground">Precios</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/privacy" className="hover:text-foreground">Privacidad</Link></li>
                <li><Link href="/terms" className="hover:text-foreground">Terminos</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contacto</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>soporte@huelladigital.app</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
            2026 Huella Digital. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  )
}
