import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { Redis } from '@upstash/redis'
import { Ratelimit } from '@upstash/ratelimit'

// Initializam conexiunea Redis
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})


class CustomRateLimiter {
  private redis: Redis
  private windowSizeMs: number
  private maxRequests: number
  private keyPrefix: string

  /**
   * Constructor pentru rate limiter
   * @param redis - Instanta Redis
   * @param maxRequests - Numarul maxim de cereri permise
   * @param windowSizeMs - Fereastra de timp in milisecunde
   * @param keyPrefix - Prefixul pentru chei Redis
   */
  constructor(redis: Redis, maxRequests: number = 1000, windowSizeMs: number = 60000, keyPrefix: string = 'rate_limit') {
    this.redis = redis
    this.maxRequests = maxRequests
    this.windowSizeMs = windowSizeMs
    this.keyPrefix = keyPrefix
  }

  /**
   * Verifica daca IP-ul poate face o cerere (sliding window algorithm)
   * @param ip - Adresa IP a clientului
   * @returns Promise<{allowed: boolean, remaining: number, resetTime: number}>
   */
  async checkRateLimit(ip: string): Promise<{ allowed: boolean, remaining: number, resetTime: number }> {
    const currentTime = Date.now()
    const windowStart = currentTime - this.windowSizeMs
    const key = `${this.keyPrefix}:${ip}`

    try {
      // Folosim pipeline pentru operatii atomice Redis
      const pipeline = this.redis.pipeline()

      // 1. Eliminam cererile mai vechi decât fereastra curenta
      pipeline.zremrangebyscore(key, 0, windowStart)

      // 2. Numaram cererile din fereastra curenta
      pipeline.zcard(key)

      // 3. Adaugam cererea curenta cu timestamp
      pipeline.zadd(key, { score: currentTime, member: `${currentTime}-${Math.random()}` })

      // 4. Setam expirarea cheii
      pipeline.expire(key, Math.ceil(this.windowSizeMs / 1000))

      // Executam pipeline-ul
      const results = await pipeline.exec()

      // Extragem numarul de cereri din rezultate
      const requestCount = results[1] as number

      // Calculam valorile de return
      const allowed = requestCount < this.maxRequests
      const remaining = Math.max(0, this.maxRequests - requestCount - 1)
      const resetTime = currentTime + this.windowSizeMs

      // Daca nu este permis, eliminam cererea curenta adaugata
      if (!allowed) {
        await this.redis.zremrangebyrank(key, -1, -1)
      }

      return {
        allowed,
        remaining,
        resetTime
      }

    } catch (error) {
      console.error('Rate limiter error:', error)
      // in caz de eroare Redis, permitem cererea (fail-open)
      return {
        allowed: true,
        remaining: this.maxRequests - 1,
        resetTime: currentTime + this.windowSizeMs
      }
    }
  }
}

// Initializam rate limiter-ul global
const rateLimiter = new CustomRateLimiter(
  redis,
  1000, // maxim 1000 de cereri
  60 * 1000, // per minut (60000ms)
  'api_rate_limit'
)

// const ratelimit = new Ratelimit({
//   redis,
//   limiter: Ratelimit.slidingWindow(1000, '1 m'), // max 10 req / min
//   analytics: true,
// })

function getClientIP(request: NextRequest): string {
  // Prioritam headerele de proxy pentru IP real
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const cfConnectingIP = request.headers.get('cf-connecting-ip') // Cloudflare

  if (cfConnectingIP) return cfConnectingIP
  if (realIP) return realIP
  if (forwarded) {
    // X-Forwarded-For poate contine multiple IP-uri separate prin virgula
    return forwarded.split(',')[0].trim()
  }

  // Fallback la IP-ul din NextRequest sau localhost
  return request.ip || '127.0.0.1'
}

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.pathname;

  if (url.startsWith('/_next') || url.endsWith('.ico') || url.startsWith('/.well-known')) {
    return NextResponse.next(); // skip static files
  }
  // const ip =
  //   request.ip ||
  //   request.headers.get('x-forwarded-for') ||
  //   '127.0.0.1' // fallback localhost

  // // Rate limiting pe toate rutele
  // const { success } = await ratelimit.limit(ip)
  // if (!success) {
  //   return new NextResponse('Too many requests', { status: 429 })
  // }

  const startTime = Date.now()

  // Extragem IP-ul clientului
  const clientIP = getClientIP(request)

  // Log pentru debugging (optional)
  console.log(`Rate limit check for IP: ${clientIP} - Path: ${request.nextUrl.pathname}`)

  try {
    // Verificam rate limiting
    const result = await rateLimiter.checkRateLimit(clientIP)

    // Calculam timpul de procesare
    const processingTime = Date.now() - startTime;

    if (!result.allowed) {
      // Cererea este blocata - prea multe requests
      return new NextResponse('Too many requests', { status: 429 })
    }

    // Aplica CORS DOAR daca ruta e API
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

    // Pentru celelalte rute, doar continua
    return NextResponse.next()
  } catch (error) {
    console.error('Rate limit error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}



