// import React from 'react';
// import { Card } from '@/shared/components/ui/card';

// const blogPosts = [
// 	{
// 		title: 'Consejos para principiantes – Guía de ejercicios',
// 		category: 'Educación y Consejo',
// 		subcategory: 'Guía de ejercicios',
// 		description:
// 			'¿Estás buscando comenzar tu viaje de acondicionamiento físico con una rutina sencilla y efectiva? Esta guía te ayudará a construir una base sólida con ejercicios de fuerza y cardio ideales para principiantes.',
// 		image:
// 			'https://img.freepik.com/foto-gratis/hombre-guapo-entrenando-parque-verano_1157-20472.jpg',
// 	},
// 	{
// 		title: 'Alimentación saludable para potenciar tus entrenamientos',
// 		category: 'Nutrición',
// 		subcategory: 'Alimentación deportiva',
// 		description:
// 			'Tu rendimiento en el gimnasio depende tanto del entrenamiento como de lo que comes. Aprende qué alimentos consumir antes y después del ejercicio para maximizar tus resultados.',
// 		image:
// 			'https://img.freepik.com/foto-gratis/joven-feliz-filmando-su-episodio-video-blog_171337-5495.jpg',
// 	},
// 	{
// 		title: 'Ejercicios para adultos mayores',
// 		category: 'Educación y Consejo',
// 		subcategory: 'Guía de ejercicios',
// 		description:
// 			'La edad no es un límite para mantenerse saludable. Descubre rutinas adaptadas que mejoran la movilidad y fortalecen los músculos a cualquier edad.',
// 		image:
// 			'https://img.freepik.com/foto-gratis/mujer-que-ama-ejercicio-cardiovascular_329181-12905.jpg',
// 	},
// 	{
// 		title: 'Cómo crear tu rutina de entrenamiento perfecta',
// 		category: 'Planificación',
// 		subcategory: 'Rutinas',
// 		description:
// 			'Aprende a crear una rutina efectiva combinando fuerza, cardio y flexibilidad. Una buena planificación es el primer paso para lograr resultados duraderos.',
// 		image:
// 			'https://img.freepik.com/foto-gratis/vista-frontal-mujer-haciendo-deporte-estadisticas_23-2150040497.jpg',
// 	},
// ];

// const BlogPage: React.FC = () => {
// 	return (
// 		<div className="min-h-screen bg-background">
// 			{/* Header */}
// 			<div className="bg-gradient-to-r from-primary/20 to-background py-16">
// 				<div className="container mx-auto px-4">
// 					<h1 className="text-4xl md:text-6xl font-bold text-center mb-4">
// 						Blog de FitDesk
// 					</h1>
// 				</div>
// 			</div>

// 			{/* Blog Posts Grid */}
// 			<div className="container mx-auto px-4 py-16">
// 				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
// 					{blogPosts.map((post, index) => (
// 						<Card
// 							key={index}
// 							className="overflow-hidden hover:shadow-lg transition-shadow"
// 						>
// 							<img
// 								src={post.image}
// 								alt={post.title}
// 								className="w-full h-48 object-cover"
// 							/>
// 							<div className="p-6">
// 								<div className="flex gap-2 mb-4">
// 									<span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
// 										{post.category}
// 									</span>
// 									<span className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded">
// 										{post.subcategory}
// 									</span>
// 								</div>
// 								<h2 className="text-xl font-semibold mb-2">
// 									{post.title}
// 								</h2>
// 								<p className="text-muted-foreground line-clamp-3">
// 									{post.description}
// 								</p>
// 								<button className="mt-4 text-primary hover:underline">
// 									Leer más
// 								</button>
// 							</div>
// 						</Card>
// 					))}
// 				</div>
// 			</div>
// 		</div>
// 	);
// };

// export default BlogPage;
export default function BlogPage() {
	return null;
}
