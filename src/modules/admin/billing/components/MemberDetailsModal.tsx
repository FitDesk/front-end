import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  CreditCard, 
  AlertTriangle,
  DollarSign,
  Clock,
  CheckCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { OverdueMember } from './OverdueMemberships';

interface MemberDetailsModalProps {
  member: OverdueMember | null;
  isOpen: boolean;
  onClose: () => void;
  onCollectPayment: (memberId: string) => void;
}

export function MemberDetailsModal({ 
  member, 
  isOpen, 
  onClose, 
  onCollectPayment 
}: MemberDetailsModalProps) {
  if (!member) return null;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getOverdueColor = (days: number) => {
    if (days <= 7) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (days <= 15) return 'bg-orange-100 text-orange-800 border-orange-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const getOverdueSeverity = (days: number) => {
    if (days <= 7) return 'Bajo';
    if (days <= 15) return 'Medio';
    return 'Alto';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-[95vw] h-[95vh] max-h-[95vh] overflow-auto p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-10 w-10 bg-red-500">
              <AvatarFallback className="text-white font-semibold">
                {getInitials(member.memberName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">{member.memberName}</h2>
              <p className="text-sm text-muted-foreground">ID: {member.memberId}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Estado de Vencimiento */}
          <Card className="border-red-200 bg-red-50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-red-800">
                <AlertTriangle className="h-5 w-5" />
                Estado de Membresía
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Badge 
                    variant="outline" 
                    className={`${getOverdueColor(member.daysOverdue)} font-medium`}
                  >
                    {member.daysOverdue} días de atraso
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-1">
                    Severidad: {getOverdueSeverity(member.daysOverdue)}
                  </p>
                </div>
                <Button
                  onClick={() => onCollectPayment(member.id)}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Cobrar Ahora
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Información Personal */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Información Personal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{member.email}</p>
                  </div>
                </div>
                {member.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Teléfono</p>
                      <p className="text-sm text-muted-foreground">{member.phone}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Información del Plan */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Información del Plan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Plan Actual</p>
                  <p className="text-lg font-semibold text-green-600">{member.planName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Precio Mensual</p>
                  <p className="text-lg font-semibold">${member.planPrice}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Historial de Pagos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Historial de Pagos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-yellow-500" />
                    <div>
                      <p className="text-sm font-medium">Último Pago</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(member.lastPaymentDate), 'PPp', { locale: es })}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                    Vencido
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <div>
                      <p className="text-sm font-medium">Próxima Facturación</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(member.nextBillingDate), 'PPp', { locale: es })}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-red-100 text-red-800">
                    Pendiente
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Acciones Rápidas */}
          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onCollectPayment(member.id)}
                  className="hover:bg-orange-50 hover:text-orange-700"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Enviar Recordatorio
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="hover:bg-blue-50 hover:text-blue-700"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Enviar Email
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="hover:bg-green-50 hover:text-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Marcar como Pagado
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
