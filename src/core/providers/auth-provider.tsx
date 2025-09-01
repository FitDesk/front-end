import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../store/auth.store";
import { PageLoader } from "@/shared/components/page-loader";
import type { PropsWithChildren } from "react";

export const CheckAuthProvider = ({ children }: PropsWithChildren) => {
    const { checkAuthStatus } = useAuthStore()

    const { isLoading } = useQuery({
        queryKey: ['auth'],
        queryFn: checkAuthStatus,
        retry: false,
        refetchInterval: 1000 * 60 * 1.5,
        refetchOnWindowFocus: true
    })
    if (isLoading) return <PageLoader />

    return children;
}