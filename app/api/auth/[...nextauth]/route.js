import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { prisma } from '@/lib/prisma'

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === 'google') {
        try {
          if (!user?.email) return false

          // Your Prisma schema requires `name` (non-null).
          // Google can sometimes return an empty/undefined name, so we ensure a fallback.
          const name =
            user?.name ||
            profile?.name ||
            user.email.split('@')[0] ||
            'Member'

          // Upsert guarantees the user exists in the DB after sign-in.
          await prisma.user.upsert({
            where: { email: user.email },
            create: {
              email: user.email,
              name,
              role: 'MEMBER',
            },
            update: {
              // Keep their name in sync if Google provides a better one later.
              name,
            },
          })
        } catch (error) {
          console.error('Error in signIn callback:', error)
          return false
        }
      }
      return true
    },
    async session({ session, token }) {
      if (session?.user?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: session.user.email },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        })

        if (dbUser) {
          session.user.id = dbUser.id
          session.user.role = dbUser.role
        }
      }
      if (session?.user) {
        session.user.image =
          session.user.image || token?.picture || token?.image || null
        if (!session.user.name) {
          session.user.name =
            token?.name ||
            session.user.email?.split?.("@")?.[0] ||
            "Member"
        }
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
