
import { ChatBotMessages, userData, Users, type Message, type UserData } from "@/modules/trainer/messages/data";
import { create, type StateCreator } from "zustand";
import { devtools } from "zustand/middleware";

export interface Example {
    name: string;
    url: string;
}

interface State {
    selectedExample: Example;
    examples: Example[];
    input: string;
    chatBotMessages: Message[];
    messages: Message[];
    hasInitialAIResponse: boolean;
    hasInitialResponse: boolean;
    conversations: UserData[];
    favorites: string[];
    searchQuery: string;
    isSearching: boolean;
    searchError: string | null;
    activeTab: 'all' | 'favorites';
}

interface Actions {
    selectedUser: UserData;
    setSelectedExample: (example: Example) => void;
    setExamples: (examples: Example[]) => void;
    setInput: (input: string) => void;
    handleInputChange: (
        e:
            | React.ChangeEvent<HTMLInputElement>
            | React.ChangeEvent<HTMLTextAreaElement>,
    ) => void;
    setchatBotMessages: (fn: (chatBotMessages: Message[]) => Message[]) => void;
    setMessages: (fn: (messages: Message[]) => Message[]) => void;
    setHasInitialAIResponse: (hasInitialAIResponse: boolean) => void;
    setHasInitialResponse: (hasInitialResponse: boolean) => void;
    setConversations: (conversations: UserData[]) => void;
    setSearchQuery: (query: string) => void;
    setIsSearching: (isSearching: boolean) => void;
    setSearchError: (error: string | null) => void;
    searchConversations: (query: string) => Promise<void>;
    setSelectedUser: (user: UserData) => void;
    toggleFavorite: (userId: string) => void;
    setActiveTab: (tab: 'all' | 'favorites') => void;
}


const chatApi: StateCreator<State & Actions> = (set, get) => ({
    selectedUser: Users[4],
    favorites: [],
    activeTab: 'all',

    selectedExample: { name: "Messenger example", url: "/" },

    examples: [
        { name: "Messenger example", url: "/" },
        { name: "Chatbot example", url: "/chatbot" },
        { name: "Chatbot2 example", url: "/chatbot2" },
    ],

    input: "",

    // Estados de búsqueda
    conversations: userData,
    searchQuery: "",
    isSearching: false,
    searchError: null,

    setSelectedExample: (selectedExample) => set({ selectedExample }),

    setExamples: (examples) => set({ examples }),

    setInput: (input) => set({ input }),
    handleInputChange: (
        e:
            | React.ChangeEvent<HTMLInputElement>
            | React.ChangeEvent<HTMLTextAreaElement>,
    ) => set({ input: e.target.value }),

    chatBotMessages: ChatBotMessages,
    setchatBotMessages: (fn) =>
        set(({ chatBotMessages }) => ({ chatBotMessages: fn(chatBotMessages) })),

    messages: userData[0].messages,
    setMessages: (fn) => set(({ messages }) => ({ messages: fn(messages) })),

    hasInitialAIResponse: false,
    setHasInitialAIResponse: (hasInitialAIResponse) =>
        set({ hasInitialAIResponse }),

    hasInitialResponse: false,
    setHasInitialResponse: (hasInitialResponse) => set({ hasInitialResponse }),

    // Acciones de búsqueda
    setConversations: (conversations) => set({ conversations }),
    setSearchQuery: (searchQuery) => set({ searchQuery }),
    setIsSearching: (isSearching) => set({ isSearching }),
    setSearchError: (searchError) => set({ searchError }),
    setSelectedUser: (selectedUser) => set({ selectedUser }),
    toggleFavorite: (userId) => set((state) => ({
        favorites: state.favorites.includes(userId)
            ? state.favorites.filter(id => id !== userId)
            : [...state.favorites, userId]
    })),
    setActiveTab: (tab) => set({ activeTab: tab }),

    searchConversations: async (query: string) => {
        const { setConversations, setIsSearching, setSearchError } = get();

        if (!query.trim()) {
            setConversations(userData);
            setSearchError(null);
            return;
        }

        try {
            setIsSearching(true);
            setSearchError(null);

            // Importar dinámicamente el servicio para evitar dependencias circulares
            const { chatService } = await import("@/modules/shared/chat/services/chatService");
            const results = await chatService.searchConversations(query);
            setConversations(results);
        } catch (error) {
            console.error('Error al buscar conversaciones:', error);
            setSearchError('Error al buscar conversaciones');
            // Fallback a búsqueda local
            const localResults = userData.filter(user =>
                user.name.toLowerCase().includes(query.toLowerCase())
            );
            setConversations(localResults);
        } finally {
            setIsSearching(false);
        }
    }
})

const useChatStore = create<State & Actions>()(
    devtools(
        chatApi
    )
)

export default useChatStore;