'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { User, Shield, Bell, CreditCard, Trash2, Download, Loader2 } from 'lucide-react'

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState('')
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // Mock user data
  const user = {
    fullName: 'Usuario Demo',
    email: 'demo@example.com',
    language: 'es',
    plan: 'free',
  }

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    // TODO: Implement save profile
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  async function handleExportData() {
    setIsLoading(true)
    // TODO: Implement data export
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
    alert('Exportación iniciada. Recibirás un email con el enlace de descarga.')
  }

  async function handleDeleteAccount() {
    if (deleteConfirmation !== 'ELIMINAR MI CUENTA') return
    // TODO: Implement account deletion
    alert('Cuenta eliminada')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Ajustes</h1>
        <p className="text-muted-foreground">
          Gestiona tu cuenta y preferencias
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="privacy" className="gap-2">
            <Shield className="h-4 w-4" />
            Privacidad
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            Notificaciones
          </TabsTrigger>
          <TabsTrigger value="billing" className="gap-2">
            <CreditCard className="h-4 w-4" />
            Plan
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Perfil</CardTitle>
              <CardDescription>
                Información básica de tu cuenta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarFallback className="text-2xl">
                      {user.fullName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <Button type="button" variant="outline">
                    Cambiar foto
                  </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Nombre completo</Label>
                    <Input
                      id="fullName"
                      defaultValue={user.fullName}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue={user.email}
                      disabled
                    />
                    <p className="text-xs text-muted-foreground">
                      Para cambiar el email, contacta soporte
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Idioma</Label>
                  <Select defaultValue={user.language}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Tema</Label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input type="radio" name="theme" value="light" />
                      Claro
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="theme" value="dark" />
                      Oscuro
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="theme" value="system" defaultChecked />
                      Sistema
                    </label>
                  </div>
                </div>

                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    'Guardar cambios'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Tab */}
        <TabsContent value="privacy">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Exportar mis datos</CardTitle>
                <CardDescription>
                  Descarga todos tus datos en formato JSON (GDPR Art. 20)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={handleExportData} disabled={isLoading}>
                  <Download className="mr-2 h-4 w-4" />
                  Exportar datos
                </Button>
              </CardContent>
            </Card>

            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="text-destructive">Zona de peligro</CardTitle>
                <CardDescription>
                  Acciones irreversibles para tu cuenta
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-1">Eliminar mi cuenta</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Esta acción es irreversible. Se eliminarán todos tus datos,
                      búsquedas y solicitudes GDPR.
                    </p>
                    <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Eliminar cuenta
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>¿Estás seguro?</DialogTitle>
                          <DialogDescription>
                            Esta acción no se puede deshacer. Todos tus datos serán
                            eliminados permanentemente.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label>
                              Escribe <strong>ELIMINAR MI CUENTA</strong> para confirmar
                            </Label>
                            <Input
                              value={deleteConfirmation}
                              onChange={(e) => setDeleteConfirmation(e.target.value)}
                              placeholder="ELIMINAR MI CUENTA"
                            />
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              onClick={() => setIsDeleteDialogOpen(false)}
                            >
                              Cancelar
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={handleDeleteAccount}
                              disabled={deleteConfirmation !== 'ELIMINAR MI CUENTA'}
                            >
                              Eliminar permanentemente
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notificaciones</CardTitle>
              <CardDescription>
                Configura cómo quieres recibir notificaciones
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Búsquedas completadas</p>
                  <p className="text-sm text-muted-foreground">
                    Recibe un email cuando termine una búsqueda
                  </p>
                </div>
                <input type="checkbox" defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Recordatorios GDPR</p>
                  <p className="text-sm text-muted-foreground">
                    Recordatorios de solicitudes pendientes de respuesta
                  </p>
                </div>
                <input type="checkbox" defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Alertas de seguridad</p>
                  <p className="text-sm text-muted-foreground">
                    Nuevas filtraciones de datos detectadas
                  </p>
                </div>
                <input type="checkbox" defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Marketing</p>
                  <p className="text-sm text-muted-foreground">
                    Novedades y ofertas especiales
                  </p>
                </div>
                <input type="checkbox" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tu plan actual</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
                  <div>
                    <h3 className="text-xl font-bold">Plan Gratis</h3>
                    <p className="text-muted-foreground">3 búsquedas por día</p>
                  </div>
                  <Button>Mejorar a Pro</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Plan Pro</CardTitle>
                <CardDescription>
                  Desbloquea todas las funcionalidades
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-3xl font-bold">
                    9€<span className="text-lg font-normal text-muted-foreground">/mes</span>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li>✓ 30 búsquedas por día</li>
                    <li>✓ Monitoreo continuo</li>
                    <li>✓ Alertas en tiempo real</li>
                    <li>✓ Soporte prioritario</li>
                    <li>✓ Exportación ilimitada</li>
                  </ul>
                  <Button className="w-full">Actualizar a Pro</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
