import { fitdeskApi } from "../api/fitdeskApi";
import type { MemberRequest, MemberResponse } from "../interfaces/member.interface";
import type { UserMemberships } from "../interfaces/plan.interface";

export class MemberService {

    static async getMemberById(id: string): Promise<MemberResponse> {
        try {
            const { data } = await fitdeskApi.get<MemberResponse>(`/members/member/${id}`);
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
        } catch (error: any) {
            console.error("Error obteniendo membresía del usuario:", error);
            throw new Error(
                error.message || "Error al obtener la membresía del usuario"
            );
        }
    }
}