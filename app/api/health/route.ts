import { NextResponse } from 'next/server'
import { query, initializeDatabase } from '@/lib/db'
import { corsHeaders } from '@/lib/middleware'

export async function GET() {
  await initializeDatabase()
  try {
    const { rows } = await query('SELECT 1 as ok')
    const { rows: info } = await query('SELECT current_database() as db, now() as server_time')
    return NextResponse.json({
      status: 'ok',
      db: true,
      check: rows[0]?.ok === 1,
      database: info[0]?.db,
      server_time: info[0]?.server_time,
    }, { headers: corsHeaders() })
  } catch (error: any) {
    return NextResponse.json({
      status: 'ok',
      db: false,
      error: error?.message ?? 'DB check failed',
    }, { status: 200, headers: corsHeaders() })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders() })
}

