"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

const RegisterSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6, "Password must be at least 6 characters"),
	name: z.string().min(1, "Name is required"),
});

export async function register(values: z.infer<typeof RegisterSchema>) {
	const validatedFields = RegisterSchema.safeParse(values);

	if (!validatedFields.success) {
		return { error: "Invalid fields!" };
	}

	const { email, password, name } = validatedFields.data;
	const hashedPassword = await bcrypt.hash(password, 10);

	const existingUser = await db.user.findUnique({
		where: { email },
	});

	if (existingUser) {
		return { error: "Email already in use!" };
	}

	await db.user.create({
		data: {
			name,
			email,
			password: hashedPassword,
		},
	});

	// Automatically sign in after registration
	return login({ email, password });
}

const LoginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(1, "Password is required"),
});

export async function login(values: z.infer<typeof LoginSchema>) {
	const validatedFields = LoginSchema.safeParse(values);

	if (!validatedFields.success) {
		return { error: "Invalid fields!" };
	}

	const { email, password } = validatedFields.data;

	try {
		await signIn("credentials", {
			email,
			password,
			redirectTo: "/dashboard",
		});
		return { success: "Logged in!" };
	} catch (error) {
		if (error instanceof AuthError) {
			switch (error.type) {
				case "CredentialsSignin":
					return { error: "Invalid credentials!" };
				default:
					return { error: "Something went wrong!" };
			}
		}

		throw error;
	}
}
