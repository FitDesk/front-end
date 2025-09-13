import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ArrowLeft, Edit, Trash2, UserCheck, UserX, Mail, Phone, MapPin, Calendar, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Badge } from '@/shared/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { useToast } from '@/shared/components/ui/toast';
import { Separator } from '@/shared/components/ui/separator';
import { useMember } from '../hooks/useMembers';
import { useMemberStore } from '../store/useMemberStore';
import { LoadingSpinner } from '@/shared/components/ui/loading-spinner';

export function MemberDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { member, isLoading, error } = useMember(id);
  const { updateMemberStatus, deleteMember } = useMemberStore();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

 
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PPP', { locale: es });
    } catch (error) {
      return 'Fecha inválida';
    }
  };


  const handleStatusChange = async (status: 'ACTIVE' | 'SUSPENDED') => {
    if (!member) return;
    
    try {
      await updateMemberStatus(member.id, status);
      toast({
        title: 'Estado actualizado',
        description: `El estado del miembro ha sido actualizado a ${status === 'ACTIVE' ? 'Activo' : 'Suspendido'}.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el estado del miembro. Por favor, inténtalo de nuevo.',
        type: 'destructive',
      });
    }
  };

  
  const handleDelete = async () => {
    if (!member) return;
    
    try {
      setIsDeleting(true);
      const success = await deleteMember(member.id);
      
      if (success) {
        toast({
          title: 'Miembro eliminado',
          description: `El miembro ${member.firstName} ${member.lastName} ha sido eliminado correctamente.`,
        });
        navigate('/admin/members');
      } else {
        throw new Error('No se pudo eliminar el miembro');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el miembro. Por favor, inténtalo de nuevo.',
        type: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleDeleteClick = () => {
    if (!member) return;
    setIsDeleteDialogOpen(true);
  };

  
 
  const DeleteConfirmationDialog = () => (
    <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 ${!isDeleteDialogOpen ? 'hidden' : ''}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex flex-col items-center space-y-4">
          <div className="rounded-full bg-red-100 dark:bg-red-900/30 p-3">
            <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">¿Eliminar miembro?</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            ¿Estás seguro de que deseas eliminar a {member?.firstName} {member?.lastName}? Esta acción no se puede deshacer.
          </p>
          <div className="flex justify-end space-x-3 w-full mt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Eliminando...' : 'Eliminar'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner className="h-8 w-8" />
      </div>
    );
  }

  
  if (error || !member) {
    return (
      <div className="rounded-md bg-destructive/10 p-4">
        <div className="flex">
          <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-destructive">
              No se pudo cargar la información del miembro
            </h3>
            <div className="mt-2 text-sm text-destructive">
              <p>{error instanceof Error ? error.message : String(error) || 'El miembro solicitado no existe o no tienes permisos para verlo.'}</p>
            </div>
            <div className="mt-4">
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteClick}
                className="gap-2"
                disabled={isDeleting}
              >
                Volver a la lista
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  
  const getMembershipStatusVariant = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'default';
      case 'SUSPENDED':
        return 'secondary';
      case 'EXPIRED':
        return 'destructive';
      case 'CANCELLED':
        return 'outline';
      default:
        return 'default';
    }
  };

  
  const getMembershipStatusLabel = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'Activa';
      case 'SUSPENDED':
        return 'Suspendida';
      case 'EXPIRED':
        return 'Vencida';
      case 'CANCELLED':
        return 'Cancelada';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      <DeleteConfirmationDialog />
      <div className="container mx-auto px-4 sm:px-6 py-6 space-y-6 max-w-7xl">
        {/* Encabezado */}
        <div className="flex flex-col space-y-4 p-4 sm:p-6 bg-card rounded-lg shadow-sm">
          <Button
            variant="ghost"
          className="w-fit p-0 hover:bg-transparent"
          onClick={() => navigate('/admin/members')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a la lista
        </Button>
        
        <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={member.profileImage} alt={`${member.firstName} ${member.lastName}`} />
              <AvatarFallback>
                {member.firstName.charAt(0)}
                {member.lastName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                {member.firstName} {member.lastName}
              </h1>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span>Miembro desde {formatDate(member.registrationDate)}</span>
                <span>•</span>
                <Badge variant={member.status === 'ACTIVE' ? 'default' : 'secondary'}>
                  {member.status === 'ACTIVE' ? 'Activo' : 'Suspendido'}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/admin/members/editar/${member.id}`)}
            >
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Button>
            <Button
              variant={member.status === 'ACTIVE' ? 'outline' : 'default'}
              size="sm"
              onClick={() => handleStatusChange(member.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE')}
            >
              {member.status === 'ACTIVE' ? (
                <UserX className="mr-2 h-4 w-4" />
              ) : (
                <UserCheck className="mr-2 h-4 w-4" />
              )}
              {member.status === 'ACTIVE' ? 'Suspender' : 'Activar'}
            </Button>
          </div>
        </div>
      </div>

      {/* Pestañas */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="membership">Membresía</TabsTrigger>
          <TabsTrigger value="payments">Pagos</TabsTrigger>
          <TabsTrigger value="attendance">Asistencia</TabsTrigger>
        </TabsList>

        {/* Contenido de la pestaña de resumen */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Información personal */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Información Personal</CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Fecha de Nacimiento:</span>
                    <span className="ml-2 font-medium">
                      {member.birthDate ? formatDate(member.birthDate) : 'No especificada'}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="w-6 h-4 flex items-center justify-center">
                      <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                    </span>
                    <span className="text-muted-foreground">Género:</span>
                    <span className="ml-2 font-medium">
                      {member.gender === 'MALE' ? 'Masculino' : 
                       member.gender === 'FEMALE' ? 'Femenino' : 'Otro'}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="w-6 h-4 flex items-center justify-center">
                      <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                    </span>
                    <span className="text-muted-foreground">DNI:</span>
                    <span className="ml-2 font-medium">
                      {member.documentNumber || 'No especificado'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Información de contacto */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Contacto</CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                    <a href={`mailto:${member.email}`} className="hover:underline">
                      {member.email}
                    </a>
                  </div>
                  <div className="flex items-center text-sm">
                    <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                    <a href={`tel:${member.phone}`} className="hover:underline">
                      {member.phone}
                    </a>
                  </div>
                  <div className="flex items-start text-sm">
                    <MapPin className="mr-2 h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <div>{member.address.street}</div>
                      <div>
                        {member.address.district}, {member.address.city}
                      </div>
                      {member.address.reference && (
                        <div className="text-muted-foreground text-xs mt-1">
                          Ref: {member.address.reference}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contacto de emergencia */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Contacto de Emergencia</CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <div className="space-y-2">
                  <div className="text-sm font-medium">
                    {member.emergencyContact.name}
                    {member.emergencyContact.relationship && (
                      <span className="text-muted-foreground font-normal">
                        {' '}({member.emergencyContact.relationship})
                      </span>
                    )}
                  </div>
                  <div className="flex items-center text-sm">
                    <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                    <a href={`tel:${member.emergencyContact.phone}`} className="hover:underline">
                      {member.emergencyContact.phone}
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Estado de la membresía */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Membresía</CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Tipo</span>
                    <span className="text-sm font-medium">
                      {member.membership.type === 'MONTHLY' ? 'Mensual' :
                       member.membership.type === 'QUARTERLY' ? 'Trimestral' :
                       member.membership.type === 'ANNUAL' ? 'Anual' : 'Premium'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Estado</span>
                    <Badge variant={getMembershipStatusVariant(member.membership.status)}>
                      {getMembershipStatusLabel(member.membership.status)}
                    </Badge>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Inicio</span>
                    <span className="text-sm font-medium">
                      {formatDate(member.membership.startDate)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Vencimiento</span>
                    <span className="text-sm font-medium">
                      {member.membership.endDate ? formatDate(member.membership.endDate) : 'No especificado'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Notas adicionales */}
          {member.notes && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Notas Adicionales</CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <p className="text-sm text-muted-foreground whitespace-pre-line">
                  {member.notes}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Contenido de la pestaña de membresía */}
        <TabsContent value="membership" className="space-y-4">
          <Card className="mb-6 overflow-hidden">
            <CardHeader className="pb-3 px-6 pt-6">
              <CardTitle>Detalles de la Membresía</CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">
                      Información de la Membresía
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Tipo</span>
                        <span className="text-sm font-medium">
                          {member.membership.type === 'MONTHLY' ? 'Mensual' :
                           member.membership.type === 'QUARTERLY' ? 'Trimestral' :
                           member.membership.type === 'ANNUAL' ? 'Anual' : 'Premium'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Estado</span>
                        <Badge variant={getMembershipStatusVariant(member.membership.status)}>
                          {getMembershipStatusLabel(member.membership.status)}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Fecha de Inicio</span>
                        <span className="text-sm font-medium">
                          {formatDate(member.membership.startDate)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Fecha de Vencimiento</span>
                        <span className="text-sm font-medium">
                          {member.membership.endDate ? formatDate(member.membership.endDate) : 'No especificada'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    Acciones
                  </h3>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      Renovar Membresía
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      Cambiar Plan
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      Generar Comprobante
                    </Button>
                    {member.membership.status === 'SUSPENDED' ? (
                      <Button className="w-full justify-start">
                        Reactivar Membresía
                      </Button>
                    ) : (
                      <Button variant="destructive" className="w-full justify-start">
                        Suspender Membresía
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/*  pestaña  pagos */}
        <TabsContent value="payments">
          <Card className="mb-6 overflow-hidden">
            <CardHeader className="pb-3 px-6 pt-6">
              <CardTitle>Historial de Pagos</CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="text-center py-8 text-muted-foreground">
                <p>No hay registros de pagos disponibles.</p>
                <Button variant="outline" className="mt-4">
                  Registrar Pago
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* asistencia */}
        <TabsContent value="attendance">
          <Card className="mb-6 overflow-hidden">
            <CardHeader className="pb-3 px-6 pt-6">
              <CardTitle>Registro de Asistencia</CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="text-center py-8 text-muted-foreground">
                <p>No hay registros de asistencia disponibles.</p>
                <Button variant="outline" className="mt-4">
                  Registrar Asistencia
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Sección  peligrosas */}
      <div className="border border-destructive/20 rounded-lg p-4 space-y-4">
        <div>
          <h3 className="text-sm font-medium text-destructive">Zona de Peligro</h3>
          <p className="text-sm text-muted-foreground">
            Estas acciones son irreversibles. Ten cuidado al realizar cambios en esta sección.
          </p>
        </div>
        <div className="flex justify-end">
          <Button
            variant="destructive"
            onClick={handleDeleteClick}
            className="gap-2"
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4" />
            {isDeleting ? 'Eliminando...' : 'Eliminar Miembro'}
          </Button>
        </div>
      </div>
      </div>
    </div>
  );
}
