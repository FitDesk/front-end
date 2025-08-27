import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router";
import Home from "./Home";
import About from "./About";

const PageLoader = () => <div className="">Cargando</div>

//Admin
const AdminLayout = lazy(() => import("@/shared/layouts/AdminLayout"))
const DashboardPage = lazy(() => import("@/modules/admin/dashboard/DashboardPage"))
//Trainer

//Client

export const appRouter = createBrowserRouter([
    //Main
    {
        path: "/",
        element: (
            <Home />
        )
        // element:
        // children:[
        //     {index:true , element}
        // ]
    },
    {
        path: "/about",
        element: <About />
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