import { getServerSession } from 'next-auth'
import { prisma } from './prisma'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

/**
 * Get the current authenticated user from the session
 */
export async function getCurrentUser() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) return null

    return await prisma.user.findUnique({
      where: { email: session.user.email },
    })
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}
