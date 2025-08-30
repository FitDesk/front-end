import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router";
import { Login } from "./modules/shared/auth/login";
import { Register } from "./modules/shared/auth/register";
import { ForgotPassword } from "./modules/shared/auth/forgot-password";

const PageLoader = () => <div className="">Cargando</div>

//Admin
const AdminLayout = lazy(() => import("@/shared/layouts/AdminLayout"))
const DashboardPage = lazy(() => import("@/modules/admin/dashboard/DashboardPage"))
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
            <Suspense fallback={<PageLoader />}>
                <AuthLayout />
            </Suspense>
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
            <Suspense fallback={<PageLoader />}>
                <AdminLayout />
            </Suspense>
        ),
        children: [
            { index: true, element: <Suspense fallback={<PageLoader />}><DashboardPage /></Suspense> }
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