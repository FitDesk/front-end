import { useMutation } from "@tanstack/react-query"
import { AuthService } from "../services/auth.service"
import { useAuthStore } from "../store/auth.store"

export const useAuth = () => {
    const loginMutation = useMutation({
        mutationFn: AuthService.login,
        onSuccess: (data) => {
            if (data.success) {
                useAuthStore.setState({ user: data.user, authStatus: 'authenticated' })
            } else {
                useAuthStore.setState({ user: null, authStatus: 'not-authenticated' })
            }
        },
        onError: () => {
            useAuthStore.setState({ user: null, authStatus: 'not-authenticated' })
        }
    })

    return {
        loginMutation
    }

}
