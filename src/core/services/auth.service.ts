import { fitdeskApi } from "../api/fitdeskApi";
import type { AuthRequestLogin, AuthRequestRegister, AuthResponse } from "../interfaces/auth.interface";

export const AuthService = {
    async login(form: AuthRequestLogin): Promise<AuthResponse> {

        try {
            const { data } = await fitdeskApi.post<AuthResponse>("/security/auth/login", form);
            console.log("Data for login ", data)
            return data;
        } catch (error) {
            throw new Error(`Error al logearse${error}`)
        }

    },
    async refresh(): Promise<AuthResponse> {
        try {
            const { data } = await fitdeskApi.post<AuthResponse>("/security/auth/refresh")
            console.log("Data for refresh token", data)
            return data;

        } catch (error) {
            throw new Error(`Error al refrescar el token ${error}`)
        }
    },
    async register(form: AuthRequestRegister) {

        return null;
    },
    async logout(): Promise<AuthResponse> {
        const { data } = await fitdeskApi.post<AuthResponse>("/security/auth/logout")
        return data;
    }
};


