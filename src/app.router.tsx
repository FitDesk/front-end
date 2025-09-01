import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router";
import { Login } from "./modules/shared/auth/login";
import { Register } from "./modules/shared/auth/register";
import { ForgotPassword } from "./modules/shared/auth/forgot-password";
import { PageLoader } from "./shared/components/page-loader";
// import { AdminRoute, NotAuthenticatedRoute, TrainerRoute } from "./shared/components/protected-routes";


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