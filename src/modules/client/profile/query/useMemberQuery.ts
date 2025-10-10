import { MemberService } from "@/core/services/member.service";
import { useQuery } from "@tanstack/react-query";


export const useGetMemberQuery = (id: string) => useQuery({
    queryKey: ['member', id],
    queryFn: () => MemberService.getMemberById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
})