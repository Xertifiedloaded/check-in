
'use client'

import { useState } from 'react'

import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { ChatList } from './ChatList'
import { ChatWindow } from './ChatWindow'


export default function ChatLayout() {
  const [selectedUser, setSelectedUser] = useState(null)

  return (
    <div className="flex h-screen">
      <div className="w-[300px] border-r">
        <div className="flex h-16 items-center px-4 justify-between">
          <h1 className="text-xl font-semibold">Messages</h1>

        </div>
        <Separator />
        <ScrollArea className="h-[calc(100vh-4rem)]">
          <ChatList onSelectUser={setSelectedUser} />
        </ScrollArea>
      </div>

      <div className="flex-1">
        {selectedUser ? (
          <ChatWindow user={selectedUser} />
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-muted-foreground">Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  )
}