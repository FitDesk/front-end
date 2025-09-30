import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Mi Perfil</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Información Personal</CardTitle>
          <CardDescription>
            Actualiza tu información personal y preferencias.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Contenido del perfil */}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mi Plan Actual</CardTitle>
          <CardDescription>
            Detalles de tu suscripción actual.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Detalles del plan */}
        </CardContent>
      </Card>
    </div>
  );
}
