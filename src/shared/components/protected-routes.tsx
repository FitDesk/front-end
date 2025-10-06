import { useAuthStore } from "@/core/store/auth.store"
import type { PropsWithChildren } from "react"
import { Navigate } from "react-router";

export const AuthenticatedRoute = ({ children }: PropsWithChildren) => {
    const { authStatus } = useAuthStore()

    if (authStatus === 'checking') return null;

    if (authStatus === 'not-authenticated') return <Navigate to={"/"} />

    return children;

}

export const NotAuthenticatedRoute = ({ children }: PropsWithChildren) => {
    const { authStatus } = useAuthStore();
    if (authStatus === 'checking') return null;

    if (authStatus === 'authenticated') return <Navigate to="/" />;

    return children;
};

export const AdminRoute = ({ children }: PropsWithChildren) => {
    const { authStatus, isAdmin } = useAuthStore();
    console.log("Auth status: ", authStatus)
    console.log("Es admin ", isAdmin())
    if (authStatus === 'checking') return null;

    if (authStatus === 'not-authenticated') return <Navigate to="/auth/login" />;

    if (!isAdmin()) return <Navigate to="/" />;

    return children;
};

export const TrainerRoute = ({ children }: PropsWithChildren) => {
    const { authStatus, isTrainer } = useAuthStore();

    if (authStatus === 'checking') return null;

    if (authStatus === 'not-authenticated') return <Navigate to="/auth/login" />;

    if (!isTrainer()) return <Navigate to="/" />;

    return children;
};