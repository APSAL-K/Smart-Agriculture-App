"use client"

import { useEffect, useState } from "react"
import { subscribeToPosts } from "@/lib/community-service"
import { PostCard } from "./post-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, MessageSquare, Filter } from "lucide-react"
import type { CommunityPost, PostType } from "@/lib/types"

export function PostList() {
    const [posts, setPosts] = useState<CommunityPost[]>([])
    const [filter, setFilter] = useState<PostType | "all">("all")
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        const unsubscribe = subscribeToPosts((updatedPosts) => {
            setPosts(updatedPosts)
            setLoading(false)
        })
        return () => unsubscribe()
    }, [])

    const filteredPosts = filter === "all"
        ? posts
        : posts.filter(p => p.type === filter)

    if (loading) {
        return (
            <div className="space-y-6">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-[200px] w-full animate-pulse rounded-2xl bg-muted/40 border border-primary/5" />
                ))}
            </div>
        )
    }

    return (
        <div className="space-y-8 pb-12">
            {/* Filter Chips */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
                <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0">
                    <Filter className="h-4 w-4" />
                </div>
                <Button
                    variant={filter === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter("all")}
                    className="rounded-xl px-4 font-bold text-xs uppercase tracking-widest transition-all"
                >
                    All Feed
                </Button>
                <Button
                    variant={filter === "farming_tip" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter("farming_tip")}
                    className="rounded-xl px-4 font-bold text-xs uppercase tracking-widest border-amber-500/20 hover:bg-amber-500/10 hover:text-amber-500 transition-all"
                >
                    Farming Tips
                </Button>
                <Button
                    variant={filter === "question" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter("question")}
                    className="rounded-xl px-4 font-bold text-xs uppercase tracking-widest border-blue-500/20 hover:bg-blue-500/10 hover:text-blue-500 transition-all"
                >
                    Questions
                </Button>
                <Button
                    variant={filter === "success_story" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter("success_story")}
                    className="rounded-xl px-4 font-bold text-xs uppercase tracking-widest border-green-500/20 hover:bg-green-500/10 hover:text-green-500 transition-all"
                >
                    Success Stories
                </Button>
            </div>

            {filteredPosts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center space-y-4 rounded-3xl bg-muted/20 border border-dashed border-primary/10">
                    <div className="relative">
                        <div className="absolute -inset-4 bg-primary/10 rounded-full blur-xl animate-pulse" />
                        <Sparkles className="h-16 w-16 text-primary/30" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-xl font-black tracking-tight text-foreground uppercase">The feed is quiet</h3>
                        <p className="text-sm text-muted-foreground max-w-[280px] font-medium leading-relaxed">
                            No posts found in this category. Be the first to share your farming journey!
                        </p>
                    </div>
                </div>
            ) : (
                <div className="grid gap-6">
                    {filteredPosts.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </div>
            )}
        </div>
    )
}
