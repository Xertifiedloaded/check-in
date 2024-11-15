import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { FaFire, FaTrash } from "react-icons/fa"
import { useState } from "react"
import { StreakModal } from "./StreakModal"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import axios from "axios"

interface User {
    id: string
    name: string
    email: string
    isVerified: boolean
    profilePicture?: string 
    streaks: Array<{ currentStreak: number }>
}

export function UserTable({ users: initialUsers }: { users: User[] }) {
    const [users, setUsers] = useState(initialUsers)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [userToDelete, setUserToDelete] = useState<User | null>(null)
    const { toast } = useToast()

    const handleVerifiedChange = async (userId: string, checked: boolean) => {
        try {
            const response = await fetch(`/api/user/action/verification?userId=${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, isVerified: checked }),
            })
            if (!response.ok) throw new Error('Failed to update verification status')

            setUsers(users.map(user =>
                user.id === userId ? { ...user, isVerified: checked } : user
            ))

            toast({
                title: "Success",
                description: "User verification status updated",
            })
        } catch (error) {
            console.error('Error updating user:', error)
            toast({
                title: "Error",
                description: "Failed to update verification status",
                variant: "destructive",
            })
        }
    }

    const openStreakModal = (user: User) => {
        setSelectedUser(user)
        setIsModalOpen(true)
    }

    const handleDelete = async () => {
        if (!userToDelete) return

        try {
            const response = await axios.delete(`/api/user/action/deleteuser?userId=${userToDelete.id}`);
            if (!response.ok) throw new Error('Failed to delete user')

            setUsers(users.filter(user => user.id !== userToDelete.id))

            toast({
                title: "Success",
                description: "User deleted successfully",
            })
        } catch (error) {
            console.error('Error deleting user:', error)
            toast({
                title: "Error",
                description: "Failed to delete user",
                variant: "destructive",
            })
        } finally {
            setDeleteDialogOpen(false)
            setUserToDelete(null)
        }
    }

    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Profile</TableHead> {/* New Column */}
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Verified</TableHead>
                        <TableHead>Streak</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell>
                                {user.profilePicture ? (
                                    <img
                                        src={user?.profilePicture ?? "/no-user-pic.png"}
                                        alt={`${user.name}'s profile`}
                                        className="h-8 w-8 rounded-full"
                                    />
                                ) : (
                                    <img
                                    src={ "/no-user-pic.png"}
                                    alt={`${user.name}'s profile`}
                                    className="h-8 w-8 rounded-full"
                                />
                                )}
                            </TableCell>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                                <Switch
                                    checked={user.isVerified}
                                    onCheckedChange={(checked) => handleVerifiedChange(user.id, checked)}
                                />
                            </TableCell>
                            <TableCell>{user.streaks[0]?.currentStreak || 'No streak'}</TableCell>
                            <TableCell>
                                <div className="flex gap-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => openStreakModal(user)}
                                    >
                                        <FaFire className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => {
                                            setUserToDelete(user)
                                            setDeleteDialogOpen(true)
                                        }}
                                        className="text-red-500 hover:text-red-700 hover:bg-red-100"
                                    >
                                        <FaTrash className="h-4 w-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <StreakModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                user={selectedUser}
            />

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the user
                            {userToDelete && ` "${userToDelete.name}"`} and all their data.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-red-500 hover:bg-red-700"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
