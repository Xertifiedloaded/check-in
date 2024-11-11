
'use client'

import { useEffect, useRef, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { formatDistanceToNow } from 'date-fns'
import { Send } from 'lucide-react'
import { io } from 'socket.io-client'
import { useSession } from 'next-auth/react'

interface Message {
  id: string
  content: string
  senderId: string
  createdAt: string
}

export function ChatWindow({ user }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const socketRef = useRef<any>(null)
  const { data: session } = useSession()
  const currentUserId = session?.user?.id

  useEffect(() => {
    setupSocket()
    loadMessages()
    return () => socketRef.current?.disconnect()
  }, [user.id])

  const setupSocket = () => {
    socketRef.current = io('http://localhost:3000')
    socketRef.current.emit('join', currentUserId)
    socketRef.current.on('receive-message', handleNewMessage)
  }

  const handleNewMessage = (message: Message) => {
    setMessages((prev) => [...prev, message])
    scrollToBottom()
  }

const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return
  
    try {
      const response = await fetch('/api/chat-route/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newMessage,
          senderId: currentUserId,
          receiverId: user.id,
        }),
      })
  
      if (!response.ok) {
        throw new Error('Failed to send message')
      }
  
      const message = await response.json()
      setMessages((prev) => [...prev, message])
      setNewMessage('')
      scrollToBottom()
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }
  
  const loadMessages = async (page = 1) => {
    try {
      const response = await fetch(
        `/api/chat-route/messages?userId=${currentUserId}&otherUserId=${user.id}&page=${page}`
      )
  
      if (!response.ok) {
        throw new Error('Failed to load messages')
      }
  
      const data = await response.json()
      
      if (page === 1) {
        setMessages(data.messages)
      } else {
        setMessages(prev => [...data.messages, ...prev])
      }
      
    //   setHasMore(data.pagination.hasMore)
    } catch (error) {
      console.error('Error loading messages:', error)
      // Handle error in UI
    }
  }

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }



  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="h-16 flex items-center px-4 border-b">
        <Avatar>
          <AvatarImage src={user.image} />
          <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="ml-4">
          <p className="font-medium">{user.name}</p>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        {isLoading ? (
          <div className="flex justify-center">
            <p className="text-muted-foreground">Loading messages...</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`mb-4 flex ${
                message.senderId === currentUserId ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[70%] rounded-lg px-4 py-2 ${
                  message.senderId === currentUserId
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <p>{message.content}</p>
                <p className="text-xs mt-1 opacity-70">
                  {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={scrollRef} />
      </ScrollArea>

      {/* Message Input */}
      <div className="p-4 border-t">
        <form onSubmit={sendMessage} className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}