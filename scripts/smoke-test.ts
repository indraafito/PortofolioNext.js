/* eslint-disable */
import 'dotenv/config'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
const API = (p: string) => `${BASE_URL}/api${p}`

async function main() {
  const results: { name: string; ok: boolean; detail?: string }[] = []

  async function step(name: string, fn: () => Promise<void>) {
    try {
      await fn()
      results.push({ name, ok: true })
      console.log(`[OK] ${name}`)
    } catch (e: any) {
      results.push({ name, ok: false, detail: e?.message })
      console.error(`[FAIL] ${name}: ${e?.message}`)
    }
  }

  await step('Health check', async () => {
    const res = await fetch(API('/health'))
    if (!res.ok) throw new Error(`status ${res.status}`)
    const body = await res.json()
    if (body?.status !== 'ok') throw new Error('unexpected body')
  })

  let token: string | null = null
  await step('Admin login', async () => {
    const email = process.env.ADMIN_EMAIL
    const password = process.env.ADMIN_PASSWORD
    if (!email || !password) throw new Error('ADMIN_EMAIL/ADMIN_PASSWORD missing')
    const res = await fetch(API('/auth/login'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    if (!res.ok) throw new Error(`status ${res.status}`)
    const body = await res.json()
    token = body?.token
    if (!token) throw new Error('no token returned')
  })

  const authHeaders: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {}

  let newSkillId: string | null = null
  await step('Create skill', async () => {
    const res = await fetch(API('/skills'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders },
      body: JSON.stringify({ name: 'SmokeSkill', category: 'hard' }),
    })
    if (!res.ok) throw new Error(`status ${res.status}`)
    const body = await res.json()
    newSkillId = body?.id
    if (!newSkillId) throw new Error('missing id')
  })

  await step('Update skill', async () => {
    if (!newSkillId) throw new Error('no skill id')
    const res = await fetch(API(`/skills/${newSkillId}`), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...authHeaders },
      body: JSON.stringify({ proficiency: 50 }),
    })
    if (!res.ok) throw new Error(`status ${res.status}`)
  })

  await step('Delete skill', async () => {
    if (!newSkillId) throw new Error('no skill id')
    const res = await fetch(API(`/skills/${newSkillId}`), {
      method: 'DELETE',
      headers: authHeaders,
    })
    if (!(res.status === 204)) throw new Error(`status ${res.status}`)
  })

  await step('List projects', async () => {
    const res = await fetch(API('/projects'))
    if (!res.ok) throw new Error(`status ${res.status}`)
    const body = await res.json()
    if (!Array.isArray(body)) throw new Error('projects not array')
  })

  const failures = results.filter(r => !r.ok)
  if (failures.length) {
    console.error('\nSmoke test failures:')
    failures.forEach(f => console.error(`- ${f.name}: ${f.detail}`))
    process.exit(1)
  }
  console.log('\nAll smoke tests passed.')
}

main()

