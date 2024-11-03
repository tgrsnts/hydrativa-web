import type { NextRequest } from 'next/server'
import { useAuth } from '@/lib/hooks/auth'
 
// Limit the middleware to paths starting with `/api/`
export const config = {
    matcher: '/api/:function*',
}

export function middleware(request: NextRequest) {
    // Call our authentication function to check the request
    const { user } = useAuth()
  if (!useAuth(user)) {
    // Respond with JSON indicating an error message
    return Response.json(
      { success: false, message: 'authentication failed' },
      { status: 401 }
    )
  }
}