import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { RefreshCw, Info, CreditCard } from 'lucide-react';
import { useToast } from '@/shared/components/ui/toast';
import { MemberDetailsModal } from './MemberDetailsModal';
import { useState } from 'react';

export interface OverdueMember {
  id: string;
  memberId: string;
  memberName: string;
  planName: string;
  planPrice: number;
  daysOverdue: number;
  lastPaymentDate: string;
  nextBillingDate: string;
  email: string;
  phone?: string;
}

interface OverdueMembershipsProps {
  members: OverdueMember[];
  loading?: boolean;
  onCollectPayment: (memberId: string) => void;
  onViewDetails: (memberId: string) => void;
  onSendReminders: () => void;
}

export function OverdueMemberships({
  members,
  loading = false,
  onCollectPayment,
  onViewDetails: _onViewDetails,
  onSendReminders,
}: OverdueMembershipsProps) {
  const { toast } = useToast();
  const [selectedMember, setSelectedMember] = useState<OverdueMember | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCollectPayment = (memberId: string, memberName: string) => {
    onCollectPayment(memberId);
    toast({
      title: 'Cobro Iniciado',
      description: `Se ha enviado un mensaje de cobro a ${memberName}`,
    });
  };

  const handleSendReminders = () => {
    onSendReminders();
    toast({
      title: 'Recordatorios Enviados',
      description: `Se han enviado ${members.length} recordatorios de pago`,
    });
  };

  const handleViewDetails = (memberId: string) => {
    const member = members.find(m => m.id === memberId);
    if (member) {
      setSelectedMember(member);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMember(null);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getOverdueColor = (days: number) => {
    if (days <= 7) return 'text-yellow-400';
    if (days <= 15) return 'text-orange-400';
    return 'text-red-400';
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 animate-spin" />
            Cargando membresías vencidas...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-red-500" />
            Membresías Vencidas
          </CardTitle>
          <Button
            onClick={handleSendReminders}
            variant="outline"
            size="sm"
            className="bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 text-orange-600 dark:text-orange-400 border-gray-200 dark:border-gray-700 shadow-sm"
            disabled={members.length === 0}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Enviar Recordatorios
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {members.length === 0 ? (
          <div className="text-center py-4">
            <div className="text-muted-foreground dark:text-gray-400 mb-2">
              <CreditCard className="h-12 w-12 mx-auto mb-4 text-green-500" />
              <p className="text-lg font-medium">¡Excelente!</p>
              <p>No hay membresías vencidas</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-2 border-b border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 bg-red-500">
                    <AvatarFallback className="text-white font-semibold">
                      {getInitials(member.memberName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {member.memberName}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {member.planName} - ${member.planPrice}
                    </p>
                    <Badge 
                      variant="outline" 
                      className={`${getOverdueColor(member.daysOverdue)} font-medium`}
                    >
                      {member.daysOverdue} días de atraso
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => handleCollectPayment(member.id, member.memberName)}
                    size="sm"
                    className="bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 text-orange-600 dark:text-orange-400 border border-gray-200 dark:border-gray-700 shadow-sm"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Cobrar
                  </Button>
                  <Button
                    onClick={() => handleViewDetails(member.id)}
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                  >
                    <Info className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      
      {/* Modal de Detalles del Miembro */}
      <MemberDetailsModal
        member={selectedMember}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onCollectPayment={onCollectPayment}
      />
    </Card>
  );
}
