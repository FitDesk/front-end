import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router";
import { Login } from "./modules/shared/auth/login";
import { Register } from "./modules/shared/auth/register";
import { ForgotPassword } from "./modules/shared/auth/forgot-password";
import { PageLoader } from "./shared/components/page-loader";
// Importaciones de entrenadores
// Importación directa para evitar problemas con lazy loading
import { TrainersPage } from "./modules/admin/trainers/pages/TrainersPage";
import { TrainerFormPage } from "./modules/admin/trainers/pages/TrainerFormPage";
import { TrainerDetailsPage } from "./modules/admin/trainers/pages/TrainerDetailsPage";

//Admin
const AdminLayout = lazy(() => import("@/shared/layouts/AdminLayout"))
const DashboardPage = lazy(() => import("@/modules/admin/dashboard/DashboardPage"))
const PlansPage = lazy(() => import("@/modules/admin/plans/plans-page"))
const PromotionsPage = lazy(() => import("@/modules/admin/promotions/pages/promotions-page"))
const ClassesPage = lazy(() => import("@/modules/admin/classes/pages/classes-page"))
const LocationsPage = lazy(() => import("@/modules/admin/classes/pages/locations-page"))
//Trainer

//Client
const ClientLayout = lazy(() => import("@/shared/layouts/ClientLayout"))
const LandingPage = lazy(() => import("@/modules/client/landing/landing-page"))

//Auth
const AuthLayout = lazy(() => import("@/shared/layouts/AuthLayout"))
export const appRouter = createBrowserRouter([
    //Main
    {
        path: "/",
        element: (
            <Suspense fallback={<PageLoader />} >
                <ClientLayout />
            </Suspense>
        ),
        children: [
            { index: true, element: <Suspense><LandingPage /></Suspense> }
        ]
    },
    {
        path: "/auth",
        element: (
            // <NotAuthenticatedRoute>
                <Suspense fallback={<PageLoader />}>
                    <AuthLayout />
                </Suspense>
            // </NotAuthenticatedRoute>
        ),
        children: [
            { index: true, element: <Suspense><Login /></Suspense> },
            { path: "register", element: <Suspense><Register /></Suspense> },
            { path: "forgot-password", element: <Suspense><ForgotPassword /></Suspense> }
        ]
    },
    {
        path: "/trainer",
        element: (
            <Suspense>
                {/* <TrainerRoute> */}
                    <div>Dashboard trainer</div>
                {/* </TrainerRoute> */}
            </Suspense>
        )
    },
    {
        path: "/admin",
        element: (
            // <AdminRoute>
                <Suspense fallback={<PageLoader />}>
                    <AdminLayout />
                </Suspense>
            // </AdminRoute>
        ),
        children: [
            { index: true, element: <Suspense fallback={<PageLoader />}><DashboardPage /></Suspense> },
            { 
                path: "plans",
                element: <Suspense fallback={<PageLoader />}><PlansPage /></Suspense>
            },
            {
                path: "promotions",
                element: <Suspense fallback={<PageLoader />}><PromotionsPage /></Suspense>
            },
            {
                path: "classes",
                element: <Suspense fallback={<PageLoader />}><ClassesPage /></Suspense>
            },
            {
                path: "locations",
                element: <Suspense fallback={<PageLoader />}><LocationsPage /></Suspense>
            },
            {
                path: "trainers",
                element: <Suspense fallback={<PageLoader />}><TrainersPage /></Suspense>,
            },
            {
                path: "trainers/nuevo",
                element: <Suspense fallback={<PageLoader />}><TrainerFormPage /></Suspense>,
            },
            {
                path: "trainers/editar/:id",
                element: <Suspense fallback={<PageLoader />}><TrainerFormPage isEditMode /></Suspense>,
            },
            {
                path: "trainers/:id",
                element: <Suspense fallback={<PageLoader />}><TrainerDetailsPage /></Suspense>,
            }
        ]
    },
    {
        path: '*',
        element: (
            <Suspense fallback={null}>
                <Navigate to="/" replace />
            </Suspense>
        )
    }
])