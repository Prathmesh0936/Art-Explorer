
'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { UserCircle, Mail, LogOut } from 'lucide-react';

export default function ProfilePage() {
  const { currentUser, logout, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !currentUser) {
      router.push('/login');
    }
  }, [currentUser, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-200px)] items-center justify-center">
        <LoadingSpinner size={48} /> <span className="ml-3 text-lg">Loading profile...</span>
      </div>
    );
  }

  if (!currentUser) {
    // This case should ideally be handled by the useEffect redirect,
    // but it's good practice for robustness.
    return null; 
  }

  const handleLogout = async () => {
    await logout();
    router.push('/'); // Redirect to homepage after logout
  };

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-150px)] items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-xl">
        <CardHeader className="items-center text-center">
          <UserCircle className="h-20 w-20 text-primary mb-3" />
          <CardTitle className="text-3xl font-bold">User Profile</CardTitle>
          <CardDescription>Manage your account details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-3 p-4 bg-secondary/30 rounded-md">
            <Mail className="h-6 w-6 text-primary" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email Address</p>
              <p className="text-lg font-semibold text-foreground">{currentUser.email || 'Not available'}</p>
            </div>
          </div>
          {/* Add more profile details here as needed */}
        </CardContent>
        <CardFooter>
          <Button variant="destructive" className="w-full" onClick={handleLogout} disabled={loading}>
            <LogOut className="mr-2 h-5 w-5" />
            {loading ? 'Logging out...' : 'Logout'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
