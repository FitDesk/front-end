import {useAuthStore} from "@core/store/auth.store.ts";
import {useNavigate} from "react-router";

export const useRoleRedirec = () => {
    const {user} = useAuthStore()
    const navigate = useNavigate();


    const redirectByRole = () => {
        console.log("User roles ", user?.roles)
        if (user?.roles.includes("ADMIN")) {
            navigate("/admin/dashboard");
        } else if (user?.roles.includes("TRAINER")) {
            navigate("/trainer/dashboard");
        } else if (user?.roles.includes("USER")) {
            navigate("/client/dashboard");
        } else {
            navigate("/");
        }
    }

    return {
        redirectByRole
    }
};