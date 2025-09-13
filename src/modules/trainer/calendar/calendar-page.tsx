import { Calendar as CalendarIcon } from 'lucide-react';

export default function CalendarPage() {
    return (
        <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
                <CalendarIcon className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold">Mi Calendario</h1>
            </div>
            <div className="bg-card rounded-lg border p-6">
                <p className="text-muted-foreground">
                    Vista de calendario de clases y citas programadas.
                </p>
            </div>
        </div>
    );
}
