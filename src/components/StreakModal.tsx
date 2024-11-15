
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog"
  import { Input } from "@/components/ui/input"
  import { Button } from "@/components/ui/button"
  import { useState } from "react"
import axios from "axios"
  
  interface StreakModalProps {
    isOpen: boolean
    onClose: () => void
    user: any
  }
  
  export function StreakModal({ isOpen, onClose, user }: StreakModalProps) {
    const [streak, setStreak] = useState(user?.streak || 0)
  
    const handleStreakUpdate = async () => {
      try {
        const response = await axios.put(`/api/user/action/streak?userId=${user?.id}`, {
            currentStreak: streak,
          });
        if (!response) throw new Error('Failed to update streak')
        onClose()
      } catch (error) {
        console.error('Error updating streak:', error)
      }
    }
  
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Streak</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-4">
              <Input
                type="number"
                value={streak}
                onChange={(e) => setStreak(Number(e.target.value))}
                min={0}
              />
              <Button onClick={handleStreakUpdate}>Update</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }