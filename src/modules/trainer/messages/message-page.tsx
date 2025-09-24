import { useSearchParams } from "react-router";
import type { User } from "./data";
import { Chat } from "./components/chat";

export const MessagePage = () => {
    const [searchParams] = useSearchParams();
    const role = searchParams.get("role");
    console.log("Rol que envia mensaje", role)
    const loggedInUserData: User = role === "trainer"
        ? { id: "trainer-1", avatar: "...", name: "Entrenador 1" }
        : { id: "student-1", avatar: "...", name: "Alumno 1" };

    return <Chat roomId="room-1" loggedInUser={loggedInUserData} />;
};