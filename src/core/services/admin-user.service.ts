/** biome-ignore-all lint/complexity/noThisInStatic: <> */
/** biome-ignore-all lint/complexity/noStaticOnlyClass: <> */
import { fitdeskApi } from "../api/fitdeskApi";
import type { AccountProviders, RolesWithDescription, UserStatisticsAccount } from "../interfaces/admin-user.interface";

export class AdminUserService {
    private static readonly BASE_URL = '/security/admin/users';


    static async getUserStatistics(): Promise<UserStatisticsAccount> {
        try {
            const { data } = await fitdeskApi.get<UserStatisticsAccount>(`${this.BASE_URL}`);
            return data;
        } catch (error) {
            console.error("Error fetching user statistics:", error);
            throw error;
        }
    }

    static async getRoleDetails(): Promise<RolesWithDescription[]> {
        try {
            const { data } = await fitdeskApi.get<RolesWithDescription[]>(`${this.BASE_URL}/roles`);
            return data;
        }
        catch (error) {
            console.error("Error fetching role details:", error);
            throw error;
        }
    }

    static async getUsersByProvider(): Promise<AccountProviders> {
        try {
            const { data } = await fitdeskApi.get<AccountProviders>(`${this.BASE_URL}/provider`);
            return data;
        }
        catch (error) {
            console.error("Error fetching users by provider:", error);
            throw error;
        }
    }

    static async removeRoleFromUser(id: string, role: string): Promise<void> {
        try {
            await fitdeskApi.delete<void>(`${this.BASE_URL}/${id}/roles`, { data: { role } });
        }
        catch (error) {
            console.error("Error removing role from user:", error);
            throw error;
        }
    }

    static async assignRoleToUser(id: string, role: string): Promise<void> {
        try {
            await fitdeskApi.post<void>(`${this.BASE_URL}/${id}/roles`, { role });
        }
        catch (error) {
            console.error("Error assigning role to user:", error);
            throw error;
        }
    }

    static async desactiveUser(id: string): Promise<void> {
        try {
            await fitdeskApi.post<void>(`${this.BASE_URL}/${id}/desactive`);
        }
        catch (error) {
            console.error("Error desactivating user:", error);
            throw error;
        }
    }

    static async activateUser(id: string): Promise<void> {
        try {
            await fitdeskApi.post<void>(`${this.BASE_URL}/${id}/activate`);
        }
        catch (error) {
            console.error("Error activating user:", error);
            throw error;
        }
    }
}