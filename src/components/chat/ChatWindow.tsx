

'use client'
import { useEffect, useRef, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { formatDistanceToNow } from 'date-fns'
import { Send, ArrowLeft } from 'lucide-react'
import { io } from 'socket.io-client'
import { useSession } from 'next-auth/react'

interface Message {
  id: string
  content: string
  senderId: string
  createdAt: string
}

export function ChatWindow({ user, onBack }) {
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
        const response = await fetch('/api/chat/message', {
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
          `/api/chat/messages?userId=${currentUserId}&otherUserId=${user.id}&page=${page}`
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
        
      } catch (error) {
        console.error('Error loading messages:', error)
      }
    }
  
    const scrollToBottom = () => {
      setTimeout(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  

  return (
    <div className="flex flex-col h-full">
      <div className="h-16 flex items-center px-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        {onBack && (
          <Button
            variant="ghost"
            size="icon"
            className="mr-2"
            onClick={onBack}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <Avatar className="h-10 w-10">
          <AvatarImage src={user.image} />
          <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
            {user.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="ml-4">
          <p className="font-semibold">{user.name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {user.status || 'Online'}
          </p>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        {isLoading ? (
          <div className="flex justify-center">
            <p className="text-gray-500 dark:text-gray-400">Loading messages...</p>
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
                className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                  message.senderId === currentUserId
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700'
                }`}
              >
                <p className="break-words">{message.content}</p>
                <p className="text-xs mt-1 opacity-70">
                  {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={scrollRef} />
      </ScrollArea>

      <div className="p-4 w-full border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <form onSubmit={sendMessage} className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-full bg-gray-100 dark:bg-gray-700 border-0"
          />
          <Button 
            type="submit" 
            size="icon"
            className="rounded-full bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}




