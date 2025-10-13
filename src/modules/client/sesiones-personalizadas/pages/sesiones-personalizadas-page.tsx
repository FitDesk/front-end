// import { Badge } from '@/shared/components/ui/badge';
// import { User, Clock, Target, Trophy, CheckCircle, Star, Calendar } from 'lucide-react';
// import { motion } from 'motion/react';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
// import { Button } from '@/shared/components/ui/button';
// import { cn } from '@/core/lib/utils';

// export default function SesionesPersonalizadasPage() {
//     const entrenadores = [
//         {
//             id: 1,
//             nombre: "Carlos Mendoza",
//             especialidad: "Entrenamiento Funcional",
//             experiencia: "8 años",
//             certificaciones: ["ACSM", "NASM", "CrossFit L2"],
//             rating: 4.9,
//             sesiones: 150,
//             precio: "S/ 80",
//             imagen: "/api/placeholder/300/300",
//             disponible: true,
//             descripcion: "Especialista en entrenamiento funcional y rehabilitación deportiva."
//         },
//         {
//             id: 2,
//             nombre: "María Fernández",
//             especialidad: "Yoga & Pilates",
//             experiencia: "6 años",
//             certificaciones: ["RYT-500", "Pilates Comprehensive"],
//             rating: 4.8,
//             sesiones: 200,
//             precio: "S/ 70",
//             imagen: "/api/placeholder/300/300",
//             disponible: true,
//             descripcion: "Instructora certificada en yoga y pilates con enfoque terapéutico."
//         },
//         {
//             id: 3,
//             nombre: "Roberto Silva",
//             especialidad: "Musculación",
//             experiencia: "10 años",
//             certificaciones: ["NSCA", "Powerlifting Coach"],
//             rating: 4.9,
//             sesiones: 300,
//             precio: "S/ 90",
//             imagen: "/api/placeholder/300/300",
//             disponible: false,
//             descripcion: "Experto en musculación y preparación para competencias."
//         }
//     ];

//     const beneficios = [
//         {
//             icon: Target,
//             titulo: "Plan Personalizado",
//             descripcion: "Rutinas diseñadas específicamente para tus objetivos y nivel físico."
//         },
//         {
//             icon: User,
//             titulo: "Atención 1:1",
//             descripcion: "Sesiones individuales con seguimiento personalizado y corrección de técnica."
//         },
//         {
//             icon: Trophy,
//             titulo: "Resultados Garantizados",
//             descripcion: "Metodología probada con seguimiento de progreso y ajustes constantes."
//         },
//         {
//             icon: Clock,
//             titulo: "Horarios Flexibles",
//             descripcion: "Agenda tus sesiones según tu disponibilidad, incluso fines de semana."
//         }
//     ];

//     const handleReservarSesion = (entrenadorId: number) => {
//         console.log(`Reservando sesión con entrenador ID: ${entrenadorId}`);
//         // Aquí implementarás la lógica de reserva
//     };

//     return (
//         <div className="min-h-screen bg-background">
//             {/* Header Section */}
//             <div className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-background py-24">
//                 <div className="container mx-auto px-4">
//                     <div className="text-center">
//                         <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
//                             <User className="w-4 h-4 mr-2" />
//                             Entrena con Nosotros
//                         </Badge>
//                         <motion.h1
//                             initial={{ opacity: 0, y: 20 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             transition={{ duration: 0.6 }}
//                             className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-6"
//                         >
//                             Sesiones Personalizadas
//                         </motion.h1>
//                         <motion.p
//                             initial={{ opacity: 0, y: 20 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             transition={{ duration: 0.6, delay: 0.1 }}
//                             className="text-xl text-muted-foreground max-w-2xl mx-auto"
//                         >
//                             Entrena con instructores certificados en sesiones diseñadas 
//                             exclusivamente para ti y tus objetivos.
//                         </motion.p>
//                     </div>
//                 </div>
//             </div>

//             {/* Benefits Section */}
//             <div className="container mx-auto px-4 py-16">
//                 <div className="text-center mb-12">
//                     <h2 className="text-3xl font-bold mb-4">¿Por qué elegir sesiones personalizadas?</h2>
//                     <p className="text-muted-foreground max-w-2xl mx-auto">
//                         Maximiza tus resultados con un enfoque completamente personalizado
//                     </p>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
//                     {beneficios.map((beneficio, index) => (
//                         <motion.div
//                             key={index}
//                             initial={{ opacity: 0, y: 20 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             transition={{ duration: 0.5, delay: index * 0.1 }}
//                         >
//                             <Card className="text-center h-full">
//                                 <CardHeader>
//                                     <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
//                                         <beneficio.icon className="w-8 h-8 text-primary" />
//                                     </div>
//                                     <CardTitle className="text-xl">{beneficio.titulo}</CardTitle>
//                                 </CardHeader>
//                                 <CardContent>
//                                     <p className="text-muted-foreground">{beneficio.descripcion}</p>
//                                 </CardContent>
//                             </Card>
//                         </motion.div>
//                     ))}
//                 </div>
//             </div>

