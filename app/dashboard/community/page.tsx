"use client"

import { useTranslation } from "@/lib/use-translation"
import { Users, Sparkles } from "lucide-react"
import { PostList } from "@/components/community/post-list"
import { CreatePostDialog } from "@/components/community/create-post-dialog"
import { Badge } from "@/components/ui/badge"

export default function CommunityPage() {
    const { t } = useTranslation()

    return (
        <div className="mx-auto max-w-5xl space-y-8 animate-in fade-in duration-500 px-4 py-8">
            {/* Premium Header */}
            <section className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-primary/10 text-primary">
                            <Users className="h-5 w-5" />
                        </div>
                        <Badge variant="outline" className="text-[10px] font-black uppercase tracking-wider bg-background/50 backdrop-blur-sm border-primary/20">
                            Rural Empowerment Hub
                        </Badge>
                    </div>
                    <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl md:text-5xl">
                        Community Knowledge
                    </h1>
                    <p className="text-sm font-medium text-muted-foreground/80 max-w-lg leading-relaxed">
                        Collaborate with farmers worldwide. Share tips, ask expert questions, and celebrate agricultural success stories in our trusted network.
                    </p>
                </div>

                <div className="shrink-0 pb-1">
                    <CreatePostDialog />
                </div>
            </section>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                {/* Main Feed */}
                <div className="lg:col-span-8">
                    <PostList />
                </div>

                {/* Sidebar Info */}
                <div className="lg:col-span-4 space-y-6 hidden lg:block">
                    <div className="rounded-3xl bg-gradient-to-br from-primary/20 via-primary/5 to-background p-6 border border-primary/10 shadow-xl relative overflow-hidden group">
                        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/10 blur-3xl transition-all group-hover:bg-primary/20" />
                        <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary mb-4">
                            <Sparkles className="h-4 w-4" />
                            Community Guidelines
                        </h4>
                        <ul className="space-y-4">
                            <li className="flex gap-3 items-start">
                                <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                                <p className="text-xs font-bold text-foreground/80 leading-relaxed">Share verified farming techniques and data-driven insights.</p>
                            </li>
                            <li className="flex gap-3 items-start">
                                <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                                <p className="text-xs font-bold text-foreground/80 leading-relaxed">Support fellow farmers with constructive feedback and encouragement.</p>
                            </li>
                            <li className="flex gap-3 items-start">
                                <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                                <p className="text-xs font-bold text-foreground/80 leading-relaxed">Keep discussions professional and focused on agricultural growth.</p>
                            </li>
                        </ul>
                    </div>

                    <div className="rounded-3xl bg-card/40 backdrop-blur-xl p-6 border border-border/50 shadow-lg">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Top Contributors</h4>
                        <div className="space-y-4">
                            {[
                                { name: "Suresh Kumar", posts: 24, initials: "SK" },
                                { name: "Priya Singh", posts: 18, initials: "PS" },
                                { name: "Rajesh S.", posts: 12, initials: "RS" }
                            ].map((c, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold border border-border/50">
                                        {c.initials}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs font-bold text-foreground line-none">{c.name}</p>
                                        <p className="text-[10px] text-muted-foreground">{c.posts} knowledge shares</p>
                                    </div>
                                    <Badge variant="outline" className="h-4 text-[8px] border-primary/20 text-primary">Expert</Badge>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
