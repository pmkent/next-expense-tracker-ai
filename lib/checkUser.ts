import { currentUser } from '@clerk/nextjs/server'
import { db } from './db'

export const checkUser = async () => {
  const user = await currentUser() // db.user.findFirst()

  if (!user) {
    return null
  }

  const loggedInUser = await db.user.findUnique({
    where: {
      clerkUserId: user.id,
    },
  })

  if (loggedInUser) {
    return loggedInUser
  }

  const newUser = await db.user.create({
    data: {
      clerkUserId: user.id,
      name: `${user.firstName} ${user.lastName}`, // user.fullName,
      imageUrl: user.imageUrl,
      email: user.emailAddresses[0]?.emailAddress,
    },
  })
  return newUser
}
