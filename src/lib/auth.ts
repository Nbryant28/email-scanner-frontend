// src/lib/auth.ts

import { AuthOptions } from "next-auth";
import {getServerSession} from "next-auth"
import AzureADProvider from "next-auth/providers/azure-ad";

export const authOptions: AuthOptions = {
  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      tenantId: "common", // 🔁 Use 'common' to support both personal + work accounts
      authorization: {
        params: {
          scope: "openid profile email offline_access https://graph.microsoft.com/Mail.Read",
        },
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        console.log("🔍 Azure account object:", account);
        token.accessToken = account.access_token; // ✅ this line should work IF access_token is returned
      }
      return token;
    },
    async session({ session, token }) {
        console.log("🔐 Token in session callback:", token);
      if (token?.accessToken) {
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
  }  
};
export async function getSessionOnServer(){
return await getServerSession(authOptions);
} 
