


'use client'
import { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Search, MessageCircle } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { motion } from 'framer-motion'

interface Chat {
  id: string
  lastMessage: string | null
  updatedAt: string | null
  otherUser: {
    id: string
    name: string
    profilePicture?: string
  }
}

export function ChatList({ onSelectUser }: { onSelectUser: (user: any) => void }) {
  const [chats, setChats] = useState<Chat[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [showStartChat, setShowStartChat] = useState(false)

  useEffect(() => {
    loadChats()
  }, [])

  const loadChats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/chat/chatted-list');
      const data = await response.json();
      if (Array.isArray(data)) {
        setChats(data);
        setShowStartChat(data.length === 0);
      } else {
        console.error('Unexpected data format:', data);
        setShowStartChat(true);
      }
    } catch (error) {
      console.error('Error loading chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchUsers = async (query: string) => {
    if (!query.trim()) {
      loadChats()
      return
    }

    try {
      const response = await fetch(`/api/chat/search?q=${query}`)
      const users = await response.json()
      const searchResults = users.map((user: any) => ({
        id: `search-${user.id}`,
        otherUser: user,
        lastMessage: null,
        updatedAt: null
      }))
      setChats(searchResults)
      setShowStartChat(false)
    } catch (error) {
      console.error('Error searching users:', error)
    }
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800">
      {/* Search Section */}
      <div className="p-4 sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <Input
            placeholder="Search users..."
            className="pl-10 w-full bg-gray-50 dark:bg-gray-700 border-0 rounded-xl focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              searchUsers(e.target.value)
            }}
          />
        </div>
      </div>

      {/* Chat List Section */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-3">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
            <p className="text-gray-500 dark:text-gray-400">Loading conversations...</p>
          </div>
        </div>
      ) : (
        <ScrollArea className="flex-1 px-2">
          {showStartChat ? (
            <div className="flex flex-col items-center justify-center h-full p-8">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-4">
                <MessageCircle className="h-8 w-8 text-purple-500 dark:text-purple-400" />
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                Start a new chat by searching for users above
              </p>
            </div>
          ) : (
            <div className="space-y-1 py-2">
              {chats.map((chat, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  key={chat.id}
                  className="group rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-all duration-200"
                  onClick={() => onSelectUser(chat.otherUser)}
                >
                  <div className="p-3 flex items-center space-x-4">
                    <Avatar className="h-12 w-12 ring-2 ring-offset-2 ring-purple-500/10 group-hover:ring-purple-500/50 transition-all duration-200">
                      <AvatarImage 
                        src={chat.otherUser.profilePicture} 
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                        {chat.otherUser.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                          {chat.otherUser.name}
                        </p>
                        {chat.updatedAt && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDistanceToNow(new Date(chat.updatedAt), {
                              addSuffix: true
                            })}
                          </span>
                        )}
                      </div>
                      {chat?.lastMessage && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">
                          {chat.lastMessage}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </ScrollArea>
      )}

      {showStartChat && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 md:hidden">
          <button className="w-full py-3 px-4 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-medium transition-colors duration-200">
            Start New Chat
          </button>
        </div>
      )}
    </div>
  )
}