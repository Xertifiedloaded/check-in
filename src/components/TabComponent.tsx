import React, { useState, useEffect, useMemo } from "react";

import DailyCheckin from './Heading'
import { toast } from "react-toastify";
import {
    Clock,
    Lock,
    Globe,
    Sparkles,
    Image as ImageIcon,
    X,
    ListTodo,
    Plus,
    Check,
} from "lucide-react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";






function TaskComponent() {
    const { data: session } = useSession();
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState("");
    const [loading, setLoading] = useState(false);
    const userId = session?.user?.id;
    const [sortBy, setSortBy] = useState("newest");



    const sortedTasks = useMemo(() => {
        let sorted = [...tasks];
        switch (sortBy) {
            case "oldest":
                return sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
            case "pending":
                return sorted.sort((a, b) => {
                    if (a.completed === b.completed) return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                    return a.completed ? 1 : -1;
                });
            case "completed":
                return sorted.sort((a, b) => {
                    if (a.completed === b.completed) return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                    return b.completed ? 1 : -1;
                });
            default:
                return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }
    }, [tasks, sortBy]);
    useEffect(() => {
        if (userId) {
            fetchTasks();
        }
    }, [userId]);

    const fetchTasks = async () => {
        try {
            const response = await fetch(`/api/task/task?userId=${userId}`);
            if (!response.ok) throw new Error("Failed to fetch tasks");
            console.log(response);

            const data = await response.json();
            setTasks(data);
        } catch (error) {
            toast.error("Failed to fetch tasks");
        }
    };

    const handleAddTask = async (e) => {
        e.preventDefault();
        if (!userId) {
            return toast.warning("Please login to add tasks");
        }
        if (!newTask.trim()) {
            return toast.warning("Task cannot be empty");
        }

        setLoading(true);
        try {
            const response = await fetch("/api/task/task", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ content: newTask }),
            });

            if (!response.ok) throw new Error("Failed to add task");

            await fetchTasks();
            setNewTask("");
            toast.success("Task added successfully!");
        } catch (error) {
            toast.error("Failed to add task");
        } finally {
            setLoading(false);
        }
    };

    const handleToggleTask = async (taskId) => {
        try {
            const response = await fetch(`/api/task/${taskId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ completed: true }),
            });

            if (!response.ok) throw new Error("Failed to update task");

            await fetchTasks();
            toast.success("Task updated successfully!");
        } catch (error) {
            toast.error("Failed to update task");
        }
    };

    return (
        <Card>
            <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-t-lg text-white">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg">
                            <ListTodo className="w-6 h-6" />
                        </div>
                        <CardTitle>My Tasks</CardTitle>
                    </div>
                </div>
                <CardDescription className="text-white/90">
                    Keep track of your personal tasks and goals
                </CardDescription>
                <CardDescription className="text-white/90 text-xs">
                    Only you can see your tasks
                </CardDescription>
            </CardHeader>

            <CardContent className="pt-6">
                <form onSubmit={handleAddTask} className="space-y-4">
                    <div className="flex gap-2">
                        <Input
                            placeholder={userId ? "Add a new task..." : "Please login to add tasks..."}
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                            disabled={!userId}
                        />
                        <Button
                            type="submit"
                            disabled={!userId || !newTask.trim() || loading}
                            className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Task
                        </Button>
                    </div>
                </form>

                <Select value={sortBy} disabled={!userId || !newTask.trim() || loading} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[200px] mt-2">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="newest">Newest First</SelectItem>
                        <SelectItem value="oldest">Oldest First</SelectItem>
                        <SelectItem value="pending">Pending First</SelectItem>
                        <SelectItem value="completed">Completed First</SelectItem>
                    </SelectContent>
                </Select>

                <div className="mt-6 space-y-2">
                    {sortedTasks.map((task) => (
                        <div
                            key={task.id}
                            className={cn(
                                "flex items-center justify-between p-3 border rounded-lg transition-colors duration-200",
                                task.completed
                                    ? "bg-green-50/50 dark:bg-green-900/10 border-green-200 dark:border-green-900/30"
                                    : "hover:border-violet-200 dark:hover:border-violet-800"
                            )}
                        >
                            <div className="flex flex-col flex-1">
                                <div className="flex items-center gap-2">
                                    <span
                                        className={cn(
                                            "text-base",
                                            task.completed && "text-gray-500 line-through"
                                        )}
                                    >
                                        {task.content}
                                    </span>
                                    <span
                                        className={cn(
                                            "px-2 py-0.5 rounded-full text-xs font-medium",
                                            task.completed
                                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                : "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400"
                                        )}
                                    >
                                        {task.completed ? "Completed" : "Pending"}
                                    </span>
                                </div>
                                <span className="text-xs text-gray-500 mt-1">
                                    {new Date(task.createdAt).toLocaleString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: true
                                    })}
                                </span>
                            </div>
                            <div className="flex items-center">
                                {!task.completed ? (
                                    <Button
                                        onClick={() => handleToggleTask(task.id)}
                                        size="sm"
                                        variant="ghost"
                                        className="relative group"
                                    >
                                        <span className="absolute -inset-1 rounded-full bg-green-100 dark:bg-green-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                                        <Check className="w-5 h-5 text-green-600 dark:text-green-400 relative z-10 transition-transform group-hover:scale-110" />
                                    </Button>
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                        <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {tasks.length === 0 && (
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                            <div className="mb-2">
                                <ListTodo className="w-12 h-12 mx-auto opacity-50" />
                            </div>
                            <p>No tasks yet. Add your first task above!</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}




export default function TabsWrapper() {
    return (
        <div className="max-w-2xl mx-auto p-4">
            <Tabs defaultValue="checkin">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="checkin">Daily Check-in</TabsTrigger>
                    <TabsTrigger value="tasks">My Tasks</TabsTrigger>
                </TabsList>

                <TabsContent value="checkin">
                    <DailyCheckin />
                </TabsContent>

                <TabsContent value="tasks">
                    <TaskComponent />
                </TabsContent>
            </Tabs>
        </div>
    );
}