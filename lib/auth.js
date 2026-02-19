import { prisma } from './prisma'

/**
 * Check if user has admin role
 */
export function isAdmin(user) {
  return user?.role === 'ADMIN'
}

/**
 * Check if user has editor or admin role
 */
export function isEditorOrAdmin(user) {
  return user?.role === 'EDITOR' || user?.role === 'ADMIN'
}

/**
 * Check if user can edit content (author, editor, or admin)
 */
export function canEditContent(user, content) {
  if (!user) return false
  if (isAdmin(user) || isEditorOrAdmin(user)) return true
  return content?.authorId === user.id
}
