import { User } from "@/models/user.model";
import NextAuth, { AuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongoose";

export const authOptions: AuthOptions = {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        try {
          await connectDB();
          if (!credentials?.email || !credentials?.password)
            throw new Error("Email and password are required");

          const user = await User.findOne({ email: credentials.email });
          if (!user) {
            throw new Error("Invalid Credentials");
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (!isPasswordValid) {
            throw new Error("Invalid Credentials");
          }

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
          };
        } catch (error) {
          console.error(error);
          return null;
        }
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  session: { strategy: "jwt" },

  pages: { signIn: "/auth/login" },

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async signIn({ account, profile }) {
      try {
        await connectDB();

        if (account?.provider === "google" && profile?.email) {
          const user = await User.findOne({ email: profile.email });

          if (!user) {
            await User.create({
              name: profile.name,
              email: profile.email,
              googleId: profile.sub,
            });
          } else {
            if (user.name !== profile.name || user.googleId !== profile.sub) {
              user.name = profile.name || user.name;
              user.googleId = profile.sub || user.googleId;
              await user.save();
            }
          }
        }

        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false;
      }
    },

    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.user = {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      }

      if (trigger === "update" && session) {
        token.user = {
          ...(token.user as any),
          ...session,
        };
      }

      return token;
    },
    async session({ session, token }) {
      if (token.user) session.user = token.user as any;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
