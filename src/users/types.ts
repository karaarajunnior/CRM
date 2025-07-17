import { Request } from "express";

type userRole =
	| "ADMIN"
	| "SALES_MANAGER"
	| "SALES_REP"
	| "SUPPORT"
	| "MARKETING";
export interface AuthenticatedRequest extends Request {
	userId: string;
	user: {
		id: string;
		email: string;
		firstName: string;
		lastName: string;
		role: userRole;
	};
}

export interface user {
	id: string;
	email: string;
	password: string;
	firstName: string;
	lastName: string;
	role: userRole;
	department: string;
	isActive: boolean;
	lastLoginAt: Date;
	createdAt: Date;
	updatedAt: Date;
}

export interface RegisterInput {
	email: string;
	password: any;
	firstName: string;
	lastName: string;
	role: userRole;
	department?: string;
}

export interface LoginInput {
	email: string;
	password: string;
}

export interface PasswordResetRequestInput {
	email: string;
}

export interface PasswordResetInput {
	token: string;
	newPassword: string;
	lastName?: string;
}
export interface SendEmailInput {
	from: string;
	to: string[];
	subject: string;
	html: string;
	text?: string;
}
export interface JwtPayload {
	userId: string;
	role?: string;
}
export interface ApiResponse<T> {
	success: boolean;
	message?: string;
	data?: T;
	error?: string;
	token?: string;
	refreshToken?: string;
}
