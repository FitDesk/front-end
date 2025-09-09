import { Check, Star, Tag } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';

const cn = (...classes: (string | undefined)[]) => classes.filter(Boolean).join(' ');
import type { Plan, Promotion } from './plans-columns';


const PromotionBadge = ({ promotion }: { promotion: Promotion }) => {
  const isActive = promotion.isActive && 
    new Date(promotion.startDate) <= new Date() && 
    new Date(promotion.endDate) >= new Date();

  if (!isActive) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Badge variant="outline" className="mt-2 bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 cursor-pointer">
          <Tag className="w-3 h-3 mr-1" />
          {promotion.discount}% OFF
        </Badge>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-2">
          <h4 className="font-medium leading-none">{promotion.title}</h4>
          <p className="text-sm text-muted-foreground">{promotion.description}</p>
          <div className="flex items-center pt-2">
            <span className="text-xs text-muted-foreground">
              Válido hasta: {new Date(promotion.endDate).toLocaleDateString()}
            </span>
            {promotion.code && (
              <Badge variant="outline" className="ml-auto">
                Código: {promotion.code}
              </Badge>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

type PlanCardProps = {
  plan: Plan;
  onEdit: (plan: Plan) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
};

export function PlanCard({ plan, onEdit, onDelete, isDeleting }: PlanCardProps) {
  return (
    <Card className={cn(
      "relative overflow-hidden transition-all hover:shadow-lg",
      plan.isPopular ? "border-2 border-amber-400 dark:border-amber-500" : "border-border/50"
    )}>
      {/* Popular Badge */}
      {plan.isPopular && (
        <div className="absolute top-0 right-0 bg-gradient-to-r from-amber-400 to-amber-500 text-white text-xs font-bold px-4 py-1 rounded-bl-lg flex items-center">
          <Star className="w-3 h-3 mr-1" />
          POPULAR
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-2">
          <div>
            <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
            <CardDescription className="mt-1">{plan.description}</CardDescription>
          </div>
          <Badge variant={plan.isActive ? 'default' : 'secondary'} className="shrink-0">
            {plan.isActive ? 'Activo' : 'Inactivo'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pb-4">
        <div className="space-y-4">
          <div className="space-y-1">
            <div className="flex items-end">
              <span className="text-3xl font-bold">
                ${plan.price.toFixed(2)}
              </span>
              <span className="text-muted-foreground ml-2">
                /{plan.duration} {plan.duration === 1 ? 'mes' : 'meses'}
              </span>
            </div>
            {plan.promotions?.map((promo) => (
              <PromotionBadge key={promo.id} promotion={promo} />
            ))}
          </div>
          
          {plan.promotions && plan.promotions.length > 0 && (
            <div className="text-sm text-muted-foreground">
              <span className="line-through">${(plan.price / (1 - (plan.promotions[0].discount / 100))).toFixed(2)}</span>
              <span className="ml-2 text-amber-600 dark:text-amber-400">
                {plan.promotions[0].discount}% de descuento
              </span>
            </div>
          )}

          {plan.features?.length > 0 && (
            <div className="space-y-3 pt-2">
              <h4 className="font-medium text-sm text-muted-foreground">INCLUYE:</h4>
              <ul className="space-y-2">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-3 border-t pt-4">
        <div className="w-full flex gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onEdit(plan)}
            className="flex-1"
          >
            Editar Plan
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onDelete(plan.id)}
            disabled={isDeleting}
            className="text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive flex-1"
          >
            {isDeleting ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
