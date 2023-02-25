import { OAuth2Client } from 'google-auth-library'
import { TokenPayload } from '../types'

export async function verifyGoogle(token: string) {
  const client = new OAuth2Client(process.env.CLIENT_ID)

  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID,
  })

  console.log({ token_id: token })

  const { email, name, picture } = ticket.getPayload() as TokenPayload

  return {
    email,
    name,
    picture,
  }
}
