'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Calendar } from "@/components/ui/calendar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { UserPlus, RefreshCw, CheckCircle2, XCircle, Edit, Trash2, Home, LogOut, StickyNote, Menu, Calendar as CalendarIcon, Users, Shield } from 'lucide-react';
import { format } from "date-fns";
import axios from 'axios';
import { toast } from "@/hooks/use-toast";
import AttendlyLogo from '../AttendlyLogo';

interface UserNote {
  id?: string;
  content: string;
  createdAt?: string;
}

interface AttendanceRecord {
  id: string;
  studentName: string;
  date: string;
  status: 'Present' | 'Absent';
}

interface AttendanceStats {
  total: number;
  present: number;
  absent: number;
}

const DashboardPage = () => {
  const [isClient, setIsClient] = useState(false);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState<AttendanceRecord | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [notes, setNotes] = useState<UserNote[]>([]);
  const [newNote, setNewNote] = useState<string>('');
  const [users, setUsers] = useState<any[]>([]);
  const [isUserManagementOpen, setIsUserManagementOpen] = useState(false);
  const router = useRouter();
  const [stats, setStats] = useState<AttendanceStats>({
    total: 0,
    present: 0,
    absent: 0
  });

  const [formData, setFormData] = useState({
    name: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Present' as 'Present' | 'Absent'
  });

  const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/attendance`;
  const NOTES_API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/notes`;
  const USERS_API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/auth`;

  // RBAC Helper Functions
  const isAdmin = role === 'admin';
  const isFaculty = role === 'faculty';
  const canDelete = isAdmin; // Only admins can delete
  const canAddUpdate = isAdmin || isFaculty; // Both can add and update
  const canManageUsers = isAdmin; // Only admins can manage users

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const storedUsername = localStorage.getItem('username');
      const storedEmail = localStorage.getItem('email');
      const storedRole = localStorage.getItem('role');
      
      if (storedUsername) setUsername(storedUsername);
      if (storedEmail) setEmail(storedEmail);
      if (storedRole) setRole(storedRole);

      fetchAttendance();
      fetchNotes();
      // User management is now implemented on the backend
      if (canManageUsers) {
        fetchUsers();
      }
    }
  }, [isClient, canManageUsers]);

  const fetchAttendance = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast({
          title: "Authentication Required",
          description: "Please log in to access attendance records.",
          variant: "destructive"
        });
        router.push('/login');
        return;
      }

      const res = await axios.get(API_BASE_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const attendanceData = res.data;
      setAttendance(attendanceData);
      calculateStats(attendanceData);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        localStorage.clear();
        router.push('/login');
        return;
      }
      
      const errorMessage = axios.isAxiosError(error) 
        ? error.response?.data?.message || "Failed to fetch attendance" 
        : "An unexpected error occurred";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await axios.get(NOTES_API_BASE_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setNotes(res.data);
    } catch (error) {
      console.error('Failed to fetch notes:', error);
    }
  };

  const calculateStats = (data: AttendanceRecord[]) => {
    if (!Array.isArray(data)) return;
    const presentCount = data.filter(record => record.status === 'Present').length;
    setStats({
      total: data.length,
      present: presentCount,
      absent: data.length - presentCount
    });
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  const handleAdd = async () => {
    if (!formData.name.trim() || !selectedDate || !formData.status) {
      toast({
        title: "Validation Error",
        description: "All fields are required.",
        variant: "destructive",
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        API_BASE_URL,
        {
          name: formData.name.trim(),
          date: selectedDate.toISOString(),
          status: formData.status,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast({
        title: "Record Added",
        description: "Attendance record has been added successfully.",
      });

      setIsAddDialogOpen(false);
      setFormData({ name: '', date: new Date().toISOString().split('T')[0], status: 'Present' });
      setSelectedDate(new Date());
      fetchAttendance();
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message || "Failed to add record."
        : "An unexpected error occurred.";

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (record: AttendanceRecord) => {
    setFormData({
      name: record.studentName,
      date: new Date(record.date).toISOString().split('T')[0],
      status: record.status
    });
    setSelectedDate(new Date(record.date));
    setSelectedAttendance(record);
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedAttendance) return;

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_BASE_URL}/${selectedAttendance.id}`,
        {
          ...formData,
          name: formData.name.trim() || selectedAttendance.studentName,
          date: selectedDate ? selectedDate.toISOString() : selectedAttendance.date,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast({
        title: "Record Updated",
        description: "Attendance record has been updated successfully.",
      });

      setIsEditDialogOpen(false);
      setSelectedAttendance(null);
      fetchAttendance();
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message || "Failed to update record."
        : "An unexpected error occurred.";

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleDelete = (record: AttendanceRecord) => {
    if (!canDelete) {
      toast({
        title: "Access Denied",
        description: "Only administrators can delete attendance records.",
        variant: "destructive",
      });
      return;
    }
    setSelectedAttendance(record);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedAttendance || !selectedAttendance.id) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/${selectedAttendance.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast({
        title: "Record Deleted",
        description: "Attendance record has been deleted successfully.",
      });

      setIsDeleteDialogOpen(false);
      setSelectedAttendance(null);
      fetchAttendance();
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message || "Failed to delete record."
        : "An unexpected error occurred.";

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) {
      toast({
        title: "Validation Error",
        description: "Note content cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        NOTES_API_BASE_URL,
        { content: newNote.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNotes(prevNotes => [response.data, ...prevNotes]);
      setNewNote('');
      toast({
        title: "Note Added",
        description: "Your note has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add note.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${NOTES_API_BASE_URL}/${noteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId));
      toast({
        title: "Note Deleted",
        description: "Note has been deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete note.",
        variant: "destructive",
      });
    }
  };

  // User Management Functions (Admin Only)
  const fetchUsers = async () => {
    if (!canManageUsers) {
      console.log('User management access denied - not an admin');
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast({
          title: "Authentication Error",
          description: "No authentication token found. Please log in again.",
          variant: "destructive"
        });
        return;
      }

      console.log('Fetching users from:', `${USERS_API_BASE_URL}/users`);
      console.log('User role:', role);
      console.log('Token exists:', !!token);

      const res = await axios.get(`${USERS_API_BASE_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Users fetched successfully:', res.data);
      setUsers(res.data);
      
      toast({
        title: "Users Loaded",
        description: `Found ${res.data.length} users in the system.`,
      });
    } catch (error) {
      console.error('Failed to fetch users:', error);
      console.error('Error details:', {
        status: axios.isAxiosError(error) ? error.response?.status : undefined,
        statusText: axios.isAxiosError(error) ? error.response?.statusText : undefined,
        data: axios.isAxiosError(error) ? error.response?.data : undefined,
        message: error instanceof Error ? error.message : 'Unknown error'
      });

      // Handle different error scenarios
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNREFUSED' || !error.response) {
          toast({
            title: "Connection Error",
            description: "Cannot connect to the backend server. Make sure it's running on port 5000.",
            variant: "destructive"
          });
        } else if (error.response?.status === 401) {
          toast({
            title: "Authentication Failed",
            description: "Your session has expired. Please log in again.",
            variant: "destructive"
          });
          localStorage.clear();
          router.push('/login');
        } else if (error.response?.status === 403) {
          toast({
            title: "Access Denied",
            description: "You don't have permission to view users. Admin access required.",
            variant: "destructive"
          });
        } else if (error.response?.status === 404) {
          setUsers([]);
          toast({
            title: "Endpoint Not Found",
            description: "User management endpoint is not available on the backend.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Error",
            description: error.response?.data?.error || error.response?.data?.message || "Failed to fetch users.",
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "Network Error",
          description: "An unexpected network error occurred while fetching users.",
          variant: "destructive"
        });
      }
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!canManageUsers) {
      toast({
        title: "Access Denied",
        description: "Only administrators can delete users.",
        variant: "destructive",
      });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${USERS_API_BASE_URL}/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      toast({
        title: "User Deleted",
        description: "User has been deleted successfully.",
      });
    } catch (error) {
      console.error('Failed to delete user:', error);
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message || "Failed to delete user."
        : "An unexpected error occurred.";
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 safe-top">
        <div className="max-w-7xl mx-auto px-responsive">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <AttendlyLogo size="sm" className="sm:hidden" />
              <AttendlyLogo size="md" className="hidden sm:flex" />
            </div>

            <div className="flex items-center space-x-1 sm:space-x-2">
              {/* Mobile User Avatar - Quick Access */}
              <div className="sm:hidden">
                <div className="relative">
                  <Avatar className="w-8 h-8 ring-2 ring-blue-100">
                    <AvatarImage alt="Profile" />
                    <AvatarFallback className="bg-blue-500 text-white text-xs font-semibold">
                      {username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {/* Online indicator */}
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                </div>
              </div>
              
              {/* Mobile Menu Sheet */}
              <div className="sm:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="sm" className="touch-target">
                      <Menu className="w-5 h-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-80 overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle className="text-left">Menu</SheetTitle>
                    </SheetHeader>
                    
                    {/* Mobile Profile Section */}
                    <div className="mt-6 mb-6">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex flex-col items-center text-center">
                          <Avatar className="w-16 h-16 mb-3">
                            <AvatarImage alt="Profile" />
                            <AvatarFallback className="bg-blue-500 text-white text-lg font-semibold">
                              {username.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <h3 className="font-semibold text-lg text-gray-900 truncate max-w-full">{username}</h3>
                          <p className="text-sm text-gray-600 mb-2 truncate max-w-full" title={email}>{email}</p>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            isAdmin ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {isAdmin && <Shield className="w-3 h-3 mr-1" />}
                            {role.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Navigation Menu */}
                    <div className="flex flex-col space-y-3">
                      <Button
                        onClick={() => router.push('/')}
                        variant="ghost"
                        className="justify-start touch-target h-12 px-4"
                      >
                        <Home className="w-4 h-4 mr-3" />
                        Home
                      </Button>
                      {canManageUsers && (
                        <Button
                          onClick={() => setIsUserManagementOpen(true)}
                          variant="ghost"
                          className="justify-start touch-target h-12 px-4"
                        >
                          <Users className="w-4 h-4 mr-3" />
                          Manage Users
                        </Button>
                      )}
                      
                      <Separator className="my-2" />
                      
                      {/* Mobile Quick Notes Section */}
                      <div className="px-2 py-3">
                        <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                          <StickyNote className="w-4 h-4 mr-2" />
                          Quick Notes
                        </h4>
                        <div className="space-y-3">
                          <Textarea
                            placeholder="Add a new note..."
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                            className="text-sm resize-none focus-ring"
                            rows={2}
                          />
                          <Button onClick={handleAddNote} className="w-full touch-target" size="sm">
                            Add Note
                          </Button>
                        </div>
                        
                        <div className="mt-3 space-y-2 max-h-32 overflow-y-auto custom-scrollbar">
                          {notes.length === 0 ? (
                            <p className="text-xs text-gray-500 text-center py-2">No notes yet</p>
                          ) : (
                            notes.slice(0, 3).map((note) => (
                              <div key={note.id} className="bg-white p-2 rounded-md group text-left">
                                <p className="text-xs text-gray-800 mb-1 break-words line-clamp-2">{note.content}</p>
                                <div className="flex justify-between items-center">
                                  <span className="text-xs text-gray-500">
                                    {note.createdAt ? format(new Date(note.createdAt), 'MMM dd') : ''}
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => note.id && handleDeleteNote(note.id)}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 text-red-500 hover:text-red-700"
                                    title="Delete note"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                            ))
                          )}
                          {notes.length > 3 && (
                            <p className="text-xs text-gray-500 text-center py-1">
                              +{notes.length - 3} more notes
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <Separator className="my-2" />
                      
                      <Button
                        onClick={handleLogout}
                        variant="ghost"
                        className="justify-start text-red-600 hover:text-red-700 hover:bg-red-50 touch-target h-12 px-4"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Logout
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
              
              {/* Desktop Menu */}
              <div className="hidden sm:flex sm:items-center sm:space-x-2">
                <Button
                  onClick={() => router.push('/')}
                  variant="ghost"
                  size="sm"
                  className="touch-target"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Button>
                {canManageUsers && (
                  <Button
                    onClick={() => setIsUserManagementOpen(true)}
                    variant="ghost"
                    size="sm"
                    className="touch-target"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Manage Users
                  </Button>
                )}
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 touch-target"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-responsive py-4 sm:py-6 lg:py-8 safe-bottom">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {/* Sidebar - Hidden on mobile, visible on desktop */}
          <div className="hidden lg:block lg:col-span-1 order-2 lg:order-1">
            <div className="space-y-4 sm:space-y-6">
              {/* Profile Card */}
              <Card>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col items-center text-center">
                    <Avatar className="w-12 h-12 sm:w-16 sm:h-16 mb-3 sm:mb-4">
                      <AvatarImage alt="Profile" />
                      <AvatarFallback className="bg-blue-500 text-white text-sm sm:text-lg font-semibold">
                        {username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="font-semibold text-base sm:text-lg text-gray-900 truncate max-w-full">{username}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 mb-2 truncate max-w-full" title={email}>{email}</p>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      isAdmin ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {isAdmin && <Shield className="w-3 h-3 mr-1" />}
                      {role.toUpperCase()}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Notes Card */}
              <Card>
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="flex items-center text-base sm:text-lg">
                    <StickyNote className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Quick Notes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  <div>
                    <Textarea
                      placeholder="Add a new note..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      className="mb-2 text-sm resize-none focus-ring"
                      rows={3}
                    />
                    <Button onClick={handleAddNote} className="w-full touch-target" size="sm">
                      Add Note
                    </Button>
                  </div>
                  
                  <div className="space-y-2 max-h-48 sm:max-h-64 overflow-y-auto custom-scrollbar">
                    {notes.length === 0 ? (
                      <p className="text-xs sm:text-sm text-gray-500 text-center py-4">No notes yet</p>
                    ) : (
                      notes.map((note) => (
                        <div key={note.id} className="bg-gray-50 p-2 sm:p-3 rounded-md group hover:bg-gray-100 transition-colors">
                          <p className="text-xs sm:text-sm text-gray-800 mb-2 break-words">{note.content}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500 flex-shrink-0">
                              {note.createdAt ? format(new Date(note.createdAt), 'MMM dd, HH:mm') : ''}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => note.id && handleDeleteNote(note.id)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 touch-target"
                              title="Delete note"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content - Full width on mobile, 3/4 on desktop */}
          <div className="col-span-1 lg:col-span-3 order-1 lg:order-2">
            <div className="space-y-4 sm:space-y-6">
              {/* Welcome Section */}
              <div className="text-center sm:text-left">
                <h2 className="text-responsive-xl font-bold text-gray-900 mb-2">
                  <span className="hidden sm:inline">Welcome back, {username}!</span>
                  <span className="sm:hidden">Welcome back!</span>
                </h2>
                <p className="text-responsive-sm text-gray-600">Here's your attendance overview for today.</p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                <Card>
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                        <UserPlus className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                      </div>
                      <div className="ml-3 sm:ml-4 min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Total Records</p>
                        <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.total}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
                        <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                      </div>
                      <div className="ml-3 sm:ml-4 min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Present</p>
                        <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.present}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-red-100 rounded-lg flex-shrink-0">
                        <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                      </div>
                      <div className="ml-3 sm:ml-4 min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Absent</p>
                        <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.absent}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Attendance Records */}
              <Card className="flex flex-col card-responsive-height">
                <CardHeader className="pb-4 sm:pb-6 flex-shrink-0">
                  <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <CardTitle className="text-responsive-lg">Attendance Records</CardTitle>
                      <CardDescription className="text-responsive-sm">Manage student attendance records</CardDescription>
                    </div>
                    <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:space-x-2">
                      {canAddUpdate && (
                        <Button onClick={() => setIsAddDialogOpen(true)} className="touch-target">
                          <UserPlus className="w-4 h-4 mr-2" />
                          <span className="hidden xs:inline">Add Record</span>
                          <span className="xs:hidden">Add</span>
                        </Button>
                      )}
                      <Button variant="outline" onClick={fetchAttendance} className="touch-target">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        <span className="hidden xs:inline">Refresh</span>
                        <span className="xs:hidden">Sync</span>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-hidden p-0">
                  {attendance.length === 0 ? (
                    <div className="text-center py-8 sm:py-12 px-4 sm:px-6">
                      <UserPlus className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No records found</h3>
                      <p className="text-sm sm:text-base text-gray-600 mb-4">
                        {canAddUpdate ? "Start by adding your first attendance record" : "No attendance records available"}
                      </p>
                      {canAddUpdate && (
                        <Button onClick={() => setIsAddDialogOpen(true)} className="touch-target">
                          <UserPlus className="w-4 h-4 mr-2" />
                          Add First Record
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="h-full flex flex-col">
                      {/* Table Container with Fixed Height and Scroll */}
                      <div className="flex-1 overflow-auto custom-scrollbar">
                        <div className="min-w-full">
                        <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-xs sm:text-sm font-medium px-2 sm:px-4">Student Name</TableHead>
                            <TableHead className="text-xs sm:text-sm font-medium px-2 sm:px-4">Date</TableHead>
                            <TableHead className="text-xs sm:text-sm font-medium px-2 sm:px-4">Status</TableHead>
                            <TableHead className="text-xs sm:text-sm font-medium text-right px-2 sm:px-4">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {attendance.map((record) => (
                            <TableRow key={record.id} className="hover:bg-gray-50">
                              <TableCell className="font-medium text-sm sm:text-base px-2 sm:px-4 py-3">
                                <div className="text-truncate max-w-[120px] sm:max-w-none" title={record.studentName}>
                                  {record.studentName}
                                </div>
                              </TableCell>
                              <TableCell className="text-sm sm:text-base px-2 sm:px-4 py-3">
                                <div className="text-xs sm:text-sm text-gray-600">
                                  {new Date(record.date).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: '2-digit'
                                  })}
                                </div>
                              </TableCell>
                              <TableCell className="px-2 sm:px-4 py-3">
                                <span
                                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                    record.status === "Present"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {record.status === "Present" ? (
                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                  ) : (
                                    <XCircle className="w-3 h-3 mr-1" />
                                  )}
                                  <span className="hidden xs:inline">{record.status}</span>
                                  <span className="xs:hidden">{record.status === "Present" ? "P" : "A"}</span>
                                </span>
                              </TableCell>
                              <TableCell className="text-right px-2 sm:px-4 py-3">
                                <div className="flex justify-end space-x-1">
                                  {canAddUpdate && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleEdit(record)}
                                      className="touch-target h-8 w-8 p-0 hover:bg-blue-50"
                                      title="Edit record"
                                    >
                                      <Edit className="w-4 h-4" />
                                    </Button>
                                  )}
                                  {canDelete && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleDelete(record)}
                                      className="text-red-600 hover:text-red-700 hover:bg-red-50 touch-target h-8 w-8 p-0"
                                      title="Delete record"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                        </Table>
                        </div>
                      </div>
                      
                      {/* Table Footer with Stats */}
                      {attendance.length > 0 && (
                        <div className="border-t bg-gray-50 px-4 sm:px-6 py-3 flex justify-between items-center text-sm text-gray-600 flex-shrink-0">
                          <span>Total: {attendance.length} records</span>
                          <span className="hidden sm:inline">
                            {stats.present} present, {stats.absent} absent
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Add Record Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="w-[95vw] max-w-md sm:max-w-lg mx-auto">
          <DialogHeader>
            <DialogTitle className="text-responsive-lg">Add New Attendance Record</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 sm:space-y-6">
            <div>
              <Label htmlFor="name" className="text-responsive-sm">Student Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter student name"
                className="h-10 sm:h-11 touch-target focus-ring text-responsive-sm"
              />
            </div>
            <div>
              <Label className="text-responsive-sm">Date</Label>
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  toDate={new Date()}
                  className="rounded-md border text-sm"
                />
              </div>
            </div>
            <div>
              <Label className="text-responsive-sm">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: 'Present' | 'Absent') =>
                  setFormData(prev => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger className="h-10 sm:h-11 touch-target focus-ring text-responsive-sm">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Present">Present</SelectItem>
                  <SelectItem value="Absent">Absent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="w-full sm:w-auto touch-target">
              Cancel
            </Button>
            <Button onClick={handleAdd} className="w-full sm:w-auto touch-target">
              Add Record
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Record Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="w-[95vw] max-w-md sm:max-w-lg mx-auto">
          <DialogHeader>
            <DialogTitle className="text-responsive-lg">Edit Attendance Record</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 sm:space-y-6">
            <div>
              <Label className="text-responsive-sm">Student Name</Label>
              <Input value={formData.name} disabled className="bg-gray-100 h-10 sm:h-11 text-responsive-sm" />
            </div>
            <div>
              <Label className="text-responsive-sm">Date</Label>
              <Input
                value={new Date(formData.date).toLocaleDateString()}
                disabled
                className="bg-gray-100 h-10 sm:h-11 text-responsive-sm"
              />
            </div>
            <div>
              <Label className="text-responsive-sm">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: 'Present' | 'Absent') =>
                  setFormData(prev => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger className="h-10 sm:h-11 touch-target focus-ring text-responsive-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Present">Present</SelectItem>
                  <SelectItem value="Absent">Absent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="w-full sm:w-auto touch-target">
              Cancel
            </Button>
            <Button onClick={handleUpdate} className="w-full sm:w-auto touch-target">
              Update Record
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the attendance record for{' '}
              <span className="font-semibold">{selectedAttendance?.studentName}</span>.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* User Management Dialog (Admin Only) */}
      {canManageUsers && (
        <Dialog open={isUserManagementOpen} onOpenChange={setIsUserManagementOpen}>
          <DialogContent className="w-[95vw] max-w-5xl mx-auto max-h-[90vh] flex flex-col">
            <DialogHeader className="flex-shrink-0">
              <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
                <DialogTitle className="flex items-center text-responsive-lg">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  User Management
                </DialogTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchUsers}
                  className="flex items-center touch-target"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Load Users
                </Button>
              </div>
            </DialogHeader>
            <div className="flex-1 overflow-hidden">
              {users.length > 0 ? (
                <div className="h-full flex flex-col">
                  <div className="flex-1 overflow-auto custom-scrollbar">
                    <div className="min-w-full">
                      <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs sm:text-sm font-medium px-2 sm:px-4 py-3">Name</TableHead>
                        <TableHead className="text-xs sm:text-sm font-medium px-2 sm:px-4 py-3 hidden sm:table-cell">Email</TableHead>
                        <TableHead className="text-xs sm:text-sm font-medium px-2 sm:px-4 py-3">Role</TableHead>
                        <TableHead className="text-xs sm:text-sm font-medium px-2 sm:px-4 py-3 hidden md:table-cell">Created</TableHead>
                        <TableHead className="text-xs sm:text-sm font-medium text-right px-2 sm:px-4 py-3">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id} className="hover:bg-gray-50">
                          <TableCell className="font-medium text-sm sm:text-base px-2 sm:px-4 py-3">
                            <div className="flex flex-col">
                              <div className="text-truncate max-w-[120px] sm:max-w-none" title={user.name}>
                                {user.name}
                              </div>
                              <div className="sm:hidden text-xs text-gray-500 mt-1 truncate" title={user.email}>
                                {user.email}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell text-sm px-2 sm:px-4 py-3">
                            <div className="text-truncate max-w-[180px]" title={user.email}>
                              {user.email}
                            </div>
                          </TableCell>
                          <TableCell className="px-2 sm:px-4 py-3">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {user.role === 'admin' && <Shield className="w-3 h-3 mr-1" />}
                              <span className="hidden xs:inline">{user.role.toUpperCase()}</span>
                              <span className="xs:hidden">{user.role === 'admin' ? 'ADM' : 'FAC'}</span>
                            </span>
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-sm text-gray-600 px-2 sm:px-4 py-3">
                            <div className="text-xs sm:text-sm">
                              {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: '2-digit'
                              }) : 'N/A'}
                            </div>
                          </TableCell>
                          <TableCell className="text-right px-2 sm:px-4 py-3">
                            {user.role === 'faculty' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteUser(user.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 touch-target h-8 w-8 p-0"
                                title="Delete user"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                      </TableBody>
                      </Table>
                    </div>
                  </div>
                  
                  {/* Users table footer */}
                  <div className="border-t bg-gray-50 px-4 py-3 flex justify-between items-center text-sm text-gray-600 flex-shrink-0">
                    <span>Total: {users.length} users</span>
                    <span className="hidden sm:inline">
                      {users.filter(u => u.role === 'admin').length} admins, {users.filter(u => u.role === 'faculty').length} faculty
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 sm:py-8">
                  <Users className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No Users Found</h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-4 px-4">
                    Click "Load Users" to fetch user data from the backend.
                  </p>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 text-left mx-4">
                    <h4 className="font-medium text-green-800 mb-2 text-sm sm:text-base">✅ Backend Endpoints Available:</h4>
                    <ul className="text-xs sm:text-sm text-green-700 space-y-1">
                      <li>• GET /api/auth/users - List all users</li>
                      <li>• DELETE /api/auth/users/:id - Delete faculty users</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
            <DialogFooter className="flex-shrink-0 border-t pt-4">
              <Button variant="outline" onClick={() => setIsUserManagementOpen(false)} className="w-full sm:w-auto touch-target">
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default DashboardPage;