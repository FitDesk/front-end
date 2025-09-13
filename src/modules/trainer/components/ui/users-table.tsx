import { Button } from "@/shared/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"
import { Badge } from "@/shared/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar"

type User = {
  id: string
  name: string
  email: string
  avatar: string
  status: 'active' | 'inactive' | 'paused'
  lastSeen: string
}

type UsersTableProps = {
  title?: string
  users?: User[]
  onAddUser?: () => void
}

export function UsersTable({ 
  title = "Mis Alumnos Recientes", 
  users = [
    {
      id: '1',
      name: 'Juan Pérez',
      email: 'juan@example.com',
      avatar: '',
      status: 'active',
      lastSeen: 'Hace 2 horas'
    },
    {
      id: '2',
      name: 'María García',
      email: 'maria@example.com',
      avatar: '',
      status: 'active',
      lastSeen: 'Hace 1 día'
    },
    {
      id: '3',
      name: 'Carlos López',
      email: 'carlos@example.com',
      avatar: '',
      status: 'paused',
      lastSeen: 'Hace 3 días'
    },
  ],
  onAddUser 
}: UsersTableProps) {
  return (
    <div className="rounded-md border">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="text-lg font-medium">{title}</h3>
        {onAddUser && (
          <Button size="sm" onClick={onAddUser}>
            Agregar Alumno
          </Button>
        )}
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Última conexión</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge 
                  variant={user.status === 'active' ? 'default' : 'secondary'}
                  className={user.status === 'paused' ? 'bg-amber-100 text-amber-800' : ''}
                >
                  {user.status === 'active' ? 'Activo' : 'Inactivo'}
                </Badge>
              </TableCell>
              <TableCell>{user.lastSeen}</TableCell>
              <TableCell className="text-right">
                <Button variant="outline" size="sm">Ver</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
