// // components/chat/chat-list.tsx
// 'use client'

// import { useEffect, useState } from 'react'
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
// import { ScrollArea } from '@/components/ui/scroll-area'
// import { Input } from '@/components/ui/input'
// import { Search } from 'lucide-react'
// import { formatDistanceToNow } from 'date-fns'

// interface Chat {
//   id: string
//   lastMessage: string
//   updatedAt: string
//   otherUser: {
//     id: string
//     name: string
//     image?: string
//   }
// }

// export function ChatList({ onSelectUser }) {
//   const [chats, setChats] = useState<Chat[]>([])
//   const [searchQuery, setSearchQuery] = useState('')
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     loadChats()
//   }, [])

//   const loadChats = async () => {
//     try {
//       const response = await fetch('/api/chats')
//       const data = await response.json()
//       setChats(data)
//     } catch (error) {
//       console.error('Error loading chats:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const searchUsers = async (query: string) => {
//     if (!query.trim()) {
//       loadChats()
//       return
//     }

//     try {
//       const response = await fetch(`/api/chat/search?q=${query}`)
//       const users = await response.json()
//       // Transform users to chat-like format for consistent rendering
//       const searchResults = users.map((user: any) => ({
//         id: `search-${user.id}`,
//         otherUser: user,
//         lastMessage: null,
//         updatedAt: null,
//       }))
//       setChats(searchResults)
//     } catch (error) {
//       console.error('Error searching users:', error)
//     }
//   }

//   return (
//     <div className="flex flex-col h-full">
//       <div className="p-4">
//         <div className="relative">
//           <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//           <Input
//             placeholder="Search users..."
//             className="pl-9"
//             value={searchQuery}
//             onChange={(e) => {
//               setSearchQuery(e.target.value)
//               searchUsers(e.target.value)
//             }}
//           />
//         </div>
//       </div>

//       {loading ? (
//         <div className="flex-1 flex items-center justify-center">
//           <p className="text-muted-foreground">Loading...</p>
//         </div>
//       ) : (
//         <ScrollArea className="flex-1">
//           {chats.map((chat) => (
//             <div
//               key={chat.id}
//               className="p-4 hover:bg-accent cursor-pointer"
//               onClick={() => onSelectUser(chat.otherUser)}
//             >
//               <div className="flex items-center gap-4">
//                 <Avatar>
//                   <AvatarImage src={chat.otherUser.image} />
//                   <AvatarFallback>
//                     {chat.otherUser.name.charAt(0).toUpperCase()}
//                   </AvatarFallback>
//                 </Avatar>
//                 <div className="flex-1 min-w-0">
//                   <div className="flex justify-between items-center">
//                     <p className="font-medium truncate">{chat.otherUser.name}</p>
//                     {chat.updatedAt && (
//                       <span className="text-xs text-muted-foreground">
//                         {formatDistanceToNow(new Date(chat.updatedAt), { addSuffix: true })}
//                       </span>
//                     )}
//                   </div>
//                   {chat.lastMessage && (
//                     <p className="text-sm text-muted-foreground truncate">
//                       {chat.lastMessage}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </ScrollArea>
//       )}
//     </div>
//   )
// }




'use client'

import { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

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

  useEffect(() => {
    loadChats()
  }, [])

  // Fetch the list of chats with users
  const loadChats = async () => {
    try {
      const response = await fetch('/api/chat-route/chatted-list')
      const data = await response.json()
      setChats(data)
    } catch (error) {
      console.error('Error loading chats:', error)
    } finally {
      setLoading(false)
    }
  }


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
    } catch (error) {
      console.error('Error searching users:', error)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              searchUsers(e.target.value)
            }}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      ) : (
        <ScrollArea className="flex-1">
          {chats?.map((chat) => (
            <div
              key={chat.id}
              className="p-4 hover:bg-accent cursor-pointer"
              onClick={() => onSelectUser(chat.otherUser)} 
            >
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={chat.otherUser.profilePicture} />
                  <AvatarFallback>
                    {chat.otherUser.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <p className="font-medium truncate">{chat.otherUser.name}</p>
                    {chat.updatedAt && (
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(chat.updatedAt), { addSuffix: true })}
                      </span>
                    )}
                  </div>
                  {chat?.lastMessage && (
                    <p className="text-sm text-muted-foreground truncate">
                      {chat.lastMessage}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>
      )}
    </div>
  )
}
