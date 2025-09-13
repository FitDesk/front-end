import { CheckCircle2 as CheckCircle2Icon } from 'lucide-react';

export default function AttendancePage() {
    return (
        <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
                <CheckCircle2Icon className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold">Control de Asistencia</h1>
            </div>
            <div className="bg-card rounded-lg border p-6">
                <p className="text-muted-foreground">
                    Gestión de asistencia de alumnos a clases y sesiones.
                </p>
            </div>
        </div>
    );
}
