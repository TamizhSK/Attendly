'use client';
import React, { useEffect, useState, useMemo} from 'react';
import { useRouter } from 'next/navigation';
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
} from "@/components/ui/dialog";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectTrigger, 
  SelectValue, 
  SelectContent, 
  SelectItem 
} from "@/components/ui/select";
import { 
  NavigationMenu, 
  NavigationMenuContent, 
  NavigationMenuItem, 
  NavigationMenuLink, 
  NavigationMenuList, 
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import { Calendar } from "@/components/ui/calendar";
import { UserPlus, RefreshCw, CheckCircle2, XCircle, Clock, Edit, Trash2, Home, LogOut, StickyNote } from 'lucide-react';
import axios from 'axios';
import { toast } from "@/hooks/use-toast"; 
import { SidebarProvider, Sidebar } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import AttendlyLogo from '../AttendlyLogo';

interface UserNote {
  id?: string;
  content: string;
  createdAt?: string;
}

interface AttendanceRecord {
  id: string;
  name: string;
  date: string;
  status: 'Present' | 'Absent';
}

interface AttendanceStats {
  total: number;
  present: number;
  absent: number;
}

const DashboardPage = () => {
  const jwt = require('jsonwebtoken');
  const [isClient, setIsClient] = useState(false);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState<AttendanceRecord | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [notes, setNotes] = useState<UserNote[]>([]);
  const [newNote, setNewNote] = useState<string>('');
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

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api/attendance';
  const NOTES_API_BASE_URL = process.env.NEXT_PUBLIC_NOTES_API_BASE_URL || 'http://localhost:3001/api/notes';

  useEffect(() => {
    setIsClient(true);
    fetchAttendance();
    fetchNotes();
  }, []);



  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedEmail = localStorage.getItem('email');
    const storedRole = localStorage.getItem('role');
    const token = localStorage.getItem('token');
  
    // First, try to fetch from localStorage
    if (storedUsername) {
      setUsername(storedUsername);
    }
    if (storedEmail) {
      setEmail(storedEmail);
    }
    if (storedRole) {
      setRole(storedRole);
    }
  
    // If token exists, update localStorage
    if (token) {
      try {
        const decodedToken = jwt.decode(token) as { 
          username: string, 
          email: string,  // Ensure email is part of the token payload
          role: string
        };
        
        if (decodedToken) {
          // Store these in localStorage for persistence
          localStorage.setItem('username', decodedToken.username);
          localStorage.setItem('email', decodedToken.email);  // Add this line
          localStorage.setItem('role', decodedToken.role);
          
          setUsername(decodedToken.username);
          setEmail(decodedToken.email);  // Add this line
          setRole(decodedToken.role);
        }
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);

  const generateRandomPastelColor = useMemo(() => {
    // Create a hash function to generate a consistent color
    const hashCode = (str: string) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
      }
      return Math.abs(hash);
    };

    // Generate a pastel color based on the username
    return (username: string) => {
      if (!username) return 'hsl(200, 70%, 80%)'; // Default color if no username
      
      const hash = hashCode(username);
      const hue = hash % 360; // Use the hash to generate a consistent hue
      return `hsl(${hue}, 70%, 80%)`;
    };
  }, []);
  
  const getFirstLetter = (username: string) => {
    if (!username) return '';
    
    const trimmedName = username.trim();
    return trimmedName.charAt(0).toUpperCase();
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
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message || "Failed to fetch notes"
        : "An unexpected error occurred";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  // Add a new note
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
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Add the new note to the existing notes
      setNotes(prevNotes => [response.data, ...prevNotes]);
      
      // Clear the new note input
      setNewNote('');

      toast({
        title: "Note Added",
        description: "Database is listening to You!",
      });
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message || "Failed to add note."
        : "An unexpected error occurred.";

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  // Delete a note
  const handleDeleteNote = async (noteId: string) => {
    try {
      // Ensure the token is available in localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        toast({
          title: "Error",
          description: "Authorization token is missing.",
          variant: "destructive",
        });
        return;  // Early exit if no token is found
      }
  
      // Make the delete request
      const response = await axios.delete(`${NOTES_API_BASE_URL}/${noteId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.status === 200) {
        // Remove the note from the state to reflect changes in the UI
        setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId));
  
        // Success toast
        toast({
          title: "Note Deleted",
          description: "Like it was wiped from your mind.",
        });
      } else {
        // Handle unexpected server responses
        throw new Error("Failed to delete the note.");
      }
    } catch (error) {
      let errorMessage = "An unexpected error occurred.";
  
      // Check if the error is from axios and extract the message
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || "Failed to delete note.";
      } else if (error instanceof Error) {
        errorMessage = error.message; // For non-Axios errors
      }
  
      // Show the error in a toast notification
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    // Remove the token from localStorage
    localStorage.removeItem('token');
    // Redirect to the login page
    router.push('/login');
  };
  // Improved error handling and user feedback
  const fetchAttendance = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // Use toast for better user experience
        toast({
          title: "Authentication Required",
          description: "Please log in to access attendance records.",
          variant: "destructive"
        });
        window.location.href = '/login';
        return;
      }

      const res = await axios.get(API_BASE_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const attendanceData = res.data;
      setAttendance(attendanceData);
      calculateStats(attendanceData);
      
      // Add success toast
      toast({
        title: "Data Refreshed",
        description: "Attendance records updated successfully.",
      });
    } catch (error) {
      // Improved error handling
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

  // Calculate statistics with more robust error handling
  const calculateStats = (data: AttendanceRecord[]) => {
    if (!Array.isArray(data)) {
      console.error('Invalid data for stats calculation');
      return;
    }
    const presentCount = data.filter(record => record.status === 'Present').length;
    setStats({
      total: data.length,
      present: presentCount,
      absent: data.length - presentCount
    });
  };

  // Handle form input changes with validation
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // For add/edit forms, update the date if a calendar date is selected
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'date' && { date: value || selectedDate?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0] })
    }));
  };

  // Add new attendance record with improved validation
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
        `${API_BASE_URL}/`, // Adjust API_BASE_URL to match your backend
        {
          name: formData.name.trim(),
          date: selectedDate.toISOString(),
          status: formData.status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      toast({
        title: "New Record Added",
        description: "Looks like somebody has joined our database.",
      });
  

      setIsAddDialogOpen(false);
      fetchAttendance(); // Reload the list of attendance records
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
  
  
// Edit handler
const handleEdit = (record: AttendanceRecord) => {
  // Populate form data with the selected record
  setFormData({
    name: record.name,
    date: new Date(record.date).toISOString().split('T')[0],
    status: record.status
  });
  
  // Set the selected date for the calendar
  setSelectedDate(new Date(record.date));
  
  // Set the selected attendance record
  setSelectedAttendance(record);
  
  // Open the edit dialog
  setIsEditDialogOpen(true);
};

// Update handler (already in your existing code)
const handleUpdate = async () => {
  if (!selectedAttendance) {
    toast({
      title: "Error",
      description: "No record selected for update.",
      variant: "destructive",
    });
    return;
  }

  try {
    const token = localStorage.getItem("token");

    await axios.put(
      `${API_BASE_URL}/${selectedAttendance.id}`,
      {
        ...formData,
        name: formData.name.trim() || selectedAttendance.name,
        date: selectedDate ? selectedDate.toISOString() : selectedAttendance.date,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast({
      title: "Record Updated",
      description: "That's a 'Tom Cruise' move! ",
    });

    setIsEditDialogOpen(false);
    setSelectedAttendance(null);
    fetchAttendance(); // Refresh attendance list
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

// Delete handler
const handleDelete = (record: AttendanceRecord) => {
  // Set the record to be deleted
  setSelectedAttendance(record);
  
  // Open the delete confirmation dialog
  setIsDeleteDialogOpen(true);
};

// Confirm delete handler
const confirmDelete = async () => {
  if (!selectedAttendance?.id) {
    toast({
      title: "Error",
      description: "No record selected for deletion.",
      variant: "destructive",
    });
    return;
  }

  try {
    const token = localStorage.getItem("token");

    await axios.delete(`${API_BASE_URL}/${selectedAttendance.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    toast({
      title: "Record Deleted",
      description: "Someone has been kicked out from the database.",
    });

    // Close the delete dialog
    setIsDeleteDialogOpen(false);
    
    // Clear the selected attendance
    setSelectedAttendance(null);
    
    // Refresh attendance list
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

  // Prevent hydration errors by checking if we're on the client
  if (!isClient) {
    return null;
  }
  
  return (
    <div className="min-h-screen flex w-auto bg-gradient-to-br from-indigo-50 to-indigo-100 ">
    {/* Main Content */}
    <nav className="fixed top-0 left-0 right-0 z-20 bg-white-500">
    <div className="w-full flex items-center justify-between px-6 py-3">

            {/* Logo on the left */}
            <div className="ml-4">
              <AttendlyLogo size="lg" />
            </div>

            {/* Navigation buttons on the right */}
            <div className="flex items-center justify-between space-x-6">
              <Button  
                onClick={() => router.push('/')}
                className="flex items-center space-x-2 bg-cyan-500 hover:shadow-lg transition-all ease-in-out hover:bg-cyan-500 popover "
              >
                <Home className="w-5 h-5 stroke-white"/>
                <span>Home</span>
              </Button>
              <Button 
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-sky-600 hover:shadow-lg transition-all ease-in-out hover:bg-sky-600"
              >
                <LogOut className="w-6 h-6" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </nav>

          
        {/* Sidebar */}
        <SidebarProvider>
        <Sidebar className="w-64 bg-white border-r shadow-2xl rounded-r-2xl">
          <div className="p-8 flex flex-col items-center">
            <Avatar className="w-16 h-16 ring-2 mt-14 ring-slate-400 hover:ring-slate-600 transition-all ease-in-out">
              <AvatarImage alt="Profile" className="object-cover" />
              <AvatarFallback 
                className="font-bold text-2xl"
                style={{ 
                  backgroundColor:generateRandomPastelColor(username),
                  color: '#000', // Dark text for better readability
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {getFirstLetter(username)}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-2xl mt-5 font-bold text-gray-900 tracking-tight ">
              {username}
            </h2>
            <span className="text-sm text-gray-500 tracking-tight">
              {email}
            </span>
            <span className="text-sm mt-3 text-gray-800 bg-gray-200 px-2 py-1 rounded-full">
              {role}
            </span>
            <Separator className="my-6 w-full bg-gray-200" />
            
            {/* Notes Section */}
            <div className="w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <StickyNote className="mr-2 text-indigo-600" /> Notes
                </h3>
              </div>
              
              {/* New Note Input */}
              <div className="mb-4">
                <Textarea
                  placeholder="Write a new note..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="w-full mb-2 resize-none"
                  rows={3}
                />
                <Button 
                  onClick={handleAddNote}
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                >
                  Add Note
                </Button>
              </div>

              {/* Notes List */}
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {notes.length === 0 ? (
                  <p className="text-center text-gray-500 text-sm">No notes yet</p>
                ) : (
                  notes.map((note) => (
                    <div 
                      key={note.id} 
                      className="bg-gray-100 p-3 rounded-lg relative group flex flex-col"
                    >
                      <p className="text-sm text-gray-800 pr-8 flex-grow break-words whitespace-pre-wrap">
                        {note.content}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-500">
                          {note.createdAt ? format(new Date(note.createdAt), 'dd MMM yyyy HH:mm') : ''}
                        </span>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => note.id && handleDeleteNote(note.id)}
                          className="opacity-100 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </Sidebar>
      </SidebarProvider>


  <div className="max-w-6xl px-8 py-10 flex-1 items-center justify-center mx-auto">
    <h1 className="text-blue-800  text-3xl flex justify-center mb-1 mt-10 font-black">Attendance Dashboard</h1><h2 className="text-slate-600  flex text-base justify-center mb-5 font-medium">Manage attendance records with ease</h2>
    {/* Statistics Cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      <Card className="bg-white shadow-lg hover:shadow-xl transition-all rounded-xl">
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <h3 className="text-l font-semibold text-indigo-600 uppercase tracking-wider mb-2">
              Total Records
            </h3>
            <p className="text-4xl font-black text-gray-900 tracking-tighter">
              {stats.total}
            </p>
          </div>
          <UserPlus className="w-16 h-16 text-indigo-400 opacity-70" />
        </CardContent>
      </Card>
      <Card className="bg-white shadow-lg hover:shadow-xl transition-all rounded-xl">
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <h3 className="text-l font-semibold text-green-600 uppercase tracking-wider mb-2">
              Present
            </h3>
            <p className="text-4xl font-black text-gray-900 tracking-tighter">
              {stats.present}
            </p>
          </div>
          <CheckCircle2 className="w-16 h-16 text-green-400 opacity-70" />
        </CardContent>
      </Card>
      <Card className="bg-white shadow-lg hover:shadow-xl transition-all rounded-xl">
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <h3 className="text-l font-semibold text-red-600 uppercase tracking-wider mb-2">
              Absent
            </h3>
            <p className="text-4xl font-black text-gray-900 tracking-tighter">
              {stats.absent}
            </p>
          </div>
          <XCircle className="w-16 h-16 text-red-400 opacity-70" />
        </CardContent>
      </Card>
    </div>

    {/* Attendance Records Section */}
    <div className="bg-white shadow-2xl rounded-2xl overflow-hidden border-0">
      <div className="flex justify-between items-center p-6 bg-gray-50 border-b">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-4 tracking-tight">
          <Clock className="w-7 h-7 text-indigo-600" />
          Attendance Records
        </h2>
        <div className="flex space-x-4">
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-full px-6 shadow-md hover:shadow-lg transition-all"
            aria-label="Add Record"
          >
            <UserPlus className="scale-125 mr-2" /> Add Record
          </Button>
          <Button
            variant="outline"
            onClick={fetchAttendance}
            disabled={false}
            className="border-indigo-500 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-600  rounded-full px-6 shadow-sm hover:shadow transition-all"
            aria-label="Refresh Records"
          >
            <RefreshCw className="scale-125 mr-2" /> Refresh
          </Button>
        </div>
      </div>
      <div className="p-6 max-h-[450px] overflow-y-auto">
        {attendance.length === 0 ? (
          <div className="text-center text-gray-500 py-10 bg-gray-50 rounded-xl">
            No attendance records found.
          </div>
        ) : (
          <div className="relative w-full max-h-[400px] overflow-y-auto border border-gray-200 rounded-lg">
          <Table className="w-full">
            <TableHeader className="sticky bg-gray-100 top-0 z-10 scroll-smooth overflow-y-hidden">
              <TableRow>
                <TableCell className="font-bold text-gray-700">Name</TableCell>
                <TableCell className="font-bold text-gray-700 ">Date</TableCell>
                <TableCell className="font-bold text-gray-700 ">Status</TableCell>
                <TableCell className="text-right font-bold text-gray-700 ">Actions</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendance.map((record) => (
                <TableRow key={record.id} className="hover:bg-gray-50 transition-colors">
                  <TableCell>{record.name}</TableCell>
                  <TableCell>{new Date(record.date).toLocaleDateString('en-IN')}</TableCell>
                  <TableCell>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        record.status === "Present"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {record.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(record)}
                      className="mr-2 hover:bg-indigo-50 hover:text-indigo-600 rounded-full"
                      aria-label="Edit Record"
                    >
                      <Edit className="mr-1" size={16} /> Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(record)}
                      className="hover:bg-red-50 hover:text-red-600 rounded-full"
                      aria-label="Delete Record"
                    >
                      <Trash2 className="mr-1" size={16} /> Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>
        )}
      </div>
    </div>

        {/* Unified Attendance Record Dialog */}
        {/* Add Record Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Attendance</DialogTitle>
              </DialogHeader>
              <div>
                <div className="mb-4">
                  <Input
                    placeholder="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                </div>
                <div className="mb-4 justify-items-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => setSelectedDate(date)} // Use a function to update state
                  toDate={new Date()} // Prevent future dates
                  className="rounded-lg border"
                />

                  {/* Display the selected date */}
                  <p className="mt-2 text-sm text-gray-600">
                    Selected Date: {selectedDate ? format(selectedDate, "dd-MM-yyyy") : "None"}
                  </p>
                </div>
                <div className="mb-4">
                  <Select
                    name="status"
                    value={formData.status}
                    onValueChange={(value: 'Present' | 'Absent') =>
                      setFormData((prev) => ({ ...prev, status: value }))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Present">Present</SelectItem>
                      <SelectItem value="Absent">Absent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAdd} className="w-full">
                  Add
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

        {/* Edit Record Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            < DialogHeader>
              <DialogTitle>Edit Attendance</DialogTitle>
            </DialogHeader>
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <div className="p-2 border border-gray-300 rounded-md bg-gray-100">
                  {(formData.name)}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <div className="p-2 border border-gray-300 rounded-md bg-gray-100">
                {new Date(formData.date).toLocaleDateString('en-IN', { 
                                  day: '2-digit', 
                                  month: '2-digit', 
                                  year: 'numeric' 
                                })}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <Select
                  name="status"
                  value={formData.status}
                  onValueChange={(value: 'Present' | 'Absent') => setFormData((prev) => ({ ...prev, status: value }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Present" className='bg-green-500 mb-2 rounded-full bg-opacity-60 '>Present</SelectItem>
                    <SelectItem value="Absent" className='bg-red-500 rounded-full bg-opacity-60 '>Absent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleUpdate} className="w-full">
                Update
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* {delete handler} */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the attendance record. Are you ready to bid farewell to{' '} 
                <span className="font-normal text-red-600">{selectedAttendance?.name}</span>. 
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Oops, Cancel!</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className='bg-red-600'>
                Yes, Delete It!
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
            
      </div>
    </div>
  );
};


export default DashboardPage;