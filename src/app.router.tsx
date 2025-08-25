import { Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router";

export const appRouter = createBrowserRouter([
    //Main
    {
        path: "/",
        // element:
        // children:[
        //     {index:true , element}
        // ]
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