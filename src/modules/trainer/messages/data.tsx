import { generateUUID } from "@/core/utils/generate-uuid";

export const Users: User[] = [
    // {
    //     id: generateUUID(),
    //     avatar:
    //         "https://images.freeimages.com/images/large-previews/971/basic-shape-avatar-1632968.jpg?fmt=webp&h=350",
    //     messages: [],
    //     name: "Jane Doe",
    // },
    // {
    //     id: 2,
    //     avatar:
    //         "https://images.freeimages.com/images/large-previews/fdd/man-avatar-1632964.jpg?fmt=webp&h=350",
    //     messages: [],
    //     name: "John Doe",
    // },
    // {
    //     id: 3,
    //     avatar:
    //         "https://images.freeimages.com/images/large-previews/d1f/lady-avatar-1632967.jpg?fmt=webp&h=350",
    //     messages: [],
    //     name: "Elizabeth Smith",
    // },
    // {
    //     id: 4,
    //     avatar:
    //         "https://images.freeimages.com/images/large-previews/023/geek-avatar-1632962.jpg?fmt=webp&h=350",
    //     messages: [],
    //     name: "John Smith",
    // },
    // {
    //     id: 5,
    //     avatar:
    //         "https://avatars.githubusercontent.com/u/114422072?s=400&u=8a176a310ca29c1578a70b1c33bdeea42bf000b4&v=4",
    //     messages: [],
    //     name: "Jakob Hoeg",
    // },
];

export const userData: User[] = [
    // {
    //     id: generateUUID(),
    //     avatar:
    //         "https://images.freeimages.com/images/large-previews/971/basic-shape-avatar-1632968.jpg?fmt=webp&h=350",
    //     messages: [],
    //     name: "Jane Doe",
    //     lastMessage: "It has been good. I went for a run this morning and then had a nice breakfast. How about you?",
    //     lastMessageTime: "10:10 AM",
    //     unreadCount: 0,
    // },
    // {
    //     id: generateUUID(),
    //     avatar:
    //         "https://images.freeimages.com/images/large-previews/fdd/man-avatar-1632964.jpg?fmt=webp&h=350",
    //     name: "John Doe",
    //     messages: [
    //         {
    //             id: generateUUID(),
    //             avatar:
    //                 "https://images.freeimages.com/images/large-previews/fdd/man-avatar-1632964.jpg?fmt=webp&h=350",
    //             name: "John Doe",
    //             message: "¿Cuándo es la próxima clase?",
    //             timestamp: "09:30 AM",
    //         },
    //         {
    //             id: generateUUID(),
    //             avatar:
    //                 "https://avatars.githubusercontent.com/u/114422072?s=400&u=8a176a310ca29c1578a70b1c33bdeea42bf000b4&v=4",
    //             name: "Jakob Hoeg",
    //             message: "El martes a las 6 PM",
    //             timestamp: "09:32 AM",
    //         },
    //     ],
    //     lastMessage: "El martes a las 6 PM",
    //     lastMessageTime: "09:32 AM",
    //     unreadCount: 0,
    // },
    // {
    //     id: 3,
    //     avatar:
    //         "https://images.freeimages.com/images/large-previews/d1f/lady-avatar-1632967.jpg?fmt=webp&h=350",
    //     name: "Elizabeth Smith",
    //     messages: [
    //         {
    //             id: generateUUID(),
    //             avatar:
    //                 "https://images.freeimages.com/images/large-previews/d1f/lady-avatar-1632967.jpg?fmt=webp&h=350",
    //             name: "Elizabeth Smith",
    //             message: "Gracias por la rutina de cardio",
    //             timestamp: "08:15 AM",
    //         },
    //     ],
    //     lastMessage: "Gracias por la rutina de cardio",
    //     lastMessageTime: "08:15 AM",
    //     unreadCount: 0,
    // },
    // {
    //     id: 4,
    //     avatar:
    //         "https://images.freeimages.com/images/large-previews/023/geek-avatar-1632962.jpg?fmt=webp&h=350",
    //     name: "John Smith",
    //     messages: [
    //         {
    //             id: generateUUID(),
    //             avatar:
    //                 "https://images.freeimages.com/images/large-previews/023/geek-avatar-1632962.jpg?fmt=webp&h=350",
    //             name: "John Smith",
    //             message: "¿Puedo cambiar mi horario?",
    //             timestamp: "Ayer",
    //         },
    //         {
    //             id: generateUUID(),
    //             avatar:
    //                 "https://avatars.githubusercontent.com/u/114422072?s=400&u=8a176a310ca29c1578a70b1c33bdeea42bf000b4&v=4",
    //             name: "Jakob Hoeg",
    //             message: "Claro, ¿qué horario prefieres?",
    //             timestamp: "Ayer",
    //         },
    //     ],
    //     lastMessage: "Claro, ¿qué horario prefieres?",
    //     lastMessageTime: "Ayer",
    //     unreadCount: 1,
    // },
];

