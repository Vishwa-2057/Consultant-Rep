import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Filter, 
  Plus, 
  Phone, 
  Mail, 
  Calendar,
  MapPin,
  User,
  FileText,
  Download,
  ChevronDown,
  ChevronUp,
  Clock,
  Heart,
  Activity
} from "lucide-react";
import PatientModal from "@/components/PatientModal";
import ReferralButton from "@/components/ReferralButton";
import { useToast } from "@/hooks/use-toast";
import { patientAPI } from "@/services/api";
import { isClinic, isDoctor } from "@/utils/roleUtils";

const PatientManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [patients, setPatients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedPatients, setExpandedPatients] = useState(new Set());

  const { toast } = useToast();

  // Load patients from API (server-side filters + pagination)
  useEffect(() => {
    const loadPatients = async () => {
      setLoading(true);
      setError("");
      try {
        const filters = {};
        if (searchTerm.trim()) filters.search = searchTerm.trim();
        if (statusFilter !== "all") {
          const statusMap = { 'active': 'Active', 'follow-up': 'Follow-up', 'completed': 'Completed' };
          filters.status = statusMap[statusFilter] || statusFilter;
        }
        const response = await patientAPI.getAll(currentPage, pageSize, filters);
        const list = response.patients || response.data || [];
        const pagination = response.pagination || {};

        const transformedPatients = list.map(patient => {
          // Calculate age from dateOfBirth if age is 0 or not available
          let calculatedAge = patient.age;
          if (!calculatedAge || calculatedAge === 0) {
            if (patient.dateOfBirth) {
              const today = new Date();
              const birthDate = new Date(patient.dateOfBirth);
              calculatedAge = today.getFullYear() - birthDate.getFullYear();
              const monthDiff = today.getMonth() - birthDate.getMonth();
              if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                calculatedAge--;
              }
            }
          }

          return {
            id: patient._id || patient.id,
            fullName: patient.fullName,
            name: patient.fullName,
            age: calculatedAge,
            dateOfBirth: patient.dateOfBirth,
            gender: patient.gender,
            phone: patient.phone,
            email: patient.email,
            address: patient.address,
            emergencyContact: patient.emergencyContact,
            insurance: patient.insurance,
            medicalHistory: patient.medicalHistory,
            notes: patient.notes,
            condition: patient.medicalHistory?.conditions?.length > 0 
              ? patient.medicalHistory.conditions[0] 
              : "General Checkup",
            status: patient.status || "Active",
            lastVisit: patient.lastVisit,
            nextAppointment: patient.nextAppointment,
            createdAt: patient.createdAt,
            updatedAt: patient.updatedAt,
            assignedDoctors: patient.assignedDoctors || []
          };
        });

        setPatients(transformedPatients);
        setTotalPages(pagination.totalPages || 1);
        setTotalCount(pagination.totalPatients || transformedPatients.length);
      } catch (err) {
        console.error('Failed to load patients:', err);
        setError(err.message || 'Failed to load patients');
        setPatients([]);
        setTotalPages(1);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    };

    loadPatients();
  }, [currentPage, pageSize, searchTerm, statusFilter]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Active": return "success";
      case "Follow-up": return "warning";
      case "Completed": return "secondary";
      default: return "muted";
    }
  };

  const filteredPatients = patients; // server-side filtering applied

  // Modal handlers
  const handleNewPatient = () => {
    console.log("Add New Patient button clicked");
    setIsPatientModalOpen(true);
  };
  const handlePatientModalClose = () => setIsPatientModalOpen(false);

  // Form submission handler
  const handlePatientSubmit = (patientData) => {
    toast({
      title: "Patient Added!",
      description: `Successfully added ${patientData.fullName} to the system`,
      variant: "default",
    });
    setCurrentPage(1);
  };

  // Toggle patient expansion
  const togglePatientExpansion = (patientId) => {
    const newExpanded = new Set(expandedPatients);
    if (newExpanded.has(patientId)) {
      newExpanded.delete(patientId);
    } else {
      newExpanded.add(patientId);
    }
    setExpandedPatients(newExpanded);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Patient Management</h1>
          <p className="text-muted-foreground">
            {isDoctor() ? "View your assigned patients" : "Manage patient records, onboarding, and information"}
          </p>
        </div>
        {isClinic() && (
          <Button 
            className="bg-gradient-primary shadow-soft" 
            onClick={handleNewPatient}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Patient
          </Button>
        )}
      </div>

      {/* Search and Filters */}
      <Card className="border-0 shadow-soft">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search patients by name or condition..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="follow-up">Follow-up</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Patient List */}
      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="cards">Card View</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <Card className="border-0 shadow-soft">
            <CardHeader>
              <CardTitle>Patients ({totalCount})</CardTitle>
              <CardDescription>Comprehensive patient information and status tracking</CardDescription>
            </CardHeader>
            <CardContent>
              {loading && <p className="text-sm text-muted-foreground">Loading...</p>}
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="space-y-4">
                {filteredPatients.map((patient) => {
                  const isExpanded = expandedPatients.has(patient.id || patient._id);
                  const patientId = patient.id || patient._id;
                  
                  return (
                    <div key={patientId} className="rounded-lg border border-border hover:bg-muted/30 transition-all duration-200">
                      {/* Main Patient Row */}
                      <div className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                              <User className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground">{patient.fullName || patient.name || 'Unknown Patient'}</h3>
                              <p className="text-sm text-muted-foreground">
                                {patient.age || 0} years • {patient.gender || 'Unknown'}
                              </p>
                              <p className="text-sm text-muted-foreground">{patient.condition || 'General Care'}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            <div className="text-right hidden md:block">
                              <p className="text-sm text-muted-foreground">Status</p>
                              <Badge variant={getStatusColor(patient.status)}>
                                {patient.status || 'Active'}
                              </Badge>
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="icon">
                                <Phone className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Mail className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Calendar className="w-4 h-4" />
                              </Button>
                              {isClinic() && (
                                <Button variant="ghost" size="icon">
                                  <FileText className="w-4 h-4" />
                                </Button>
                              )}
                              <ReferralButton 
                                referralData={{ patientId: patientId, patientName: patient.fullName || patient.name || 'Unknown Patient' }}
                                variant="ghost" 
                                size="sm"
                                showDropdown={false}
                              />
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => togglePatientExpansion(patientId)}
                                className="ml-2"
                              >
                                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {isExpanded && (
                        <div className="px-4 pb-4 border-t border-border/50 bg-muted/20">
                          <div className="pt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Contact Information */}
                            <div className="space-y-3">
                              <h4 className="font-semibold text-sm text-foreground flex items-center">
                                <Phone className="w-4 h-4 mr-2" />
                                Contact Information
                              </h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex items-center space-x-2">
                                  <Phone className="w-3 h-3 text-muted-foreground" />
                                  <span>{patient.phone || 'Not provided'}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Mail className="w-3 h-3 text-muted-foreground" />
                                  <span>{patient.email || 'Not provided'}</span>
                                </div>
                                <div className="flex items-start space-x-2">
                                  <MapPin className="w-3 h-3 text-muted-foreground mt-0.5" />
                                  <span className="text-sm">
                                    {patient.address && (patient.address.street || patient.address.city || patient.address.state || patient.address.zipCode)
                                      ? `${patient.address.street || ''}, ${patient.address.city || ''}, ${patient.address.state || ''} ${patient.address.zipCode || ''}`.replace(/^,\s*|,\s*$/, '').replace(/,\s*,/g, ',').replace(/^\s*,|,\s*$/g, '')
                                      : 'Address not provided'
                                    }
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Medical Information */}
                            <div className="space-y-3">
                              <h4 className="font-semibold text-sm text-foreground flex items-center">
                                <Heart className="w-4 h-4 mr-2" />
                                Medical Information
                              </h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Date of Birth:</span>
                                  <span>{patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString() : 'Not provided'}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Emergency Contact:</span>
                                  <span>
                                    {patient.emergencyContact?.name 
                                      ? `${patient.emergencyContact.name} (${patient.emergencyContact.relationship || 'Relationship not specified'})`
                                      : 'Not provided'
                                    }
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Emergency Phone:</span>
                                  <span>{patient.emergencyContact?.phone || 'Not provided'}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Insurance Provider:</span>
                                  <span>{patient.insurance?.provider || 'Not provided'}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Policy Number:</span>
                                  <span>{patient.insurance?.policyNumber || 'Not provided'}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Age:</span>
                                  <span>{patient.age || patient.calculatedAge || 'Not provided'}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Gender:</span>
                                  <span>{patient.gender || 'Not provided'}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Status:</span>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    patient.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                                    patient.status === 'Inactive' ? 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400' :
                                    patient.status === 'Follow-up' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                                    'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                                  }`}>
                                    {patient.status || 'Active'}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Activity & Timeline */}
                            <div className="space-y-3">
                              <h4 className="font-semibold text-sm text-foreground flex items-center">
                                <Activity className="w-4 h-4 mr-2" />
                                Recent Activity
                              </h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex items-center space-x-2">
                                  <Clock className="w-3 h-3 text-muted-foreground" />
                                  <div>
                                    <div className="font-medium">Last Visit</div>
                                    <div className="text-muted-foreground">
                                      {patient.lastVisit ? new Date(patient.lastVisit).toLocaleDateString() : 'No recent visits'}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Calendar className="w-3 h-3 text-muted-foreground" />
                                  <div>
                                    <div className="font-medium">Next Appointment</div>
                                    <div className="text-muted-foreground">
                                      {patient.nextAppointment ? new Date(patient.nextAppointment).toLocaleDateString() : 'Not scheduled'}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <User className="w-3 h-3 text-muted-foreground" />
                                  <div>
                                    <div className="font-medium">Assigned Doctors</div>
                                    <div className="text-muted-foreground">
                                      {patient.assignedDoctors && patient.assignedDoctors.length > 0 
                                        ? patient.assignedDoctors.map(doctor => 
                                            typeof doctor === 'object' ? doctor.fullName : 'Dr. Assigned'
                                          ).join(', ')
                                        : 'No doctors assigned'
                                      }
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Medical History Section */}
                          {(patient.medicalHistory?.conditions?.length > 0 || 
                            patient.medicalHistory?.allergies?.length > 0 || 
                            patient.medicalHistory?.medications?.length > 0) && (
                            <div className="mt-4 pt-4 border-t border-border/50">
                              <h4 className="font-semibold text-sm text-foreground mb-3 flex items-center">
                                <Heart className="w-4 h-4 mr-2" />
                                Medical History
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                {patient.medicalHistory?.conditions?.length > 0 && (
                                  <div>
                                    <div className="font-medium text-foreground mb-1">Conditions</div>
                                    <div className="space-y-1">
                                      {patient.medicalHistory.conditions.map((condition, index) => (
                                        <div key={index} className="text-muted-foreground bg-background/50 px-2 py-1 rounded text-xs">
                                          {condition}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                {patient.medicalHistory?.allergies?.length > 0 && (
                                  <div>
                                    <div className="font-medium text-foreground mb-1">Allergies</div>
                                    <div className="space-y-1">
                                      {patient.medicalHistory.allergies.map((allergy, index) => (
                                        <div key={index} className="text-red-600 bg-red-50 px-2 py-1 rounded text-xs">
                                          {allergy}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                {patient.medicalHistory?.medications?.length > 0 && (
                                  <div>
                                    <div className="font-medium text-foreground mb-1">Medications</div>
                                    <div className="space-y-1">
                                      {patient.medicalHistory.medications.map((medication, index) => (
                                        <div key={index} className="text-blue-600 bg-blue-50 px-2 py-1 rounded text-xs">
                                          {medication}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Notes Section */}
                          {patient.notes && (
                            <div className="mt-4 pt-4 border-t border-border/50">
                              <h4 className="font-semibold text-sm text-foreground mb-2">Notes</h4>
                              <p className="text-sm text-muted-foreground bg-background/50 p-3 rounded-md">
                                {patient.notes}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-muted-foreground">Page {currentPage} of {totalPages}</p>
                <div className="space-x-2">
                  <Button variant="outline" disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>Previous</Button>
                  <Button variant="outline" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}>Next</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cards">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPatients.map((patient) => (
              <Card key={patient.id} className="border-0 shadow-soft hover:shadow-medical transition-all duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{patient.name}</CardTitle>
                        <CardDescription>ID: {patient.id}</CardDescription>
                      </div>
                    </div>
                    <Badge variant={getStatusColor(patient.status)}>
                      {patient.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Age</p>
                      <p className="font-medium">{patient.age || 0}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Gender</p>
                      <p className="font-medium">{patient.gender || 'Unknown'}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Condition</p>
                    <p className="font-medium">{patient.condition}</p>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span className="truncate">
                      {patient.address && typeof patient.address === 'object' 
                        ? `${patient.address.street || ''}, ${patient.address.city || ''}, ${patient.address.state || ''} ${patient.address.zipCode || ''}`.replace(/^,\s*|,\s*$/, '').replace(/,\s*,/g, ',').replace(/^\s*,|,\s*$/g, '') || 'Address not provided'
                        : patient.address || 'Address not provided'
                      }
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Next: {patient.nextAppointment ? new Date(patient.nextAppointment).toLocaleDateString() : 'Not scheduled'}</span>
                  </div>
                  
                  <div className="flex space-x-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Phone className="w-4 h-4 mr-1" />
                      Call
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <FileText className="w-4 h-4 mr-1" />
                      Records
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-muted-foreground">Page {currentPage} of {totalPages}</p>
            <div className="space-x-2">
              <Button variant="outline" disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>Previous</Button>
              <Button variant="outline" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}>Next</Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Patient Modal */}
      <PatientModal
        isOpen={isPatientModalOpen}
        onClose={handlePatientModalClose}
        onSubmit={handlePatientSubmit}
      />
    </div>
  );
};

export default PatientManagement;
