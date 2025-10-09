import { AxiosError } from "axios";
import { fitdeskApi } from "../api/fitdeskApi";
import type { AuthAccess, AuthRequestLogin, AuthRequestRegister, AuthResponse } from "../interfaces/auth.interface";

export const AuthService = {
    async login(credentials: AuthRequestLogin): Promise<AuthResponse> {
        try {
            const { data } = await fitdeskApi.post<AuthResponse>(
                "/security/auth/login", credentials
            );
            return data;
        } catch (error) {
            throw new Error(`Error al iniciar sesión: ${error instanceof Error ? error.message : String(error)}`);
        }
    },
    async me(): Promise<AuthAccess> {
        try {
            const { data } = await fitdeskApi.get<AuthAccess>("/security/auth/me")
            return data;
        } catch (error) {
            throw new Error(`Error al traer al usuario ${error}`)
        }
    },

    async refresh(): Promise<AuthResponse> {
        try {
            const { data } = await fitdeskApi.post<AuthResponse>("/security/auth/refresh")
            return data;
        } catch (error: unknown) {
            if (error instanceof AxiosError && error.response?.status === 401) {
                throw new Error("[401] No ha iniciado sesión, intente iniciar sesión");
            }
            throw new Error(`Error al refrescar el token: ${error}`);
        }
    },
    async register(registrationData: AuthRequestRegister): Promise<AuthResponse> {
        try {
            const { data } = await fitdeskApi.post<AuthResponse>(
                "/security/auth/register", registrationData
            );
            return data;
        } catch (error) {
            throw new Error(`Error al registrarse: ${error instanceof Error ? error.message : String(error)}`);
        }
    },
    async logout(): Promise<AuthResponse> {
        try {
            const { data } = await fitdeskApi.post<AuthResponse>("/security/auth/logout")
            return data;
        } catch (error) {
            throw new Error(`Error al cerrar sesión: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
};


