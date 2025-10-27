import { useEffect } from "react";
import { motion } from "motion/react";
import {
    Shield,
    Calendar,
    CreditCard,
    CheckCircle,
    Users,
    ArrowRight,
    ArrowUpCircle,
} from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { useMyMembership } from "./useMembershipQuery";
import { useMembershipStore } from "./store/useMembershipState";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useNavigate } from "react-router";

export const MembershipPage = () => {
    const { data: membership, isLoading, isError, error } = useMyMembership();
    const setMembership = useMembershipStore((state) => state.setMembership);
    const navigate = useNavigate();
  const setIsUpgrade = useMembershipStore((state) => state.setIsUpgrade);
    useEffect(() => {
        if (membership) {
            setMembership(membership);
            console.log("Membresía cargada:", membership);
        }
    }, [membership, setMembership]);

    const formatDate = (dateString?: string) => {
        if (!dateString) {
            return "Fecha no disponible";
        }
        try {
            return format(new Date(dateString), "d 'de' MMMM, yyyy", { locale: es });
        } catch {
            return "Fecha no disponible";
        }
    };

    if (isLoading) {
        return (
            <div className="container max-w-6xl mx-auto p-6 space-y-8">
                <div className="space-y-2">
                    <Skeleton className="h-12 w-3/4" />
                    <Skeleton className="h-6 w-1/2" />
                </div>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-1/3" />
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <Skeleton className="h-32 w-full" />
                        <div className="grid gap-4 md:grid-cols-3">
                            <Skeleton className="h-24 w-full" />
                            <Skeleton className="h-24 w-full" />
                            <Skeleton className="h-24 w-full" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (isError || !membership) {
        return (
            <div className="container max-w-6xl mx-auto p-6">
                <Card className="border-destructive/30 bg-destructive/10">
                    <CardHeader>
                        <CardTitle className="text-destructive">
                            No cuenta con una membresia activa
                        </CardTitle>
                        <CardDescription>
                            {error instanceof Error
                                ? error.message
                                : "Ocurrió un error al cargar los datos de tu membresía"}
                        </CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button onClick={() => navigate("/#pricing-section")}>
                            Adquirir membresía
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return (
        <div className="container max-w-6xl mx-auto p-6 space-y-8">
            {/* Encabezado */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-2"
            >
                <h1 className="text-3xl font-bold tracking-tight">Tu Membresía</h1>
                <p className="text-muted-foreground">
                    Detalles de tu plan activo y beneficios
                </p>
            </motion.div>

            {/* Tarjeta de membresía */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                <Card className="border shadow-md bg-gradient-to-br from-orange-500/5 to-red-500/5">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-2xl">
                                {membership.planName}
                            </CardTitle>
                            <Badge
                                variant="outline"
                                className="bg-green-100 text-green-800 border-green-200"
                            >
                                <CheckCircle className="mr-1 h-3 w-3" />
                                Activo
                            </Badge>
                        </div>
                        <CardDescription className="mt-2">
                            {membership.daysRemaining} días restantes de membresía
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Información de membresía */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-6 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 text-white">
                            <div className="space-y-1 mb-4 sm:mb-0">
                                <h3 className="font-medium">Miembro desde</h3>
                                <p className="text-xl font-bold">
                                    {formatDate(membership.startDate)}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-medium">Vigente hasta</h3>
                                <p className="text-xl font-bold">
                                    {formatDate(membership.endDate)}
                                </p>
                            </div>
                        </div>

                        {/* Estadísticas/Beneficios */}
                        <div className="grid gap-4 md:grid-cols-3">
                            <Card className="bg-muted/40">
                                <CardContent className="p-6 flex items-center gap-4">
                                    <div className="rounded-full p-3 bg-orange-500/10 text-orange-500">
                                        <Calendar className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium">
                                            {membership.durationMonths} meses
                                        </h3>
                                        <p className="text-sm text-muted-foreground">Duración</p>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="bg-muted/40">
                                <CardContent className="p-6 flex items-center gap-4">
                                    <div className="rounded-full p-3 bg-green-500/10 text-green-500">
                                        <CreditCard className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium">
                                            {new Intl.NumberFormat("es-PE", {
                                                style: "currency",
                                                currency: "PEN",
                                            }).format(membership.amountPaid ?? 0)}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            Inversión total
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="bg-muted/40">
                                <CardContent className="p-6 flex items-center gap-4">
                                    <div className="rounded-full p-3 bg-blue-500/10 text-blue-500">
                                        <Users className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium">Acceso completo</h3>
                                        <p className="text-sm text-muted-foreground">
                                            A todas las instalaciones
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t border-border/40 p-6 bg-muted/30">
                        <div className="text-sm text-muted-foreground">
                            <p>ID de membresía: {membership.paymentId.substring(0, 8)}</p>
                        </div>
                        <Button
                            variant="default"
                            className="gap-2 bg-green-600 hover:bg-green-700"
                            onClick={() => {
                                setIsUpgrade(true); 
                                navigate("/#pricing-section");
                            }
                            }
                        >
                            <ArrowUpCircle className="h-4 w-4" />
                            Cambiar de Plan
                        </Button>
                        <Button
                            variant="outline"
                            className="gap-2"
                            onClick={() => navigate("/dashboard")}
                        >
                            Ir al Dashboard
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </CardFooter>
                </Card>
            </motion.div>

            {/* Beneficios o características adicionales - Si tienes features en el plan */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-orange-500" />
                            Beneficios de tu membresía
                        </CardTitle>
                        <CardDescription>
                            Con tu membresía activa tienes acceso a estos beneficios
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="grid gap-3 md:grid-cols-2">
                            <li className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-green-500" />
                                <span>Acceso completo al gimnasio</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-green-500" />
                                <span>Uso ilimitado de equipos</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-green-500" />
                                <span>Acceso a clases grupales</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-green-500" />
                                <span>Soporte con entrenadores</span>
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default MembershipPage;
