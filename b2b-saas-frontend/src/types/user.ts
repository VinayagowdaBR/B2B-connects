export interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'customer';
    avatar?: string;
    phone?: string;
    address?: string;
    createdAt: string;
    updatedAt: string;
}

export interface UserProfile extends User {
    companyId?: string;
    companyName?: string;
}

export interface UpdateUserRequest {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    avatar?: string;
}
