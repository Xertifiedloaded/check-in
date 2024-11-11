


'use client'
import { useState, useEffect } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ChatList } from './ChatList'
import { ChatWindow } from './ChatWindow'

export default function ChatLayout() {
  const [selectedUser, setSelectedUser] = useState(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <div className="lg:min-w-[80%] w-full h-screen overflow-hidden  bg-white dark:bg-gray-800 shadow-xl">
        <div className="flex h-full">

          <div
            className={`${
              isMobile && selectedUser ? 'hidden' : 'flex'
            } w-full md:w-[350px] flex-col border-r border-gray-200 dark:border-gray-700`}
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                Messages
              </h1>
            </div>
            <ScrollArea className="flex-1">
              <ChatList onSelectUser={setSelectedUser} />
            </ScrollArea>
          </div>

          <div
            className={`${
              isMobile && !selectedUser ? 'hidden' : 'block'
            } flex-1 bg-gray-50 dark:bg-gray-900`}
          >
            {selectedUser ? (
              <ChatWindow
                user={selectedUser}
                onBack={isMobile ? () => setSelectedUser(null) : undefined}
              />
            ) : (
              <div className="flex justify-center items-center  h-screen">
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </div>
                  <p className="text-lg  text-gray-600 dark:text-gray-300">
                    Select a conversation to start chatting
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}