import { fitdeskApi } from "../api/fitdeskApi";
import type { AuthAccess, AuthRequestLogin, AuthRequestRegister, AuthResponse } from "../interfaces/auth.interface";

export const AuthService = {
    async login(credentials: AuthRequestLogin): Promise<AuthResponse> {
        try {
            const { data } = await fitdeskApi.post<AuthResponse>(
                "/security/auth/login",
                {
                    email: credentials.email,
                    password: credentials.password
                }
            );
            console.log("Data for login ", data);
            return data;
        } catch (error) {
            throw new Error(`Error al iniciar sesión: ${error instanceof Error ? error.message : String(error)}`);
        }
    },
    async me(): Promise<AuthAccess> {
        try {
            const { data } = await fitdeskApi.get<AuthAccess>("/security/auth/me")
            console.log("Trayendo informacion del usuario")
            return data;
        } catch (error) {
            throw new Error(`Error al traer al usuario ${error}`)
        }
    },

       async refresh(): Promise<AuthResponse> {
        try {
            const { data } = await fitdeskApi.post<AuthResponse>("/security/auth/refresh")
            console.log("Data for refresh token", data)
            return data;
        } catch (error: any) {
            // ✅ Propagar error 401 sin loggear (es normal cuando no hay sesión)
            if (error.response?.status === 401) {
                throw new Error("[401] No ha iniciado sesión, intente iniciar sesión");
            }
            throw new Error(`Error al refrescar el token: ${error}`);
        }
    },
    async register(registrationData: AuthRequestRegister): Promise<AuthResponse> {
        try {
            const { data } = await fitdeskApi.post<AuthResponse>(
                "/security/auth/register",
                {
                    email: registrationData.email,
                    password: registrationData.password,
                    firstName: registrationData.firstName,
                    lastName: registrationData.lastName,
                    ...(registrationData.username && { username: registrationData.username })
                }
            );
            console.log("Data for register ", data);
            return data;
        } catch (error) {
            throw new Error(`Error al registrarse: ${error instanceof Error ? error.message : String(error)}`);
        }
    },
    async logout(): Promise<AuthResponse> {
        const { data } = await fitdeskApi.post<AuthResponse>("/security/auth/logout")
        return data;
    }
};


