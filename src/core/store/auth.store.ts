import {create, type StateCreator} from 'zustand';
import {devtools, persist} from 'zustand/middleware'
import {AuthService} from '../services/auth.service';
import type {AuthRequestLogin, UserLogin} from '../interfaces/auth.interface';


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
        return !!user?.roles.some((r) => r === 'USER');
    },
    isAdmin: () => {
        const user = get().user;
        return !!user?.roles.some(r => r === "ADMIN")
    },
    isTrainer: () => {
        const user = get().user
        return !!user?.roles.some(r => r === "TRAINER")
    },
    login: async (form: AuthRequestLogin) => {
        set({authStatus: 'checking'})
        try {
            const loginData = await AuthService.login(form)
            if (loginData.success) {
                const meData = await AuthService.me();
                const roles = meData.authorities.filter(auth => auth.authority.startsWith("ROLE_"))
                    .map(auth => auth.authority.replace("ROLE_", ""));
                console.log("Roles del usuario:", roles);
                const user: UserLogin = {
                    email: meData.email,
                    roles,
                }

                set({user: user, authStatus: 'authenticated'})
                console.log("Estado actualizado de store user ", get().user)
            } else {
                set({user: null, authStatus: 'not-authenticated'})
            }
        } catch (_) {
            set({user: null, authStatus: 'not-authenticated'})
        }
    },
    logout: async () => {
        try {
            await AuthService.logout()
            // biome-ignore lint/suspicious/noEmptyBlockStatements: <>
        } catch (_) {

        } finally {
            set({authStatus: 'not-authenticated', user: null})
        }
    },
    checkAuthStatus: async () => {
        set({authStatus: 'checking'})

        try {
            const data = await AuthService.refresh()
            if (data.success) {
                const meData = await AuthService.me();
                const roles = meData.authorities.filter(auth => auth.authority.startsWith("ROLE_"))
                    .map(auth => auth.authority.replace("ROLE_", ""));
                console.log("Roles del usuario:", roles);
                const user: UserLogin = {
                    email: meData.email,
                    roles,
                }

                set({authStatus: 'authenticated', user})
                return true;
            } else {
                set({authStatus: 'not-authenticated', user: null})
                return false;
            }
        } catch (error) {
            console.error("Error en chechAuthStatus : ", error)
            if (get().authStatus !== 'authenticated') {
                set({authStatus: 'not-authenticated', user: null})
            }
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
            // partialize: (state) => ({user: state.user})
        }
    )
)

