import { Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router";
import Home from "./Home";
import About from "./About";

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
    }, {
        path: "/about",
        element: <About />
    },
    {
        path: '*',
        element: (
            <Suspense fallback={null}>
                <Navigate to="/" />
            </Suspense>
        )
    }
])