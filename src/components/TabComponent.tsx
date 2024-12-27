import React, { useState, useEffect, useMemo } from "react";
import DailyCheckin from './Heading';
import { ListTodo, Plus, Check } from "lucide-react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";


function TaskComponent() {
    const { toast } = useToast();
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
                return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            case "pending":
                return sorted.sort((a, b) => a.completed - b.completed || new Date(b.createdAt) - new Date(a.createdAt));
            case "completed":
                return sorted.sort((a, b) => b.completed - a.completed || new Date(b.createdAt) - new Date(a.createdAt));
            default:
                return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
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
            const data = await response.json();
            setTasks(data);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to fetch tasks.",
            });
        }
    };

    const handleAddTask = async (e) => {
        e.preventDefault();
        if (!userId) {
            return toast({
                variant: "destructive",
                title: "Error",
                description: "Please login to add tasks.",
            });
        }
        if (!newTask.trim()) {
            return toast({
                variant: "warning",
                title: "Warning",
                description: "Task cannot be empty.",
            });
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
            toast({
                variant: "default",
                title: "Success",
                description: "Task added successfully!",
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to add task.",
            });
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
            toast({
                variant: "default",
                title: "Success",
                description: "Task updated successfully!",
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to update task.",
            });
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

                <Select value={sortBy} onValueChange={setSortBy} disabled={!userId}>
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
                            className={`flex items-center justify-between p-3 border rounded-lg ${
                                task.completed
                                    ? "bg-green-50 border-green-200"
                                    : "hover:border-violet-200"
                            }`}
                        >
                            <div className="flex-1">
                                <span className={task.completed ? "line-through text-gray-500" : ""}>
                                    {task.content}
                                </span>
                            </div>
                            <div>
                                {!task.completed && (
                                    <Button
                                        onClick={() => handleToggleTask(task.id)}
                                        size="sm"
                                        variant="ghost"
                                    >
                                        <Check />
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}
                    {tasks.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            <p>No tasks yet. Add your first task above!</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

export default TaskComponent;
