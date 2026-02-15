import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { 
    TrendingUp,
    Users,
    MessageSquare,
    MoreHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const stats = [
    { label: 'Total Views', value: '24.5K', change: '+12%', trend: 'up' },
    { label: 'Active Users', value: '1,234', change: '+5.4%', trend: 'up' },
    { label: 'Engagement', value: '89%', change: '+2.1%', trend: 'up' },
];

const recentActivity = [
    { user: 'Sarah Chen', action: 'commented on your post', time: '2 min ago', avatar: '/avatars/sarah.jpg' },
    { user: 'Mike Ross', action: 'started following you', time: '15 min ago', avatar: '/avatars/mike.jpg' },
    { user: 'Emma Wilson', action: 'liked your photo', time: '1 hour ago', avatar: '/avatars/emma.jpg' },
];

export default function Dashboard() {
    const { auth } = usePage().props as any;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-white tracking-tight">
                        Welcome back, <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">{auth?.user?.name?.split(' ')[0] || 'User'}</span>
                    </h1>
                    <Button className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 rounded-xl">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        View Analytics
                    </Button>
                </div>
            }
        >
            <Head title="Dashboard" />
            
            <div className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {stats.map((stat, idx) => (
                        <Card key={idx} className="bg-slate-900/50 border-slate-800/50 hover:border-slate-700/50 transition-colors group">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-slate-400">{stat.label}</p>
                                        <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                                    </div>
                                    <div className="w-12 h-12 rounded-xl bg-slate-800/50 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <TrendingUp className="w-6 h-6 text-indigo-400" />
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center gap-2">
                                    <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-0">
                                        {stat.change}
                                    </Badge>
                                    <span className="text-xs text-slate-500">vs last month</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Activity Feed */}
                    <Card className="lg:col-span-2 bg-slate-900/50 border-slate-800/50">
                        <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-white text-lg">Recent Activity</CardTitle>
                                    <CardDescription className="text-slate-400">Latest interactions from your network</CardDescription>
                                </div>
                                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                                    View all
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {recentActivity.map((activity, idx) => (
                                <div 
                                    key={idx} 
                                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-800/30 transition-colors group cursor-pointer"
                                >
                                    <Avatar className="w-10 h-10 border-2 border-slate-800 group-hover:border-indigo-500/30 transition-colors">
                                        <AvatarImage src={activity.avatar} />
                                        <AvatarFallback className="bg-slate-700 text-white">
                                            {activity.user.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-white font-medium truncate">
                                            {activity.user} <span className="text-slate-400 font-normal">{activity.action}</span>
                                        </p>
                                        <p className="text-xs text-slate-500 mt-0.5">{activity.time}</p>
                                    </div>
                                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-white">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Quick Stats / Progress */}
                    <Card className="bg-slate-900/50 border-slate-800/50">
                        <CardHeader>
                            <CardTitle className="text-white text-lg">Your Progress</CardTitle>
                            <CardDescription className="text-slate-400">Profile completion and goals</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-300">Profile Completion</span>
                                    <span className="text-indigo-400 font-medium">85%</span>
                                </div>
                                <Progress value={85} className="h-2 bg-slate-800" />
                            </div>
                            
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-300">Weekly Goal</span>
                                    <span className="text-purple-400 font-medium">12/15</span>
                                </div>
                                <Progress value={80} className="h-2 bg-slate-800" />
                            </div>

                            <div className="pt-4 border-t border-slate-800/50">
                                <h4 className="text-sm font-medium text-white mb-3">Quick Actions</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white h-auto py-3 flex-col gap-1">
                                        <Users className="w-4 h-4" />
                                        <span className="text-xs">Invite</span>
                                    </Button>
                                    <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white h-auto py-3 flex-col gap-1">
                                        <MessageSquare className="w-4 h-4" />
                                        <span className="text-xs">Message</span>
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}