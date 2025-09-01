import { create, type StateCreator } from 'zustand';
import { devtools } from 'zustand/middleware'


type AuthStatus = 'authenticated' | 'not-authenticated' | 'checking'

interface AuthStore {

    authStatus: AuthStatus

    isAdmin: () => boolean
    isTrainer: () => boolean
    logout: () => void

    checkAuthStatus: () => Promise<boolean>
}


const authAPI: StateCreator<AuthStore> = (set) => ({
    authStatus: 'checking',
    isAdmin: () => {
        return false
    },
    isTrainer: () => {
        return false
    },
    logout: () => {
        return false;
    },
    checkAuthStatus: async () => {
        return false;
    }
})

export const useAuthStore = create<AuthStore>()(
    devtools(
        authAPI
    )
)