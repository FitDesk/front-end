import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { useGetMemberQuery } from './query/useMemberQuery';
import { useAuthStore } from '@/core/store/auth.store';
import { Input } from '@/shared/components/ui/input';
import { Image } from '@/shared/components/ui/image';
import { Label } from '@/shared/components/ui/label';

export default function ProfilePage() {

  const user = useAuthStore(state => state.user)

  const { data: member } = useGetMemberQuery(user?.id || '');

  console.log("Datos del usuario:", member);

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
          {/* Imagen de perfil centrada */}
          <div className="flex justify-center">
            <div className="relative">
              <Image
                src={member?.profileImageUrl || '/default-profile.png'}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 shadow-lg"
              />
            </div>
          </div>

          {/* Grid de información personal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            {/* Nombre */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Nombre</Label>
              <Input
                type="text"
                value={member?.firstName || ''}
                readOnly
                className="w-full bg-gray-50"
              />
            </div>

            {/* Apellido */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Apellido</Label>
              <Input
                type="text"
                value={member?.lastName || ''}
                readOnly
                className="w-full bg-gray-50"
              />
            </div>

            {/* DNI */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">DNI</Label>
              <Input
                type="text"
                value={member?.dni || ''}
                readOnly
                className="w-full bg-gray-50"
              />
            </div>

            {/* Teléfono */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Teléfono</Label>
              <Input
                type="text"
                value={member?.phone || ''}
                readOnly
                className="w-full bg-gray-50"
              />
            </div>

            {/* Estado */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Estado</Label>
              <Input
                type="text"
                value={member?.status || ''}
                readOnly
                className="w-full bg-gray-50 capitalize"
              />
            </div>
          </div>
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