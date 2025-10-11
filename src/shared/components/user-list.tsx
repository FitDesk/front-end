import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Search, Plus } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { fitdeskApi } from '@/core/api/fitdeskApi';

interface UserListProps {
    targetRole: 'TRAINER' | 'USER';
    onSelectUser: (userId: string, userRole: 'TRAINER' | 'USER') => void;
    onBack: () => void;
}

interface User {
    id: string;
    username?: string;
    email?: string;
    firstName?: string | null;
    lastName?: string | null;
    enabled: boolean;
    roles: Array<{ name: string; description: string }>;
}

export function UserList({ targetRole, onSelectUser, onBack }: UserListProps) {
    const [searchTerm, setSearchTerm] = useState('');

    const { data: users = [], isLoading } = useQuery({
        queryKey: ['users', targetRole],
        queryFn: async (): Promise<User[]> => {
            const response = await fitdeskApi.get(`/chat/users/${targetRole}`);
            return response.data as User[];
        },
        staleTime: 60000,
    });

    // ✅ Función helper para obtener el nombre completo o email
    const getDisplayName = (user: User): string => {
        // Caso 1: Ambos nombres disponibles
        if (user.firstName && user.lastName) {
            return `${user.firstName} ${user.lastName}`;
        }
        
        // Caso 2: Solo firstName
        if (user.firstName) return user.firstName;
        
        // Caso 3: Solo lastName
        if (user.lastName) return user.lastName;
        
        // Caso 4: Usar username si está disponible
        if (user.username) return user.username;
        
        // Caso 5: Fallback al email (parte antes de @)
        if (user.email) {
            return user.email.split('@')[0];
        }
        
        // Caso 6: Último recurso
        return 'Usuario sin nombre';
    };

    // ✅ Función helper para obtener iniciales
    const getInitials = (user: User): string => {
        // Caso 1: Ambos nombres disponibles
        if (user.firstName && user.lastName) {
            return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
        }
        
        // Caso 2: Solo firstName
        if (user.firstName && user.firstName.length >= 2) {
            return user.firstName.slice(0, 2).toUpperCase();
        }
        
        // Caso 3: Solo lastName
        if (user.lastName && user.lastName.length >= 2) {
            return user.lastName.slice(0, 2).toUpperCase();
        }
        
        // Caso 4: Usar username
        if (user.username && user.username.length >= 2) {
            return user.username.slice(0, 2).toUpperCase();
        }
        
        // Caso 5: Primeras 2 letras del email
        if (user.email) {
            const emailName = user.email.split('@')[0];
            return emailName.slice(0, 2).toUpperCase();
        }
        
        // Caso 6: Último recurso
        return '??';
    };

    const filteredUsers = users.filter(user => {
        if (!searchTerm.trim()) return true;
        
        const displayName = getDisplayName(user).toLowerCase();
        const email = (user.email || '').toLowerCase();
        const username = (user.username || '').toLowerCase();
        const search = searchTerm.toLowerCase();
        
        return displayName.includes(search) || 
               email.includes(search) || 
               username.includes(search);
    });

    return (
        <div className="flex flex-col h-full bg-card">
            {/* Header */}
            <div className="p-4 border-b border-border">
                <div className="flex items-center gap-2 mb-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onBack}
                        className="text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h1 className="text-xl font-semibold text-foreground">
                        Seleccionar {targetRole === 'TRAINER' ? 'Entrenador' : 'Estudiante'}
                    </h1>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder={`Buscar ${targetRole === 'TRAINER' ? 'entrenadores' : 'estudiantes'}...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            {/* Lista de usuarios */}
            <div className="flex-1 overflow-y-auto p-2">
                {isLoading ? (
                    <div className="p-4 space-y-3">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="flex items-center gap-3 p-3">
                                <div className="w-12 h-12 bg-muted rounded-full animate-pulse" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
                                    <div className="h-3 bg-muted rounded w-1/2 animate-pulse" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8">
                        <div className="text-4xl mb-4">👥</div>
                        <h3 className="text-lg font-medium mb-2">No se encontraron usuarios</h3>
                        <p className="text-center text-sm">
                            {searchTerm.trim() 
                                ? `No hay resultados para "${searchTerm}"`
                                : `No hay ${targetRole === 'TRAINER' ? 'entrenadores' : 'estudiantes'} disponibles`
                            }
                        </p>
                    </div>
                ) : (
                    filteredUsers.map((user) => (
                        <div
                            key={user.id}
                            onClick={() => onSelectUser(user.id, targetRole)}
                            className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors hover:bg-muted/50"
                        >
                            <Avatar className="h-12 w-12">
                                <AvatarFallback className="bg-primary text-primary-foreground">
                                    {getInitials(user)}
                                </AvatarFallback>
                            </Avatar>

                            <div className="flex-1">
                                <p className="font-medium text-foreground">
                                    {getDisplayName(user)}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {user.email || user.username || 'Sin email'}
                                </p>
                            </div>

                            <Plus className="h-5 w-5 text-muted-foreground" />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}