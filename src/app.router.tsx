import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router";
import Home from "./Home";
import About from "./About";


const AdminLayout = lazy(() => import("@/shared/layouts/AdminLayout"))


const PageLoader = () => <div className="">Cargando</div>

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
            { index: true }
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