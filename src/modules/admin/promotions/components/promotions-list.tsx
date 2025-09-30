import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Pencil, Send, Trash2, Gift, Calendar, Users, Percent, ImageOff } from 'lucide-react';
import type { Promotion } from '../types/promotion';
import { cn } from '@/core/lib/utils';
import { Skeleton } from '@/shared/components/ui/skeleton';

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
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-40 w-full rounded-none" />
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2 mt-2" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-24" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (promotions.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Promociones</h2>
          <p className="text-muted-foreground">
            Gestiona todas las promociones del sistema
          </p>
        </div>
        <div className="rounded-lg border-2 border-dashed p-12 text-center">
          <div className="flex flex-col items-center justify-center space-y-3">
            <Gift className="h-14 w-14 text-muted-foreground" />
            <h3 className="text-xl font-medium">No hay promociones</h3>
            <p className="text-muted-foreground max-w-md">
              Aún no has creado ninguna promoción. Crea tu primera promoción para empezar a ofrecer descuentos especiales a tus clientes.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Promociones</h2>
          <p className="text-muted-foreground">
            Gestiona todas las promociones del sistema
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {promotions.map((promotion) => (
          <Card 
            key={promotion.id} 
            className={cn(
              'group overflow-hidden transition-all hover:shadow-lg',
              !promotion.isActive && 'opacity-80 hover:opacity-90',
              'flex flex-col h-full'
            )}
          >
            {/* Image Section */}
            <div className="relative h-48 overflow-hidden">
              {promotion.imageUrl ? (
                <>
                  <img
                    src={promotion.imageUrl}
                    alt={promotion.title}
                    className={cn(
                      'w-full h-full object-cover transition-transform duration-500 group-hover:scale-105',
                      !promotion.isActive && 'opacity-70'
                    )}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = 'https://via.placeholder.com/800x400?text=Promoción+no+disponible';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="bg-background/80 backdrop-blur-sm hover:bg-background"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(promotion.imageUrl, '_blank');
                      }}
                    >
                      Ver imagen completa
                    </Button>
                  </div>
                </>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/5 to-primary/10 flex flex-col items-center justify-center text-muted-foreground p-6 text-center">
                  <ImageOff className="h-10 w-10 mb-2 opacity-50" />
                  <span className="text-sm">Sin imagen</span>
                </div>
              )}
              
              {/* Status Badge */}
              <div className="absolute top-3 right-3">
                <Badge 
                  variant={promotion.isActive ? 'default' : 'secondary'} 
                  className={cn(
                    'capitalize font-medium',
                    !promotion.isActive && 'bg-gray-100 text-gray-700 border border-gray-200',
                    'shadow-sm'
                  )}
                >
                  {promotion.isActive ? 'Activa' : 'Inactiva'}
                </Badge>
              </div>
            </div>
            
            {/* Card Content */}
            <div className="flex-1 flex flex-col p-5">
              <CardHeader className="p-0 pb-3">
                <div className="flex justify-between items-start gap-3">
                  <CardTitle className="text-lg font-semibold line-clamp-2 leading-tight">
                    {promotion.title}
                  </CardTitle>
                  <div className="flex flex-col items-end gap-1">
                    <Badge 
                      variant="secondary" 
                      className="flex items-center gap-1 bg-primary/10 text-primary font-semibold whitespace-nowrap"
                    >
                      <Percent className="h-3.5 w-3.5" />
                      {promotion.discount}% OFF
                    </Badge>
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-medium text-muted-foreground line-through">
                        ${promotion.price.toFixed(2)}
                      </span>
                      <span className="text-lg font-bold text-foreground">
                        ${(promotion.price * (1 - promotion.discount / 100)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
                {promotion.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {promotion.description}
                  </p>
                )}
              </CardHeader>

              <CardContent className="flex-1 p-0 py-3 space-y-2.5">
                <div className="flex items-start text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Vigencia</p>
                    <p>Hasta el {formatDate(promotion.endDate)}</p>
                  </div>
                </div>
                
                <div className="flex items-start text-sm text-muted-foreground">
                  <Users className="h-4 w-4 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Destinatarios</p>
                    <p>{getTargetLabel(promotion.target)}</p>
                  </div>
                </div>
                
                {promotion.code && (
                  <div className="pt-2">
                    <p className="text-xs text-muted-foreground mb-1.5">Código de descuento</p>
                    <div className="flex items-center">
                      <code className="bg-muted px-3 py-1.5 rounded-md text-sm font-mono flex-1 text-center">
                        {promotion.code}
                      </code>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 ml-1 text-muted-foreground hover:text-foreground"
                        onClick={() => {
                          navigator.clipboard.writeText(promotion.code || '');
                         
                        }}
                        title="Copiar código"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-copy">
                          <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                        </svg>
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>

              <CardFooter className="p-0 pt-3 mt-auto">
                <div className="flex justify-end gap-2 w-full">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onEdit(promotion)}
                    className="h-9 px-3"
                  >
                    <Pencil className="h-4 w-4 mr-1.5" />
                    Editar
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm" 
                    onClick={(e) => {
                      e.stopPropagation();
                      onSend(promotion.id);
                    }}
                    className="h-9 px-3"
                    title="Enviar promoción a los destinatarios"
                  >
                    <Send className="h-4 w-4 mr-1.5" />
                    Enviar
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(promotion.id);
                    }}
                    className="h-9 w-9 text-destructive hover:text-destructive hover:bg-destructive/10"
                    title="Eliminar"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
