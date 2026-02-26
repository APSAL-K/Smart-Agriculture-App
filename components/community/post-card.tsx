"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { Heart, MessageSquare, Share2, MoreVertical, ThumbsUp } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { CommunityPost } from "@/lib/types"
import { likePost } from "@/lib/community-service"
import { useAuth } from "@/lib/auth-context"

interface PostCardProps {
    post: CommunityPost
}

export function PostCard({ post }: PostCardProps) {
    const { user } = useAuth()
    const [isLiking, setIsLiking] = useState(false)
    const isLiked = user ? post.likes?.includes(user.uid) : false
    const likesCount = post.likes?.length || 0
    const commentsCount = post.comments ? Object.keys(post.comments).length : 0

    const handleLike = async () => {
        if (!user || isLiking) return
        setIsLiking(true)
        try {
            await likePost(post.id, user.uid)
        } finally {
            setIsLiking(false)
        }
    }

    const typeConfig = {
        question: { label: "Question", color: "bg-blue-500/10 text-blue-500" },
        success_story: { label: "Success Story", color: "bg-green-500/10 text-green-500" },
        farming_tip: { label: "Farming Tip", color: "bg-amber-500/10 text-amber-500" },
    }

    return (
        <Card className="overflow-hidden border-none bg-card/40 backdrop-blur-xl shadow-xl rounded-2xl transition-all hover:shadow-primary/5">
            <CardHeader className="p-5 flex-row items-start justify-between space-y-0">
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border-2 border-primary/20">
                        <AvatarFallback className="bg-primary/5 text-primary">
                            {post.authorName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-foreground">{post.authorName}</span>
                            <Badge variant="secondary" className={cn("text-[10px] uppercase font-black px-1.5 h-4", typeConfig[post.type].color)}>
                                {typeConfig[post.type].label}
                            </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground font-medium">
                            {formatDistanceToNow(post.timestamp)} ago
                        </p>
                    </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                    <MoreVertical className="h-4 w-4" />
                </Button>
            </CardHeader>

            <CardContent className="px-5 pb-4 space-y-3">
                <h3 className="text-lg font-black tracking-tight text-foreground leading-tight">
                    {post.title}
                </h3>
                <p className="text-sm text-balance text-foreground/80 leading-relaxed max-w-prose">
                    {post.content}
                </p>

                {post.farmInfo && (
                    <div className="mt-4 p-3 rounded-xl bg-primary/5 border border-primary/10 flex items-center gap-4">
                        <div className="flex-1 space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-widest text-primary">Farm Context</p>
                            <p className="text-xs font-bold text-foreground">
                                {post.farmInfo.cropType} • {post.farmInfo.farmSize} acres
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-black uppercase tracking-widest text-primary">System</p>
                            <p className="text-xs font-bold text-foreground truncate max-w-[100px]">
                                {post.farmInfo.irrigationMethod}
                            </p>
                        </div>
                    </div>
                )}
            </CardContent>

            <CardFooter className="p-4 pt-2 flex items-center gap-4 border-t border-border/10">
                <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                        "h-9 gap-2 font-bold px-3 transition-colors",
                        isLiked ? "text-primary bg-primary/5" : "text-muted-foreground"
                    )}
                    onClick={handleLike}
                    disabled={isLiking}
                >
                    <ThumbsUp className={cn("h-4 w-4 transition-transform", isLiked && "scale-110 fill-current")} />
                    <span className="text-xs">{likesCount}</span>
                </Button>
                <Button variant="ghost" size="sm" className="h-9 gap-2 text-muted-foreground font-bold px-3">
                    <MessageSquare className="h-4 w-4" />
                    <span className="text-xs">{commentsCount}</span>
                </Button>
                <Button variant="ghost" size="sm" className="h-9 text-muted-foreground ml-auto">
                    <Share2 className="h-4 w-4" />
                </Button>
            </CardFooter>
        </Card>
    )
}
