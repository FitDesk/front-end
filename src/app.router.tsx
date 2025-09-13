import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router";
import { Login } from "./modules/shared/auth/login";
import { Register } from "./modules/shared/auth/register";
import { ForgotPassword } from "./modules/shared/auth/forgot-password";
import { PageLoader } from "./shared/components/page-loader";
// Importaciones de entrenadores y miembros
// Importación directa para evitar problemas con lazy loading
import { TrainersPage } from "./modules/admin/trainers/pages/TrainersPage";
import { TrainerFormPage } from "./modules/admin/trainers/pages/TrainerFormPage";
import { TrainerDetailsPage } from "./modules/admin/trainers/pages/TrainerDetailsPage";
import { MembersPage } from "./modules/admin/members/pages/MembersPage";
import { CreateMemberPage } from "./modules/admin/members/pages/CreateMemberPage";
import { MemberDetailsPage } from "./modules/admin/members/pages/MemberDetailsPage";
import { EditMemberPage } from "./modules/admin/members/pages/EditMemberPage";

//Admin
const AdminLayout = lazy(() => import("@/shared/layouts/AdminLayout"))
const DashboardPage = lazy(() => import("@/modules/admin/dashboard/DashboardPage"))
const PlansPage = lazy(() => import("@/modules/admin/plans/plans-page"))
const PromotionsPage = lazy(() => import("@/modules/admin/promotions/pages/promotions-page"))
const ClassesPage = lazy(() => import("@/modules/admin/classes/pages/classes-page"))
const LocationsPage = lazy(() => import("@/modules/admin/classes/pages/locations-page"))




//Trainer
const TrainerLayout = lazy(() => import("@/shared/layouts/TrainerLayout"))
const DashboardTrainer = lazy(() => import("@/modules/trainer/dashboard/DashboardTrainer"))
// Add other trainer pages as needed
const TrainerCalendarPage = lazy(() => import("@/modules/trainer/calendar/calendar-page"))
const TrainerAttendancePage = lazy(() => import("@/modules/trainer/attendance/attendance-page"))
const TrainerStudentsPage = lazy(() => import("@/modules/trainer/students/students-page"))






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
                path: "members",
                element: <Suspense fallback={<PageLoader />}><MembersPage /></Suspense>,
            },
            {
                path: "members/nuevo",
                element: <Suspense fallback={<PageLoader />}><CreateMemberPage /></Suspense>,
            },
            {
                path: "members/:id",
                element: <Suspense fallback={<PageLoader />}><MemberDetailsPage /></Suspense>,
            },
            {
                path: "members/editar/:id",
                element: <Suspense fallback={<PageLoader />}><EditMemberPage /></Suspense>,
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
    // Trainer Routes
    {
        path: "/trainer",
        element: (
            <Suspense fallback={<PageLoader />}>
                <TrainerLayout />
            </Suspense>
        ),
        children: [
            { index: true, element: <Navigate to="dashboard" replace /> },
            { 
                path: "dashboard", 
                element: <Suspense fallback={<PageLoader />}><DashboardTrainer /></Suspense> 
            },
            { 
                path: "calendar", 
                element: <Suspense fallback={<PageLoader />}><TrainerCalendarPage /></Suspense> 
            },
            { 
                path: "attendance", 
                element: <Suspense fallback={<PageLoader />}><TrainerAttendancePage /></Suspense> 
            },
            { 
                path: "students", 
                element: <Suspense fallback={<PageLoader />}><TrainerStudentsPage /></Suspense> 
            },
            // Add more trainer routes as needed
            { 
                path: "workouts", 
                element: <div className="p-6">Workouts Page</div> 
            },
            { 
                path: "nutrition", 
                element: <div className="p-6">Nutrition Page</div> 
            },
            { 
                path: "stats", 
                element: <div className="p-6">Stats Page</div> 
            },
            { 
                path: "messages", 
                element: <div className="p-6">Messages Page</div> 
            },
            { 
                path: "reports", 
                element: <div className="p-6">Reports Page</div> 
            },
            { 
                path: "profile", 
                element: <div className="p-6">Profile Page</div> 
            },
            { 
                path: "settings", 
                element: <div className="p-6">Settings Page</div> 
            },
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