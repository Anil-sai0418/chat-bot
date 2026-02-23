import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Mail, User, Shield, Key, Bell, Camera } from "lucide-react";

export default function ProfilePage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-5xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Profile Settings</h1>
                <p className="text-muted-foreground mt-2">Manage your account settings and preferences.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Navigation Sidebar */}
                <div className="col-span-1 space-y-2">
                    <nav className="flex flex-col gap-2">
                        <Button variant="secondary" className="justify-start gap-2 shadow-sm">
                            <User className="h-4 w-4" />
                            General
                        </Button>
                        <Button variant="ghost" className="justify-start gap-2">
                            <Shield className="h-4 w-4" />
                            Security
                        </Button>
                        <Button variant="ghost" className="justify-start gap-2">
                            <Bell className="h-4 w-4" />
                            Notifications
                        </Button>
                        <Button variant="ghost" className="justify-start gap-2">
                            <Key className="h-4 w-4" />
                            API Keys
                        </Button>
                    </nav>
                </div>

                {/* Main Content */}
                <div className="col-span-1 md:col-span-3 space-y-8">
                    {/* Public Profile Section */}
                    <Card className="border-border/50 shadow-sm transition-all hover:shadow-md">
                        <CardHeader>
                            <CardTitle>Public Profile</CardTitle>
                            <CardDescription>
                                This information will be displayed publicly so be careful what you share.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex flex-col sm:flex-row items-center gap-6">
                                <div className="relative group cursor-pointer">
                                    <Avatar className="h-24 w-24 border-2 border-primary/10 transition-all group-hover:border-primary/30">
                                        <AvatarImage src="https://github.com/shadcn.png" alt="Avatar" />
                                        <AvatarFallback>UN</AvatarFallback>
                                    </Avatar>
                                    <div className="absolute inset-0 bg-background/60 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Camera className="h-6 w-6 text-foreground" />
                                    </div>
                                </div>
                                <div className="space-y-1 text-center sm:text-left">
                                    <h3 className="font-medium text-foreground">Profile Picture</h3>
                                    <p className="text-sm text-muted-foreground">
                                        JPG, GIF or PNG. 1MB max.
                                    </p>
                                    <div className="pt-2 flex flex-wrap gap-2 justify-center sm:justify-start">
                                        <Button variant="outline" size="sm">Upload new</Button>
                                        <Button variant="ghost" size="sm" className="text-destructive">Remove</Button>
                                    </div>
                                </div>
                            </div>

                            <Separator className="bg-border/50" />

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="first-name">First Name</Label>
                                    <Input id="first-name" placeholder="John" defaultValue="Anil" className="bg-background/50 focus:bg-background transition-colors" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="last-name">Last Name</Label>
                                    <Input id="last-name" placeholder="Doe" defaultValue="Sai" className="bg-background/50 focus:bg-background transition-colors" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="username">Username</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-muted-foreground text-sm">@</span>
                                    <Input id="username" placeholder="johndoe" defaultValue="anilsai" className="pl-8 bg-background/50 focus:bg-background transition-colors" />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="bg-muted/30 border-t border-border/50 flex justify-end gap-2 p-4">
                            <Button variant="outline">Discard</Button>
                            <Button>Save Changes</Button>
                        </CardFooter>
                    </Card>

                    {/* Email Settings Section */}
                    <Card className="border-border/50 shadow-sm transition-all hover:shadow-md">
                        <CardHeader>
                            <CardTitle>Email Addresses</CardTitle>
                            <CardDescription>
                                Manage your email addresses and preferences.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-4 border border-border/50 rounded-lg bg-background/50">
                                <div className="flex items-center gap-3">
                                    <div className="bg-primary/10 p-2 rounded-full">
                                        <Mail className="h-4 w-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm text-foreground">hello@anilsai.com</p>
                                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                                            <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span> Primary Email
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2 pt-2">
                                <Label htmlFor="add-email">Add new email</Label>
                                <div className="flex gap-2">
                                    <Input id="add-email" placeholder="example@email.com" className="bg-background/50 focus:bg-background transition-colors" />
                                    <Button variant="secondary">Add</Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
