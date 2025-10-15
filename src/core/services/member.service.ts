/** biome-ignore-all lint/complexity/noStaticOnlyClass: <> */
import { fitdeskApi } from "../api/fitdeskApi";
import type { MemberFilters, MemberPageResponse, MemberRequest, MemberResponse, MemberSecurityData } from "../interfaces/member.interface";
import type { UserMemberships } from "../interfaces/plan.interface";

export class MemberService {


    static async getAllMembers(filters?: MemberFilters): Promise<MemberPageResponse> {
        try {
            const params = new URLSearchParams();

            if (filters?.search) params.append('search', filters.search);
            if (filters?.dni) params.append('dni', filters.dni);
            if (filters?.email) params.append('email', filters.email);
            if (filters?.firstName) params.append('firstName', filters.firstName);
            if (filters?.lastName) params.append('lastName', filters.lastName);
            if (filters?.membershipStatus) params.append('membershipStatus', filters.membershipStatus);

            params.append('page', String(filters?.page ?? 0));
            params.append('size', String(filters?.size ?? 10));
            params.append('sortField', filters?.sortField ?? 'firstName');
            params.append('sortDirection', filters?.sortDirection ?? 'asc');

            const { data } = await fitdeskApi.get<MemberPageResponse>(
                `/members/member?${params.toString()}`
            );
            console.log('MemberService.getAllMembers response', data);
            return data;
        } catch (error) {
            throw new Error(`Error al obtener todos los miembros: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    static async getMemberByIdWithSecurity(id: string): Promise<MemberSecurityData> {
        try {
            const { data } = await fitdeskApi.get<MemberSecurityData>(`/members/member/user-security/${id}`);
            return data;
        } catch (error) {
            throw new Error(`Error al obtener el miembro con ID ${id}: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    static async getMemberById(id: string): Promise<MemberResponse> {
        try {
            const { data } = await fitdeskApi.get<MemberResponse>(`/members/member/user/${id}`);
            return data;
        }
        catch (error) {
            throw new Error(`Error al obtener el miembro con ID ${id}: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    static async updateMember(id: string, memberUpdate: MemberRequest): Promise<MemberResponse> {
        try {
            const { data } = await fitdeskApi.put<MemberResponse>(`/members/member/${id}`, memberUpdate);
            return data;
        }
        catch (error) {
            throw new Error(`Error al actualizar el miembro: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    static async getMyMembership(): Promise<UserMemberships> {
        try {
            const response = await fitdeskApi.get<UserMemberships>(
                `/members/memberships/my-active-membership`
            );
            return response.data;
        } catch (error) {
            console.error("Error obteniendo membresía del usuario:", error);
            throw new Error(
                (error instanceof Error && error.message) || "Error al obtener la membresía del usuario"
            );
        }
    }
}