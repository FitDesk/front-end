import { PlanService } from "@/modules/admin/plans/services/plan.service";
import { useQuery } from "@tanstack/react-query";




export const useMyMembership = () => {
    return useQuery({
        queryKey: ["membership", "my"],
        queryFn: () => PlanService.getMyMembership(),
        staleTime: 5 * 60 * 1000,
    });
};