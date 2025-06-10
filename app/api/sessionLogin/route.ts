import type { NextApiRequest, NextApiResponse } from 'next'
import { adminAuth } from '../../lib/firebase/admin'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // if (req.method !== 'POST') return res.status(405).end()
  //
  // const { idToken } = req.body
  // if (!idToken) return res.status(400).json({ error: 'Missing idToken' })
  //
  // const expiresIn = 60 * 60 * 24 * 5 * 1000
  //
  // try {
  //   const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn })
  //
  //   res.setHeader('Set-Cookie', `sessionCookie=${sessionCookie}; path=/; HttpOnly`)
  //   res.status(200).json({ status: 'success', cookie: sessionCookie, expiresIn: expiresIn / 1000 })
  // } catch (error) {
  //   res.status(401).json({ error: 'Unauthorized' })
  // }
  return res.status(200).json({bruh:"bruh"})
}