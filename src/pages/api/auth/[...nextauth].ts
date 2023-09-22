import bcrypt from "bcryptjs";
import NextAuth,{ AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import {PrismaAdapter} from "@next-auth/prisma-adapter";
import prisma from "@/app/prismaContext/prismadb"
export const authOptions: AuthOptions = {
	adapter: PrismaAdapter(prisma),
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
		}),
		CredentialsProvider({
			name: "credentials",
			credentials: {
				email: { label: "email", type: "text" },
				password: { label: "password", type: "password" },
			},
			//manejador de auth que recibe las credencilas del objeto credentials
			async authorize(credentials){
				if (!credentials?.email){
					throw new Error("Credenciales Inválidas");
				}

				const user = await prisma.user.findUnique({
					where: {
						email:credentials.email,
					},
				});

				if (!user || !user?.hashedPassword){
					throw new Error("Credenciales inválidas");
				}

				const isCorrectPassword = await bcrypt.compare(credentials.password, user.hashedPassword);
				if (!isCorrectPassword){
					throw new Error("Credenciales Inválidas");
				}

				return user;
			},

		})
	],
	//aqui damos el contexto de que rutas dispararemos el singin.
	pages:{
		signIn:"/",
	},
	//añadiremos un inspector de procesos.
	debug: process.env.NODE_ENV==="development",
	session:{
		strategy:"jwt",
	},

	//pasar la semilla que firme y valide los tokens generados
	secret:process.env.NEXT_AUTH_SECRET,


};

export default NextAuth(authOptions);

