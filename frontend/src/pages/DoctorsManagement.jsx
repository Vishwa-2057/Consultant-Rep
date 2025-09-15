import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  UserCheck, 
  Plus, 
  Search, 
  Mail, 
  Phone, 
  Stethoscope,
  Edit,
  Trash2,
  Eye,
  EyeOff
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { doctorAPI } from "@/services/api";

const DoctorsManagement = () => {
  const [doctors, setDoctors] = useState([]);
  const [doctorsLoading, setDoctorsLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [doctorForm, setDoctorForm] = useState({
    fullName: "",
    email: "",
    password: "",
    specialty: "",
    phone: "",
    role: "doctor"
  });
  
  const [formErrors, setFormErrors] = useState({});
  
  const { toast } = useToast();

  // Load doctors from API
  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    setDoctorsLoading(true);
    try {
      const response = await doctorAPI.getAll();
      // Backend returns { success: true, data: [...] }
      setDoctors(response.data || []);
    } catch (error) {
      console.error('Failed to load doctors:', error);
      toast({
        title: "Error",
        description: "Failed to load doctors. Please try again.",
        variant: "destructive"
      });
    } finally {
      setDoctorsLoading(false);
    }
  };

  // Handle form input changes
  const handleFormChange = (field, value) => {
    setDoctorForm(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!doctorForm.fullName.trim()) {
      errors.fullName = "Full name is required";
    }
    
    if (!doctorForm.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(doctorForm.email)) {
      errors.email = "Please enter a valid email";
    }
    
    if (!doctorForm.password.trim()) {
      errors.password = "Password is required";
    } else if (doctorForm.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    
    if (doctorForm.phone && doctorForm.phone.length < 10) {
      errors.phone = "Phone number must be at least 10 digits";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setSubmitting(true);
    try {
      const response = await doctorAPI.create(doctorForm);
      
      toast({
        title: "Success",
        description: response.message || "Doctor added successfully!"
      });
      
      // Reset form and close modal
      setDoctorForm({
        fullName: "",
        email: "",
        password: "",
        specialty: "",
        phone: "",
        role: "doctor"
      });
      setFormErrors({});
      setIsAddModalOpen(false);
      
      // Reload doctors list
      await loadDoctors();
    } catch (error) {
      console.error('Failed to create doctor:', error);
      
      // Handle validation errors from backend
      if (error.message && error.message.includes('already exists')) {
        setFormErrors({ email: "A doctor with this email already exists" });
      }
      
      toast({
        title: "Error",
        description: error.message || "Failed to add doctor. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle doctor deletion
  const handleDeleteDoctor = async (doctorId, doctorName) => {
    if (!confirm(`Are you sure you want to deactivate ${doctorName}?`)) return;
    
    try {
      const response = await doctorAPI.delete(doctorId);
      toast({
        title: "Success",
        description: response.message || "Doctor deactivated successfully"
      });
      await loadDoctors();
    } catch (error) {
      console.error('Failed to delete doctor:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to deactivate doctor. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Filter doctors based on search
  const filteredDoctors = doctors.filter(doctor =>
    doctor.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (doctor.specialty && doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const specialties = [
    "General Practitioner",
    "Cardiologist",
    "Dermatologist",
    "Neurologist",
    "Orthopedic Surgeon",
    "Pediatrician",
    "Psychiatrist",
    "Radiologist",
    "Anesthesiologist",
    "Emergency Medicine",
    "Internal Medicine",
    "Family Medicine"
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Doctors Management</h1>
          <p className="text-muted-foreground">Manage doctor accounts and their information</p>
        </div>
        <Button 
          className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 shadow-lg shadow-teal-500/25" 
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Doctor
        </Button>
      </div>

      {/* Search and Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search doctors by name, email, or specialty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Card className="border-0 shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Doctors</p>
                <p className="text-2xl font-bold text-foreground">{doctors.length}</p>
              </div>
              <UserCheck className="w-8 h-8 text-teal-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Doctors List */}
      <Card className="border-0 shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-teal-600" />
            Doctors List
          </CardTitle>
          <CardDescription>
            {filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {doctorsLoading ? (
            <div className="flex items-center justify-center h-32">
              <p className="text-muted-foreground">Loading doctors...</p>
            </div>
          ) : filteredDoctors.length === 0 ? (
            <div className="flex items-center justify-center h-32">
              <p className="text-muted-foreground">
                {searchQuery ? "No doctors found matching your search." : "No doctors found."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDoctors.map((doctor) => (
                <Card key={doctor._id} className="border border-border hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">{doctor.fullName}</h3>
                          <p className="text-sm text-muted-foreground">{doctor.specialty || 'General Practitioner'}</p>
                        </div>
                        <Badge variant={doctor.role === 'admin' ? 'default' : 'secondary'} className="text-xs">
                          {doctor.role}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="w-4 h-4" />
                          <span className="truncate">{doctor.email}</span>
                        </div>
                        {doctor.phone && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="w-4 h-4" />
                            <span>{doctor.phone}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between pt-2 border-t">
                        <span className="text-xs text-muted-foreground">
                          Added {new Date(doctor.createdAt).toLocaleDateString()}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDeleteDoctor(doctor._id, doctor.fullName)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Doctor Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Doctor</DialogTitle>
            <DialogDescription>
              Create a new doctor account with login credentials
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                value={doctorForm.fullName}
                onChange={(e) => handleFormChange('fullName', e.target.value)}
                placeholder="Enter full name"
              />
              {formErrors.fullName && (
                <p className="text-sm text-red-600">{formErrors.fullName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={doctorForm.email}
                onChange={(e) => handleFormChange('email', e.target.value)}
                placeholder="Enter email address"
              />
              {formErrors.email && (
                <p className="text-sm text-red-600">{formErrors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={doctorForm.password}
                  onChange={(e) => handleFormChange('password', e.target.value)}
                  placeholder="Enter password (min 6 characters)"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {formErrors.password && (
                <p className="text-sm text-red-600">{formErrors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialty">Specialty</Label>
              <Select value={doctorForm.specialty} onValueChange={(value) => handleFormChange('specialty', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select specialty" />
                </SelectTrigger>
                <SelectContent>
                  {specialties.map((specialty) => (
                    <SelectItem key={specialty} value={specialty}>
                      {specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={doctorForm.phone}
                onChange={(e) => handleFormChange('phone', e.target.value)}
                placeholder="Enter phone number"
              />
              {formErrors.phone && (
                <p className="text-sm text-red-600">{formErrors.phone}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={doctorForm.role} onValueChange={(value) => handleFormChange('role', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="doctor">Doctor</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsAddModalOpen(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700"
                disabled={submitting}
              >
                {submitting ? 'Adding...' : 'Add Doctor'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DoctorsManagement;
