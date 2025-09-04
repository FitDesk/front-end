import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from '@/shared/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table';
import { Badge } from '@/shared/components/ui/badge';
import { Pencil, Send, Trash2, Gift } from 'lucide-react';
import type { Promotion } from '../types/promotion';

interface PromotionsListProps {
  promotions: Promotion[];
  onEdit: (promotion: Promotion) => void;
  onDelete: (id: string) => void;
  onSend: (id: string) => void;
  isLoading: boolean;
}

export function PromotionsList({ promotions, onEdit, onDelete, onSend, isLoading }: PromotionsListProps) {
  const formatDate = (date: string | Date) => {
    return format(new Date(date), 'PP', { locale: es });
  };

  const getTargetLabel = (target: string) => {
    switch (target) {
      case 'all':
        return 'Todos';
      case 'members':
        return 'Miembros';
      case 'trainers':
        return 'Entrenadores';
      default:
        return target;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center space-y-2">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground">Cargando promociones...</p>
        </div>
      </div>
    );
  }

  if (promotions.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed p-12 text-center">
        <div className="flex flex-col items-center justify-center space-y-2">
          <Gift className="h-12 w-12 text-muted-foreground" />
          <h3 className="text-lg font-medium">No hay promociones</h3>
          <p className="text-sm text-muted-foreground">
            Comienza creando tu primera promoción
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border shadow-sm overflow-hidden">
      <div className="p-4 border-b bg-muted/10">
        <h3 className="text-lg font-semibold">Promociones Activas</h3>
        <p className="text-sm text-muted-foreground">Gestiona todas las promociones del sistema</p>
      </div>
      
      <Table>
        <TableHeader className="bg-muted/20">
          <TableRow className="hover:bg-transparent">
            <TableHead className="font-semibold text-foreground">Promoción</TableHead>
            <TableHead className="font-semibold text-foreground">Descuento</TableHead>
            <TableHead className="font-semibold text-foreground">Vigencia</TableHead>
            <TableHead className="font-semibold text-foreground">Destinatarios</TableHead>
            <TableHead className="font-semibold text-foreground">Estado</TableHead>
            <TableHead className="font-semibold text-right text-foreground">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {promotions.map((promotion) => (
            <TableRow key={promotion.id} className="hover:bg-muted/10 transition-colors">
              <TableCell className="font-medium">
                <div className="flex flex-col">
                  <span className="font-semibold">{promotion.title}</span>
                  <span className="text-sm text-muted-foreground line-clamp-1">{promotion.description}</span>
                </div>
              </TableCell>
              <TableCell>
                <span className="inline-flex items-center justify-center h-8 w-12 rounded-full bg-primary/10 text-primary font-semibold">
                  {promotion.discount}%
                </span>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-sm">{formatDate(promotion.endDate)}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(promotion.endDate) > new Date() ? 'Vigente' : 'Expirada'}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="capitalize">
                  {getTargetLabel(promotion.target).toLowerCase()}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <span className={`h-2 w-2 rounded-full mr-2 ${promotion.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                  <Badge variant={promotion.isActive ? 'default' : 'secondary'} className="capitalize">
                    {promotion.isActive ? 'Activa' : 'Inactiva'}
                  </Badge>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(promotion)}
                    className="h-8 w-8 p-0 hover:bg-muted/50"
                    title="Editar"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onSend(promotion.id)}
                    className="h-8 w-8 p-0 hover:bg-primary/10"
                    title="Enviar"
                  >
                    <Send className="h-4 w-4 text-primary" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(promotion.id)}
                    className="h-8 w-8 p-0 hover:bg-destructive/10 text-destructive hover:text-destructive"
                    title="Eliminar"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