export const ChatBotMessages: Message[] = [
    // {
    //     id: "2h72y2h7yb",
    //     // avatar: "",
    //     name: "ChatBot",
    //     message: "Hello! How can I help you today?",
    //     timestamp: "10:00 AM",
    //     role: "TRAINER",
    // },
    // {
    //     id: 2,
    //     avatar:
    //         "https://avatars.githubusercontent.com/u/114422072?s=400&u=8a176a310ca29c1578a70b1c33bdeea42bf000b4&v=4",
    //     name: "Jakob Hoeg",
    //     message: "I need help with my order",
    //     timestamp: "10:01 AM",
    //     role: "user",
    // },
    // {
    //     id: 3,
    //     avatar: "/",
    //     name: "ChatBot",
    //     message: "Sure! Please provide me with your order number",
    //     timestamp: "10:02 AM",
    //     role: "ai",
    // },
    // {
    //     id: 4,
    //     avatar:
    //         "https://avatars.githubusercontent.com/u/114422072?s=400&u=8a176a310ca29c1578a70b1c33bdeea42bf000b4&v=4",
    //     name: "Jakob Hoeg",
    //     message: "123456",
    //     timestamp: "10:03 AM",
    //     role: "user",
    // },
    // {
    //     id: 5,
    //     avatar: "/",
    //     name: "ChatBot",
    //     message: "Thank you! One moment please while I look up your order",
    //     timestamp: "10:04 AM",
    //     role: "ai",
    // },
    // {
    //     id: 6,
    //     avatar: "/",
    //     name: "ChatBot",
    //     message:
    //         "I have found your order. It is currently being processed and will be shipped out soon.",
    //     timestamp: "10:05 AM",
    //     role: "ai",
    // },
    // {
    //     id: 7,
    //     avatar:
    //         "https://avatars.githubusercontent.com/u/114422072?s=400&u=8a176a310ca29c1578a70b1c33bdeea42bf000b4&v=4",
    //     name: "Jakob Hoeg",
    //     message: "Thank you for your help!",
    //     timestamp: "10:06 AM",
    //     role: "user",
    // },
    // {
    //     id: 8,
    //     avatar: "/",
    //     name: "ChatBot",
    //     message: "You are welcome! Have a great day!",
    //     isLoading: true,
    //     timestamp: "10:10 AM",
    //     role: "ai",
    // },
];

export type UserData = (typeof userData)[number];


export const loggedInUserData: User = {
    id: "trainer-1", // Cambiar según el usuario autenticado
    avatar: "https://avatars.githubusercontent.com/u/114422072?s=400",
    name: "Entrenador 1",
};

export type LoggedInUserData = typeof loggedInUserData;

export interface Message {
    id: string; // ID del mensaje
    roomId: string; // ID de la sala
    fromId: string; // ID del remitente
    fromRole: "TRAINER" | "STUDENT"; // Rol del remitente
    text: string; 
    createdAt: string; 
}
// export interface Message {
//     id: string;
//     avatar: string;
//     name: string;
//     message?: string;
//     isLoading?: boolean;
//     timestamp?: string;
//     role?: "TRAINER" | "STUDENT";
//     isLiked?: boolean;
// }

export interface User {
    id: string; // ID del usuario
    avatar: string; // URL del avatar del usuario
    name: string; // Nombre del usuario
}
// export interface User {
//     id: string;
//     avatar: string;
//     messages?: Message[];
//     name: string;
//     lastMessage?: string;
//     lastMessageTime?: string;
//     unreadCount?: number;
// }