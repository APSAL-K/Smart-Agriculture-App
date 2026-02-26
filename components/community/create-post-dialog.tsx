"use client"

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle, Sparkles, Send } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { createPost } from "@/lib/community-service"
import { toast } from "sonner"
import type { PostType } from "@/lib/types"

export function CreatePostDialog() {
    const { user } = useAuth()
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        type: "question" as PostType
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) return

        if (!formData.title.trim() || !formData.content.trim()) {
            toast.error("Please fill in all fields")
            return
        }

        setLoading(true)
        try {
            await createPost({
                authorId: user.uid,
                authorName: user.displayName || "Unknown Farmer",
                title: formData.title,
                content: formData.content,
                type: formData.type,
                farmInfo: user.farmInfo
            })
            toast.success("Post shared successfully!")
            setOpen(false)
            setFormData({ title: "", content: "", type: "question" })
        } catch (error) {
            console.error(error)
            toast.error("Failed to share post")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2 rounded-2xl bg-primary shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 px-6">
                    <PlusCircle className="h-5 w-5" />
                    <span className="font-bold">Share Something</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] border-none bg-card/95 backdrop-blur-2xl shadow-2xl rounded-3xl p-0 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none" />

                <DialogHeader className="p-6 pb-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-2xl bg-primary/10 text-primary">
                            <Sparkles className="h-6 w-6" />
                        </div>
                        <div>
                            <DialogTitle className="text-2xl font-black tracking-tight uppercase">Community Post</DialogTitle>
                            <p className="text-sm font-medium text-muted-foreground">Share insights with fellow farmers</p>
                        </div>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="type" className="text-xs font-black uppercase tracking-widest text-muted-foreground px-1">Content Type</Label>
                            <Select
                                value={formData.type}
                                onValueChange={(v: any) => setFormData(p => ({ ...p, type: v }))}
                            >
                                <SelectTrigger className="rounded-xl border-primary/10 bg-muted/20 h-11 focus:ring-primary/20">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-primary/10">
                                    <SelectItem value="question">Ask a Question</SelectItem>
                                    <SelectItem value="farming_tip">Share a Farming Tip</SelectItem>
                                    <SelectItem value="success_story">Success Story</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="title" className="text-xs font-black uppercase tracking-widest text-muted-foreground px-1">Title</Label>
                            <Input
                                id="title"
                                placeholder="Briefly describe your topic..."
                                className="rounded-xl border-primary/10 bg-muted/20 h-11 focus:ring-primary/20"
                                value={formData.title}
                                onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
                                maxLength={100}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="content" className="text-xs font-black uppercase tracking-widest text-muted-foreground px-1">Details</Label>
                            <Textarea
                                id="content"
                                placeholder="Share your experience or ask your question in detail..."
                                className="rounded-xl border-primary/10 bg-muted/20 min-h-[120px] focus:ring-primary/20 resize-none p-4"
                                value={formData.content}
                                onChange={e => setFormData(p => ({ ...p, content: e.target.value }))}
                            />
                        </div>
                    </div>

                    <DialogFooter className="pt-2">
                        <Button
                            type="submit"
                            className="w-full gap-2 rounded-xl bg-primary h-12 shadow-lg shadow-primary/20 font-black uppercase tracking-widest transition-all hover:translate-y-[-2px]"
                            disabled={loading}
                        >
                            {loading ? "Sharing..." : <><Send className="h-4 w-4" /> Post to Community</>}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
