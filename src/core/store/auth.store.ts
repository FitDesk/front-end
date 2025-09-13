import { create, type StateCreator } from 'zustand';
import { devtools, persist } from 'zustand/middleware'
import { AuthService } from '../services/auth.service';
import type { AuthRequestLogin, UserLogin } from '../interfaces/auth.interface';


type AuthStatus = 'authenticated' | 'not-authenticated' | 'checking'

interface AuthStore {

    authStatus: AuthStatus
    user: UserLogin | null
    isUser: () => boolean,
    isAdmin: () => boolean
    isTrainer: () => boolean
    logout: () => Promise<void>
    login: (form: AuthRequestLogin) => Promise<void>;
    checkAuthStatus: () => Promise<boolean>
}


const authAPI: StateCreator<AuthStore> = (set, get) => ({
    authStatus: 'checking',
    user: null,
    isUser: () => {
        const user = get().user
        return !!user?.roles.some(r => String(r.name).toUpperCase().includes("USER"));
    },
    isAdmin: () => {
        const user = get().user;
        return !!user?.roles.some(r => String(r.name).toUpperCase().includes("ADMIN"))
    },
    isTrainer: () => {
        const user = get().user
        return !!user?.roles.some(r => String(r.name).toUpperCase().includes("TRAINER"))
    },
    login: async (form: AuthRequestLogin) => {
        set({ authStatus: 'checking' })
        try {
            const data = await AuthService.login(form)
            if (data.success) {
                set({ user: data.user, authStatus: 'authenticated' })
            } else {
                set({ user: null, authStatus: 'not-authenticated' })
            }
        } catch (_) {
            set({ user: null, authStatus: 'not-authenticated' })
        }
    },
    logout: async () => {
        try {
            await AuthService.logout()
            // biome-ignore lint/suspicious/noEmptyBlockStatements: <>
        } catch (_) {

        } finally {
            set({ authStatus: 'not-authenticated', user: null })
        }
    },
    checkAuthStatus: async () => {
        set({ authStatus: 'checking' })

        try {
            const data = await AuthService.refresh()
            if (data.user) {
                set({ authStatus: 'authenticated', user: data.user })
                return true;
            } else {
                set({ authStatus: 'not-authenticated', user: null })
                return false;
            }
        } catch (_) {
            set({ authStatus: 'not-authenticated', user: null })
            return false;
        }
    }
})

export const useAuthStore = create<AuthStore>()(
    persist(
        devtools(
            authAPI
        )
        , {
            name: "fitdesk-user",
            partialize: (state) => ({ user: state.user })
        }
    )
)