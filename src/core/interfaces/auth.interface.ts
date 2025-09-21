export interface AuthResponse {
    success: boolean;
    message: string;
    timestamp: Date;
    expiresAt: Date;
    user: UserLogin;
}

export interface UserLogin {
    roles: Role[];
    email: string;
    username: string;
    id: string;
    firstName: string;
    lastName: string;
}

export interface Role {
    id: string;
    name: string;
    description: string;
}



export interface AuthRequestLogin {
    email: string
    password: string
}

export interface AuthRequestRegister {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    username?: string; 
}

export interface AuthResponse {
    timestamp: Date;
    success:   boolean;
    message:   string;
}

