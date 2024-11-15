
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'


export async function handler(req: Request) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
  }

  const chats = await prisma.chat.findMany({
    where: {
      OR: [
        { senderId: userId },
        { receiverId: userId }
      ]
    },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          profilePicture: true
        }
      },
      receiver: {
        select: {
          id: true,
          name: true,
          profilePicture: true
        }
      },
      messages: {
        orderBy: {
          createdAt: 'desc'
        },
        take: 1
      }
    },
    orderBy: {
      updatedAt: 'desc'
    }
  })

  return NextResponse.json(chats)
}