import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Clock, MapPin, Users, Calendar } from 'lucide-react';
import { cn } from '@/core/lib/utils';

interface ClassCardProps {
    id: string;
    nombre: string;
    instructor: string;
    horario: string;
    fecha: string;
    capacidad: number;
    inscritos: number;
    ubicacion: string;
    estado: 'disponible' | 'lleno' | 'cancelado';
    onReservar: (id: string) => void;
}

export const ClassCard = ({
    id,
    nombre,
    instructor,
    horario,
    fecha,
    capacidad,
    inscritos,
    ubicacion,
    estado,
    onReservar
}: ClassCardProps) => {
    const getEstadoBadge = () => {
        switch (estado) {
            case 'disponible':
                return <Badge className="bg-green-500 hover:bg-green-600">Disponible</Badge>;
            case 'lleno':
                return <Badge variant="destructive">Lleno</Badge>;
            case 'cancelado':
                return <Badge variant="secondary">Cancelado</Badge>;
            default:
                return null;
        }
    };

    const getButtonText = () => {
        switch (estado) {
            case 'disponible':
                return 'Reservar';
            case 'lleno':
                return 'Lista de espera';
            case 'cancelado':
                return 'Cancelado';
            default:
                return 'Reservar';
        }
    };

    return (
        <Card className={cn(
            "transition-all duration-300 hover:shadow-md",
            estado === 'cancelado' && "opacity-60"
        )}>
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle className="text-lg font-semibold">{nombre}</CardTitle>
                        <CardDescription className="text-sm text-muted-foreground">
                            {instructor}
                        </CardDescription>
                    </div>
                    {getEstadoBadge()}
                </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>{horario}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>{fecha}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span>{inscritos}/{capacidad}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>{ubicacion}</span>
                    </div>
                </div>
                
                <Button 
                    onClick={() => onReservar(id)}
                    disabled={estado === 'cancelado'}
                    variant={estado === 'disponible' ? 'default' : 'outline'}
                    className="w-full"
                >
                    {getButtonText()}
                </Button>
            </CardContent>
        </Card>
    );
};
