import NextAuth from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";
import { authOptions } from "../../../../lib/auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
