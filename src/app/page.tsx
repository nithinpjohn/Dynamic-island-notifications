"use client";

import { useNotifications } from '@/contexts/NotificationContext';
import { DynamicIsland } from '@/components/DynamicIsland';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Bell, MessageSquare, Mail, Calendar, Heart, ShoppingCart } from 'lucide-react';

const notificationTemplates = [
  { title: "New Message", message: "Hey! How are you doing today?", icon: "💬" },
  { title: "Email Received", message: "You have a new email from john@example.com", icon: "📧" },
  { title: "Calendar Reminder", message: "Meeting starts in 15 minutes", icon: "📅" },
  { title: "New Like", message: "Sarah liked your post", icon: "❤️" },
  { title: "Order Shipped", message: "Your order #12345 has been shipped", icon: "📦" },
  { title: "Comment Added", message: "John commented on your photo", icon: "💭" },
  { title: "Payment Received", message: "You received $100.00", icon: "💰" },
  { title: "Friend Request", message: "Mike sent you a friend request", icon: "👋" },
];

export default function Home() {
  const { addNotification } = useNotifications();

  const triggerRandomNotification = () => {
    const template = notificationTemplates[Math.floor(Math.random() * notificationTemplates.length)];
    addNotification(template);
  };

  const triggerMultipleNotifications = () => {
    notificationTemplates.slice(0, 3).forEach((template, index) => {
      setTimeout(() => {
        addNotification(template);
      }, index * 800);
    });
  };

  return (
    <>
      <DynamicIsland />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16 pt-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl mb-6 shadow-lg">
                <Bell className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Dynamic Island Notifications
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Experience iPhone-inspired notification system with smooth animations. 
                Hover over the dynamic island at the top to see your latest notifications.
              </p>
            </div>

            {/* Demo Cards */}
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <Card className="p-8 hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center">
                    <Bell className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold">Single Notification</h3>
                </div>
                <p className="text-muted-foreground mb-6">
                  Trigger a random notification to see the dynamic island in action.
                </p>
                <Button 
                  onClick={triggerRandomNotification}
                  className="w-full"
                  size="lg"
                >
                  Send Notification
                </Button>
              </Card>

              <Card className="p-8 hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold">Multiple Notifications</h3>
                </div>
                <p className="text-muted-foreground mb-6">
                  Send multiple notifications in sequence to test the queue system.
                </p>
                <Button 
                  onClick={triggerMultipleNotifications}
                  className="w-full"
                  size="lg"
                  variant="outline"
                >
                  Send Multiple
                </Button>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="p-8">
              <h3 className="text-xl font-semibold mb-6">Quick Notification Templates</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button
                  variant="outline"
                  className="h-auto py-4 flex-col gap-2"
                  onClick={() => addNotification({ title: "New Message", message: "You have a new message from Sarah", icon: "💬" })}
                >
                  <MessageSquare className="w-5 h-5" />
                  <span className="text-xs">Message</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-4 flex-col gap-2"
                  onClick={() => addNotification({ title: "Email Received", message: "New email in your inbox", icon: "📧" })}
                >
                  <Mail className="w-5 h-5" />
                  <span className="text-xs">Email</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-4 flex-col gap-2"
                  onClick={() => addNotification({ title: "Calendar Event", message: "Meeting in 30 minutes", icon: "📅" })}
                >
                  <Calendar className="w-5 h-5" />
                  <span className="text-xs">Calendar</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-4 flex-col gap-2"
                  onClick={() => addNotification({ title: "Order Update", message: "Your order has shipped!", icon: "📦" })}
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span className="text-xs">Order</span>
                </Button>
              </div>
            </Card>

            {/* Features */}
            <div className="mt-16 grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">✨</span>
                </div>
                <h4 className="font-semibold mb-2">Smooth Animations</h4>
                <p className="text-sm text-muted-foreground">
                  Fluid transitions powered by Framer Motion
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🎨</span>
                </div>
                <h4 className="font-semibold mb-2">Minimal Design</h4>
                <p className="text-sm text-muted-foreground">
                  Clean, iPhone-inspired aesthetic
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">⚡</span>
                </div>
                <h4 className="font-semibold mb-2">Real-time Updates</h4>
                <p className="text-sm text-muted-foreground">
                  Instant notification display and management
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}