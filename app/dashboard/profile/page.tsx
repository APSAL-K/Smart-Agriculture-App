"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useTranslation } from "@/lib/use-translation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { toast } from "sonner"
import { User, Mail, MapPin, Edit2, Save, X, Lock as LockIcon } from "lucide-react"

export default function ProfilePage() {
    const { t } = useTranslation()
    const { user, updateProfile, updatePassword } = useAuth()
    const [isEditing, setIsEditing] = useState(false)

    const [displayName, setDisplayName] = useState(user?.displayName || "")
    const [email, setEmail] = useState(user?.email || "")
    const [location, setLocation] = useState(user?.location || "California, USA")

    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    // Sync state if user object changes (e.g. after initial load)
    useEffect(() => {
        if (user) {
            setDisplayName(user.displayName || "")
            setEmail(user.email || "")
            setLocation(user.location || "California, USA")
        }
    }, [user])

    const handleSave = async () => {
        if (newPassword && newPassword !== confirmPassword) {
            toast.error("Passwords do not match")
            return
        }

        try {
            await updateProfile({ displayName, email, location })

            if (newPassword) {
                await updatePassword(newPassword)
                setNewPassword("")
                setConfirmPassword("")
            }

            toast.success("Profile updated successfully")
            setIsEditing(false)
        } catch (error) {
            toast.error("Failed to update profile")
            console.error(error)
        }
    }

    const initials = displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "U"

    return (
        <div className="mx-auto max-w-4xl space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="font-serif text-2xl font-bold tracking-tight sm:text-3xl">
                    {t('profile')}
                </h1>
                {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)}>
                        <Edit2 className="mr-2 h-4 w-4" />
                        {t('edit')}
                    </Button>
                ) : (
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                            <X className="mr-2 h-4 w-4" />
                            {t('cancel')}
                        </Button>
                        <Button onClick={handleSave}>
                            <Save className="mr-2 h-4 w-4" />
                            {t('save')}
                        </Button>
                    </div>
                )}
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-1">
                    <CardContent className="flex flex-col items-center pt-6">
                        <Avatar className="h-24 w-24">
                            <AvatarFallback className="bg-primary/10 text-2xl font-medium text-primary">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <h2 className="mt-4 text-xl font-bold">{displayName || "User"}</h2>
                        <p className="text-sm text-muted-foreground">{email}</p>
                    </CardContent>
                </Card>

                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>User Details</CardTitle>
                        <CardDescription>
                            Basic information about you and your farm.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="displayName">{t('farmName')}</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="displayName"
                                    className="pl-9"
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    disabled={!isEditing}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">{t('email')}</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    className="pl-9"
                                    value={email}
                                    disabled={true}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="location"
                                    className="pl-9"
                                    value={location}
                                    disabled={!isEditing}
                                    onChange={(e) => setLocation(e.target.value)}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="md:col-start-2 md:col-span-2">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <LockIcon className="h-5 w-5 text-primary" />
                            <CardTitle>Security</CardTitle>
                        </div>
                        <CardDescription>
                            Update your password to keep your account secure.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="newPassword">New Password</Label>
                            <Input
                                id="newPassword"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                disabled={!isEditing}
                                placeholder="Enter new password"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                disabled={!isEditing}
                                placeholder="Confirm new password"
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
