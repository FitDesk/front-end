// import { lazy } from 'react';
// import { RouteObject } from 'react-router';
// import { AdminRoute } from '@/shared/components/protected-routes';
// import { PageLoader } from '@/shared/components/page-loader';

// const TrainersPage = lazy(() => import('./pages/TrainersPage'));
// const TrainerFormPage = lazy(() => import('./pages/TrainerFormPage'));
// const TrainerDetailsPage = lazy(() => import('./pages/TrainerDetailsPage'));

// export const trainersRoutes: RouteObject[] = [
//   {
//     path: 'trainers',
//     element: (
//       <AdminRoute>
//         <TrainersPage />
//       </AdminRoute>
//     ),
//   },
//   {
//     path: 'trainers/nuevo',
//     element: (
//       <AdminRoute>
//         <PageLoader>
//           <TrainerFormPage />
//         </PageLoader>
//       </AdminRoute>
//     ),
//   },
//   {
//     path: 'trainers/editar/:id',
//     element: (
//       <AdminRoute>
//         <PageLoader>
//           <TrainerFormPage isEditMode />
//         </PageLoader>
//       </AdminRoute>
//     ),
//   },
//   {
//     path: 'trainers/:id',
//     element: (
//       <AdminRoute>
//         <PageLoader>
//           <TrainerDetailsPage />
//         </PageLoader>
//       </AdminRoute>
//     ),
//   },
// ];

// // Componente de carga para la página de listado de entrenadores
// export const TrainersRoutes = () => (
//   <PageLoader>
//     <TrainersPage />
//   </PageLoader>
// );

// // Componente de carga para la página de detalles de entrenador
// export const TrainerDetailsRoutes = () => (
//   <PageLoader>
//     <TrainerDetailsPage />
//   </PageLoader>
// );

// // Componente de carga para el formulario de entrenador
// export const TrainerFormRoutes = ({ isEdit = false }: { isEdit?: boolean }) => (
//   <PageLoader>
//     <TrainerFormPage isEditMode={isEdit} />
//   </PageLoader>
// );