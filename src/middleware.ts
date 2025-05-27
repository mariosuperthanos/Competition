import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { Redis } from '@upstash/redis'
import { Ratelimit } from '@upstash/ratelimit'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(1000, '1 m'), // max 10 req / min
  analytics: true,
})

export async function middleware(request: NextRequest) {
  const ip =
    request.ip ||
    request.headers.get('x-forwarded-for') ||
    '127.0.0.1' // fallback localhost

  // Rate limiting pe toate rutele
  const { success } = await ratelimit.limit(ip)
  if (!success) {
    return new NextResponse('Too many requests', { status: 429 })
  }

  // Aplică CORS DOAR dacă ruta e API
  // if (request.nextUrl.pathname.startsWith('/api/')) {
  //   const origin = request.headers.get('origin')
  //   const allowedOrigins = ['http://localhost:3000', 'https://siteultau.com']

  //   if (!origin || !allowedOrigins.includes(origin)) {
  //     return new NextResponse('Origin not allowed', { status: 403 })
  //   }

  //   const corsHeaders = {
  //     'Access-Control-Allow-Origin': origin,
  //     'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  //     'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  //   }

  //   if (request.method === 'OPTIONS') {
  //     return new NextResponse(null, {
  //       status: 204,
  //       headers: corsHeaders,
  //     })
  //   }

  //   const response = NextResponse.next()
  //   Object.entries(corsHeaders).forEach(([key, value]) => {
  //     response.headers.set(key, value)
  //   })

  //   return response
  // }

  // Pentru celelalte rute, doar continuă
  return NextResponse.next()
}

