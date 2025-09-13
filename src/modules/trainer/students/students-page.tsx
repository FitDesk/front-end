import { Users as UsersIcon } from 'lucide-react';

export default function StudentsPage() {
    return (
        <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
                <UsersIcon className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold">Mis Alumnos</h1>
            </div>
            <div className="bg-card rounded-lg border p-6">
                <p className="text-muted-foreground">
                    Lista de alumnos asignados y su información de contacto.
                </p>
            </div>
        </div>
    );
}