//             {/* Trainers Section */}
//             <div className="bg-secondary/20 py-16">
//                 <div className="container mx-auto px-4">
//                     <div className="text-center mb-12">
//                         <h2 className="text-3xl font-bold mb-4">Nuestros Entrenadores</h2>
//                         <p className="text-muted-foreground max-w-2xl mx-auto">
//                             Profesionales certificados con años de experiencia
//                         </p>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//                         {entrenadores.map((entrenador, index) => (
//                             <motion.div
//                                 key={entrenador.id}
//                                 initial={{ opacity: 0, y: 20 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                                 transition={{ duration: 0.5, delay: index * 0.1 }}
//                             >
//                                 <Card className={cn(
//                                     "h-full transition-all duration-300 hover:shadow-lg",
//                                     !entrenador.disponible && "opacity-60"
//                                 )}>
//                                     <CardHeader className="text-center">
//                                         <div className="relative mx-auto mb-4">
//                                             <img 
//                                                 src={entrenador.imagen} 
//                                                 alt={entrenador.nombre}
//                                                 className="w-24 h-24 rounded-full object-cover mx-auto"
//                                             />
//                                             {entrenador.disponible && (
//                                                 <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-background"></div>
//                                             )}
//                                         </div>
//                                         <CardTitle className="text-xl">{entrenador.nombre}</CardTitle>
//                                         <CardDescription className="text-primary font-medium">
//                                             {entrenador.especialidad}
//                                         </CardDescription>
//                                     </CardHeader>

//                                     <CardContent className="space-y-4">
//                                         <div className="flex items-center justify-center gap-4 text-sm">
//                                             <div className="flex items-center gap-1">
//                                                 <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
//                                                 <span className="font-medium">{entrenador.rating}</span>
//                                             </div>
//                                             <div className="flex items-center gap-1">
//                                                 <CheckCircle className="w-4 h-4 text-green-500" />
//                                                 <span>{entrenador.sesiones} sesiones</span>
//                                             </div>
//                                         </div>

//                                         <p className="text-sm text-muted-foreground text-center">
//                                             {entrenador.descripcion}
//                                         </p>

//                                         <div className="space-y-2">
//                                             <div className="flex items-center gap-2 text-sm">
//                                                 <Trophy className="w-4 h-4 text-muted-foreground" />
//                                                 <span>{entrenador.experiencia} de experiencia</span>
//                                             </div>
//                                             <div className="flex flex-wrap gap-1">
//                                                 {entrenador.certificaciones.map((cert, idx) => (
//                                                     <Badge key={idx} variant="outline" className="text-xs">
//                                                         {cert}
//                                                     </Badge>
//                                                 ))}
//                                             </div>
//                                         </div>

//                                         <div className="pt-4 border-t">
//                                             <div className="flex items-center justify-between mb-4">
//                                                 <span className="text-2xl font-bold text-primary">
//                                                     {entrenador.precio}
//                                                 </span>
//                                                 <span className="text-sm text-muted-foreground">
//                                                     por sesión
//                                                 </span>
//                                             </div>
//                                             <Button 
//                                                 onClick={() => handleReservarSesion(entrenador.id)}
//                                                 disabled={!entrenador.disponible}
//                                                 className="w-full"
//                                             >
//                                                 {entrenador.disponible ? (
//                                                     <>
//                                                         <Calendar className="w-4 h-4 mr-2" />
//                                                         Reservar Sesión
//                                                     </>
//                                                 ) : (
//                                                     "No Disponible"
//                                                 )}
//                                             </Button>
//                                         </div>
//                                     </CardContent>
//                                 </Card>
//                             </motion.div>
//                         ))}
//                     </div>
//                 </div>
//             </div>

//             {/* CTA Section */}
//             <div className="container mx-auto px-4 py-16">
//                 <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 text-center">
//                     <h2 className="text-3xl font-bold mb-4">
//                         ¿Listo para comenzar tu transformación?
//                     </h2>
//                     <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
//                         Agenda tu primera sesión de evaluación gratuita y descubre cómo podemos ayudarte 
//                         a alcanzar tus objetivos fitness.
//                     </p>
//                     <div className="flex flex-col sm:flex-row gap-4 justify-center">
//                         <Button size="lg" className="bg-primary hover:bg-primary/90">
//                             Sesión de Evaluación Gratuita
//                         </Button>
//                         <Button size="lg" variant="outline">
//                             Conocer Más
//                         </Button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }
// export default BlogPage;
export default function SesionesPersonalizadasPage() {
	return null;
}
