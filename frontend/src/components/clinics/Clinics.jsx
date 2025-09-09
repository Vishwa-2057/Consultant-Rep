import React, { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, Building2 } from "lucide-react";
import { clinicsAPI } from "../../services/api";
import { toast } from "react-hot-toast";

const Clinics = () => {
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [editClinic, setEditClinic] = useState(null);
  const [form, setForm] = useState({
    name: "",
    type: "",
    registrationNumber: "",
    yearOfEstablishment: "",
    address: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
    phone: "",
    email: "",
    website: "",
    ownerName: "",
    ownerMedicalId: "",
    adminName: "",
    adminContact: "",
    adminEmail: "",
    tradeLicense: "",
    medicalCouncilCert: "",
    taxId: "",
    accreditation: "",
    specialties: [],
    services: [],
    operatingHours: "",
    staffCount: "",
    beds: "",
    pharmacyAvailable: false,
    laboratoryAvailable: false,
    paymentMethods: [],
    bankInfo: "",
    adminUsername: "",
    adminPassword: "",
    // Additional fields
    insurancePanel: "", // Insurance panel name or code
    upiId: "", // UPI ID for payments
    holidayOperatingHours: "", // Operating hours for holidays
    masterAdminName: "", // Master admin name
    masterAdminContact: "", // Master admin contact
    masterAdminEmail: "", // Master admin email
    masterAdminUsername: "", // Master admin username
    masterAdminPassword: "", // Master admin password
    additionalCertifications: "", // Other certifications
    additionalNotes: "", // Any extra notes
    faxNumber: "", // Fax number
    emergencyContact: "", // Emergency contact number
    logoUrl: "", // Clinic logo URL
    branchCode: "", // Branch code if multi-branch
    parentOrganization: "", // Parent org if applicable
    registrationExpiry: "", // Registration expiry date
    licenseExpiry: "", // License expiry date
    gstCertificate: "", // GST certificate number
    vatCertificate: "", // VAT certificate number
    insuranceAccepted: [], // List of accepted insurance providers
    telemedicineAvailable: false, // Telemedicine availability
    ambulanceAvailable: false, // Ambulance availability
    parkingAvailable: false, // Parking availability
    wheelchairAccess: false, // Wheelchair accessibility
    fireSafetyCert: "", // Fire safety certificate
    cctvAvailable: false, // CCTV availability
    websiteStatus: "", // Website status (active/inactive)
    facebookPage: "", // Facebook page link
    twitterHandle: "", // Twitter handle
    instagramHandle: "", // Instagram handle
    linkedInPage: "", // LinkedIn page link
    googleMapsLink: "", // Google Maps location
    isoCertification: "", // ISO certification
    jciCertification: "", // JCI certification
    nabhCertification: "", // NABH certification
    otherAccreditations: "", // Other accreditations
  });
  const [saving, setSaving] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchClinics();
  }, []);

  const fetchClinics = async () => {
    try {
      const response = await clinicsAPI.getAll();
      if (response.data.success) {
        setClinics(response.data.clinics);
      }
    } catch (error) {
      toast.error("Failed to fetch clinics");
    } finally {
      setLoading(false);
    }
  };

  const filteredClinics = clinics.filter(
    (clinic) =>
      clinic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clinic.registrationNumber
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      clinic.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clinic.country?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-green-900">Clinics</h1>
          <p className="text-green-600">Manage healthcare facilities</p>
        </div>
        <button className="btn-green" onClick={() => setShowModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Clinic
        </button>
      </div>

      {/* Modal for Add Clinic */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 relative overflow-y-auto max-h-[90vh]">
            <button
              className="absolute top-4 right-4 text-green-500 hover:text-green-700"
              onClick={() => setShowModal(false)}
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-4">Add Clinic</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                // Validation
                const errors = {};
                if (!form.name) errors.name = "Clinic Name is required";
                if (!form.type) errors.type = "Type of Clinic is required";
                if (!form.registrationNumber)
                  errors.registrationNumber = "Registration Number is required";
                if (!form.yearOfEstablishment)
                  errors.yearOfEstablishment =
                    "Year of Establishment is required";
                if (!form.address)
                  errors.address = "Official Address is required";
                if (!form.city) errors.city = "City is required";
                if (!form.state) errors.state = "State is required";
                if (!form.country) errors.country = "Country is required";
                if (!form.zipCode) errors.zipCode = "Zip Code is required";
                if (!form.phone) errors.phone = "Phone Number is required";
                else if (!/^\d{7,15}$/.test(form.phone))
                  errors.phone = "Phone Number must be 7-15 digits";
                if (!form.email) errors.email = "Email Address is required";
                else if (!/^\S+@\S+\.\S+$/.test(form.email))
                  errors.email = "Invalid Email Address";
                if (!form.ownerName)
                  errors.ownerName = "Owner/Director Name is required";
                if (!form.adminName)
                  errors.adminName = "Clinic Admin/POC Name is required";
                if (!form.adminContact)
                  errors.adminContact = "Admin Contact Number is required";
                if (!form.adminEmail)
                  errors.adminEmail = "Admin Email is required";
                else if (!/^\S+@\S+\.\S+$/.test(form.adminEmail))
                  errors.adminEmail = "Invalid Admin Email";
                if (!form.adminUsername)
                  errors.adminUsername = "Admin Username is required";
                if (!form.adminPassword)
                  errors.adminPassword = "Admin Password is required";
                else if (form.adminPassword.length < 6)
                  errors.adminPassword =
                    "Password must be at least 6 characters";
                setFormErrors(errors);
                if (Object.keys(errors).length > 0) return;
                setSaving(true);
                const clinicId = "UKGW" + Math.floor(100 + Math.random() * 900);
                const payload = { ...form, clinicId };
                try {
                  const response = await clinicsAPI.create(payload);
                  if (response.data.success) {
                    toast.success("Clinic added successfully");
                    setShowModal(false);
                    setForm({
                      name: "",
                      type: "",
                      registrationNumber: "",
                      yearOfEstablishment: "",
                      address: "",
                      city: "",
                      state: "",
                      country: "",
                      zipCode: "",
                      phone: "",
                      email: "",
                      website: "",
                      ownerName: "",
                      ownerMedicalId: "",
                      adminName: "",
                      adminContact: "",
                      adminEmail: "",
                      tradeLicense: "",
                      medicalCouncilCert: "",
                      taxId: "",
                      accreditation: "",
                      specialties: [],
                      services: [],
                      operatingHours: "",
                      staffCount: "",
                      beds: "",
                      pharmacyAvailable: false,
                      laboratoryAvailable: false,
                      paymentMethods: [],
                      bankInfo: "",
                      adminUsername: "",
                      adminPassword: "",
                      // Additional fields
                      insurancePanel: "", // Insurance panel name or code
                      upiId: "", // UPI ID for payments
                      holidayOperatingHours: "", // Operating hours for holidays
                      masterAdminName: "", // Master admin name
                      masterAdminContact: "", // Master admin contact
                      masterAdminEmail: "", // Master admin email
                      masterAdminUsername: "", // Master admin username
                      masterAdminPassword: "", // Master admin password
                      additionalCertifications: "", // Other certifications
                      additionalNotes: "", // Any extra notes
                      faxNumber: "", // Fax number
                      emergencyContact: "", // Emergency contact number
                      logoUrl: "", // Clinic logo URL
                      branchCode: "", // Branch code if multi-branch
                      parentOrganization: "", // Parent org if applicable
                      registrationExpiry: "", // Registration expiry date
                      licenseExpiry: "", // License expiry date
                      gstCertificate: "", // GST certificate number
                      vatCertificate: "", // VAT certificate number
                      insuranceAccepted: [], // List of accepted insurance providers
                      telemedicineAvailable: false, // Telemedicine availability
                      ambulanceAvailable: false, // Ambulance availability
                      parkingAvailable: false, // Parking availability
                      wheelchairAccess: false, // Wheelchair accessibility
                      fireSafetyCert: "", // Fire safety certificate
                      cctvAvailable: false, // CCTV availability
                      websiteStatus: "", // Website status (active/inactive)
                      facebookPage: "", // Facebook page link
                      twitterHandle: "", // Twitter handle
                      instagramHandle: "", // Instagram handle
                      linkedInPage: "", // LinkedIn page link
                      googleMapsLink: "", // Google Maps location
                      isoCertification: "", // ISO certification
                      jciCertification: "", // JCI certification
                      nabhCertification: "", // NABH certification
                      otherAccreditations: "", // Other accreditations
                    });
                    setFormErrors({});
                    fetchClinics();
                  } else {
                    toast.error(
                      response.data.message || "Failed to add clinic"
                    );
                  }
                } catch (err) {
                  toast.error("Failed to add clinic");
                } finally {
                  setSaving(false);
                }
              }}
            >
              <h3 className="text-lg font-semibold text-green-800 mb-3 border-b border-green-200 pb-2">
                Basic Information
              </h3>
              {/* Clinic Identity */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium">
                    Clinic Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    className={`form-input w-full ${
                      formErrors.name ? "border-red-500" : ""
                    }`}
                    required
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                  />
                  {formErrors.name && (
                    <div className="text-red-500 text-xs mt-1">
                      {formErrors.name}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    Type of Clinic <span className="text-red-500">*</span>
                  </label>
                  <select
                    className={`form-select w-full ${
                      formErrors.type ? "border-red-500" : ""
                    }`}
                    required
                    value={form.type}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, type: e.target.value }))
                    }
                  >
                    <option value="">Select type</option>
                    <option value="General / Family Medicine">
                      General / Family Medicine
                    </option>
                    <option value="Pediatric">Pediatric</option>
                    <option value="Geriatric">Geriatric</option>
                    <option value="Dental">Dental</option>
                    <option value="Orthodontics">Orthodontics</option>
                    <option value="Oral Surgery">Oral Surgery</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Orthopedic">Orthopedic</option>
                    <option value="Dermatology">Dermatology</option>
                    <option value="ENT (Ear, Nose, Throat)">
                      ENT (Ear, Nose, Throat)
                    </option>
                    <option value="Ophthalmology (Eye)">
                      Ophthalmology (Eye)
                    </option>
                    <option value="Pulmonology (Respiratory)">
                      Pulmonology (Respiratory)
                    </option>
                    <option value="Gastroenterology">Gastroenterology</option>
                    <option value="Urology">Urology</option>
                    <option value="Gynecology / Obstetrics">
                      Gynecology / Obstetrics
                    </option>
                    <option value="Endocrinology">Endocrinology</option>
                    <option value="Rheumatology">Rheumatology</option>
                    <option value="General Surgery">General Surgery</option>
                    <option value="Plastic & Cosmetic Surgery">
                      Plastic & Cosmetic Surgery
                    </option>
                    <option value="Radiology & Imaging">
                      Radiology & Imaging
                    </option>
                    <option value="Pathology & Laboratory">
                      Pathology & Laboratory
                    </option>
                    <option value="Physiotherapy & Rehabilitation">
                      Physiotherapy & Rehabilitation
                    </option>
                    <option value="Psychiatry">Psychiatry</option>
                    <option value="Psychology & Counseling">
                      Psychology & Counseling
                    </option>
                    <option value="Substance Abuse / De-addiction">
                      Substance Abuse / De-addiction
                    </option>
                    <option value="Ayurveda">Ayurveda</option>
                    <option value="Homeopathy">Homeopathy</option>
                    <option value="Acupuncture / Traditional Medicine">
                      Acupuncture / Traditional Medicine
                    </option>
                    <option value="Oncology (Cancer)">Oncology (Cancer)</option>
                    <option value="Nephrology (Kidney)">
                      Nephrology (Kidney)
                    </option>
                    <option value="Fertility & IVF">Fertility & IVF</option>
                    <option value="Pain Management">Pain Management</option>
                    <option value="Sports Medicine">Sports Medicine</option>
                    <option value="Nutrition & Dietetics">
                      Nutrition & Dietetics
                    </option>
                    <option value="Immunology & Allergy">
                      Immunology & Allergy
                    </option>
                  </select>
                  {formErrors.type && (
                    <div className="text-red-500 text-xs mt-1">
                      {formErrors.type}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    Registration Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    className={`form-input w-full ${
                      formErrors.registrationNumber ? "border-red-500" : ""
                    }`}
                    required
                    value={form.registrationNumber}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        registrationNumber: e.target.value,
                      }))
                    }
                  />
                  {formErrors.registrationNumber && (
                    <div className="text-red-500 text-xs mt-1">
                      {formErrors.registrationNumber}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    Year of Establishment{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    className={`form-input w-full ${
                      formErrors.yearOfEstablishment ? "border-red-500" : ""
                    }`}
                    required
                    type="number"
                    value={form.yearOfEstablishment}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        yearOfEstablishment: e.target.value,
                      }))
                    }
                  />
                  {formErrors.yearOfEstablishment && (
                    <div className="text-red-500 text-xs mt-1">
                      {formErrors.yearOfEstablishment}
                    </div>
                  )}
                </div>
              </div>

              <h3 className="text-lg font-semibold text-green-800 mb-3 border-b border-green-200 pb-2 mt-6">
                Contact & Location
              </h3>
              {/* Contact & Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium">
                    Official Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    className={`form-input w-full ${
                      formErrors.address ? "border-red-500" : ""
                    }`}
                    required
                    value={form.address}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, address: e.target.value }))
                    }
                  />
                  {formErrors.address && (
                    <div className="text-red-500 text-xs mt-1">
                      {formErrors.address}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    className={`form-input w-full ${
                      formErrors.city ? "border-red-500" : ""
                    }`}
                    required
                    value={form.city}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, city: e.target.value }))
                    }
                  />
                  {formErrors.city && (
                    <div className="text-red-500 text-xs mt-1">
                      {formErrors.city}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    State <span className="text-red-500">*</span>
                  </label>
                  <input
                    className={`form-input w-full ${
                      formErrors.state ? "border-red-500" : ""
                    }`}
                    required
                    value={form.state}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, state: e.target.value }))
                    }
                  />
                  {formErrors.state && (
                    <div className="text-red-500 text-xs mt-1">
                      {formErrors.state}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <input
                    className={`form-input w-full ${
                      formErrors.country ? "border-red-500" : ""
                    }`}
                    required
                    value={form.country}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, country: e.target.value }))
                    }
                  />
                  {formErrors.country && (
                    <div className="text-red-500 text-xs mt-1">
                      {formErrors.country}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    Zip Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    className={`form-input w-full ${
                      formErrors.zipCode ? "border-red-500" : ""
                    }`}
                    required
                    value={form.zipCode}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, zipCode: e.target.value }))
                    }
                  />
                  {formErrors.zipCode && (
                    <div className="text-red-500 text-xs mt-1">
                      {formErrors.zipCode}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    className={`form-input w-full ${
                      formErrors.phone ? "border-red-500" : ""
                    }`}
                    required
                    value={form.phone}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, phone: e.target.value }))
                    }
                  />
                  {formErrors.phone && (
                    <div className="text-red-500 text-xs mt-1">
                      {formErrors.phone}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    className={`form-input w-full ${
                      formErrors.email ? "border-red-500" : ""
                    }`}
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, email: e.target.value }))
                    }
                  />
                  {formErrors.email && (
                    <div className="text-red-500 text-xs mt-1">
                      {formErrors.email}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    Website (optional)
                  </label>
                  <input
                    className="form-input w-full"
                    value={form.website}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, website: e.target.value }))
                    }
                  />
                </div>
              </div>

              <h3 className="text-lg font-semibold text-green-800 mb-3 border-b border-green-200 pb-2 mt-6">
                Ownership & Administration
              </h3>
              {/* Ownership & Administration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium">
                    Owner/Director Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    className={`form-input w-full ${
                      formErrors.ownerName ? "border-red-500" : ""
                    }`}
                    required
                    value={form.ownerName}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, ownerName: e.target.value }))
                    }
                  />
                  {formErrors.ownerName && (
                    <div className="text-red-500 text-xs mt-1">
                      {formErrors.ownerName}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    Medical Registration ID
                  </label>
                  <input
                    className="form-input w-full"
                    value={form.ownerMedicalId}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, ownerMedicalId: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    Clinic Admin/POC Name{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    className={`form-input w-full ${
                      formErrors.adminName ? "border-red-500" : ""
                    }`}
                    required
                    value={form.adminName}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, adminName: e.target.value }))
                    }
                  />
                  {formErrors.adminName && (
                    <div className="text-red-500 text-xs mt-1">
                      {formErrors.adminName}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    Admin Contact Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    className={`form-input w-full ${
                      formErrors.adminContact ? "border-red-500" : ""
                    }`}
                    required
                    value={form.adminContact}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, adminContact: e.target.value }))
                    }
                  />
                  {formErrors.adminContact && (
                    <div className="text-red-500 text-xs mt-1">
                      {formErrors.adminContact}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    Admin Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    className={`form-input w-full ${
                      formErrors.adminEmail ? "border-red-500" : ""
                    }`}
                    required
                    type="email"
                    value={form.adminEmail}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, adminEmail: e.target.value }))
                    }
                  />
                  {formErrors.adminEmail && (
                    <div className="text-red-500 text-xs mt-1">
                      {formErrors.adminEmail}
                    </div>
                  )}
                </div>
              </div>

              <h3 className="text-lg font-semibold text-green-800 mb-3 border-b border-green-200 pb-2 mt-6">
                Legal & Compliance
              </h3>
              {/* Legal & Compliance */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium">
                    Trade/Business License Certificate
                  </label>
                  <input
                    className="form-input w-full"
                    value={form.tradeLicense}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, tradeLicense: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    Medical Council Approval Certificate
                  </label>
                  <input
                    className="form-input w-full"
                    value={form.medicalCouncilCert}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        medicalCouncilCert: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    Tax ID (GST/VAT/Other)
                  </label>
                  <input
                    className="form-input w-full"
                    value={form.taxId}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, taxId: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    Accreditation (NABH, JCI, etc.)
                  </label>
                  <input
                    className="form-input w-full"
                    value={form.accreditation}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, accreditation: e.target.value }))
                    }
                  />
                </div>
              </div>

              <h3 className="text-lg font-semibold text-green-800 mb-3 border-b border-green-200 pb-2 mt-6">
                Services & Specialties
              </h3>
              {/* Facilities & Operations */}
              <div className="mb-4">
                <label className="block text-sm font-medium">
                  Specialties Offered
                </label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {[
                    "Dentistry",
                    "Pediatrics",
                    "Cardiology",
                    "General",
                    "Diagnostic",
                    "Multi-specialty",
                    "Telemedicine",
                  ].map((spec) => (
                    <label key={spec} className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked={form.specialties.includes(spec)}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            specialties: e.target.checked
                              ? [...f.specialties, spec]
                              : f.specialties.filter((s) => s !== spec),
                          }))
                        }
                      />
                      <span>{spec}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Services</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {["Consultation", "Lab Tests", "Pharmacy", "Surgery"].map(
                    (serv) => (
                      <label key={serv} className="flex items-center gap-1">
                        <input
                          type="checkbox"
                          checked={form.services.includes(serv)}
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              services: e.target.checked
                                ? [...f.services, serv]
                                : f.services.filter((s) => s !== serv),
                            }))
                          }
                        />
                        <span>{serv}</span>
                      </label>
                    )
                  )}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">
                  Operating Hours
                </label>
                <input
                  className="form-input w-full"
                  value={form.operatingHours}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, operatingHours: e.target.value }))
                  }
                  placeholder="Weekdays, Weekends, Holidays"
                />
              </div>

              <h3 className="text-lg font-semibold text-green-800 mb-3 border-b border-green-200 pb-2 mt-6">
                Infrastructure & Facilities
              </h3>
              {/* Infrastructure */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium">
                    Number of Staff
                  </label>
                  <input
                    className="form-input w-full"
                    type="number"
                    value={form.staffCount}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, staffCount: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    Beds Available
                  </label>
                  <input
                    className="form-input w-full"
                    type="number"
                    value={form.beds}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, beds: e.target.value }))
                    }
                  />
                </div>
                <div className="flex items-center">
                  <label className="block text-sm font-medium">
                    Pharmacy Available
                  </label>
                  <input
                    className="ml-2"
                    type="checkbox"
                    checked={form.pharmacyAvailable}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        pharmacyAvailable: e.target.checked,
                      }))
                    }
                  />
                </div>
                <div className="flex items-center">
                  <label className="block text-sm font-medium">
                    Laboratory Available
                  </label>
                  <input
                    className="ml-2"
                    type="checkbox"
                    checked={form.laboratoryAvailable}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        laboratoryAvailable: e.target.checked,
                      }))
                    }
                  />
                </div>
              </div>

              <h3 className="text-lg font-semibold text-green-800 mb-3 border-b border-green-200 pb-2 mt-6">
                Payment & Banking
              </h3>
              {/* Finance & Payment Setup */}
              <div className="mb-4">
                <label className="block text-sm font-medium">
                  Preferred Payment Methods
                </label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {["Bank", "UPI", "Insurance"].map((pm) => (
                    <label key={pm} className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked={form.paymentMethods.includes(pm)}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            paymentMethods: e.target.checked
                              ? [...f.paymentMethods, pm]
                              : f.paymentMethods.filter((p) => p !== pm),
                          }))
                        }
                      />
                      <span>{pm}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">
                  Bank Account / Billing Info
                </label>
                <input
                  className="form-input w-full"
                  value={form.bankInfo}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, bankInfo: e.target.value }))
                  }
                />
              </div>

              <h3 className="text-lg font-semibold text-green-800 mb-3 border-b border-green-200 pb-2 mt-6">
                System Access
              </h3>
              {/* System Credentials */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium">
                    Admin Username <span className="text-red-500">*</span>
                  </label>
                  <input
                    className={`form-input w-full ${
                      formErrors.adminUsername ? "border-red-500" : ""
                    }`}
                    required
                    value={form.adminUsername}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, adminUsername: e.target.value }))
                    }
                  />
                  {formErrors.adminUsername && (
                    <div className="text-red-500 text-xs mt-1">
                      {formErrors.adminUsername}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    Admin Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    className={`form-input w-full ${
                      formErrors.adminPassword ? "border-red-500" : ""
                    }`}
                    required
                    type="password"
                    value={form.adminPassword}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, adminPassword: e.target.value }))
                    }
                  />
                  {formErrors.adminPassword && (
                    <div className="text-red-500 text-xs mt-1">
                      {formErrors.adminPassword}
                    </div>
                  )}
                </div>
              </div>
              <button
                type="submit"
                className="btn-green w-full mt-2"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Clinic"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Clinics List Section */}
      <div className="card border-green-200">
        <div className="flex items-center mb-6">
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search clinics by name, registration number, type, or country..."
              className="form-input pl-10 border-green-300 focus:border-green-500 focus:ring-green-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-green-200">
            <thead className="bg-green-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                  Registration Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                  Clinic Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                  Country
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-green-100">
              {filteredClinics.map((clinic) => (
                <tr key={clinic._id} className="hover:bg-green-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {clinic.registrationNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{clinic.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{clinic.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {clinic.country}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      className="btn-green btn-sm"
                      onClick={() => setSelectedClinic(clinic)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredClinics.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-green-900 mb-2">
              No clinics found
            </h3>
            <p className="text-green-500">
              Get started by adding your first clinic.
            </p>
          </div>
        )}
      </div>

      {/* Clinic Details Modal/Section */}
      {selectedClinic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 relative overflow-y-auto max-h-[90vh]">
            <button
              className="absolute top-4 right-4 text-green-500 hover:text-green-700"
              onClick={() => setSelectedClinic(null)}
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-4 text-green-900">
              Clinic Details
            </h2>
            <table className="min-w-full text-sm">
              <tbody>
                <tr>
                  <td className="font-semibold">Registration Number</td>
                  <td>{selectedClinic.registrationNumber}</td>
                </tr>
                <tr>
                  <td className="font-semibold">Clinic Name</td>
                  <td>{selectedClinic.name}</td>
                </tr>
                <tr>
                  <td className="font-semibold">Type</td>
                  <td>{selectedClinic.type}</td>
                </tr>
                <tr>
                  <td className="font-semibold">Year of Establishment</td>
                  <td>{selectedClinic.yearOfEstablishment}</td>
                </tr>
                <tr>
                  <td className="font-semibold">Official Address</td>
                  <td>{selectedClinic.address}</td>
                </tr>
                <tr>
                  <td className="font-semibold">City</td>
                  <td>{selectedClinic.city}</td>
                </tr>
                <tr>
                  <td className="font-semibold">State</td>
                  <td>{selectedClinic.state}</td>
                </tr>
                <tr>
                  <td className="font-semibold">Country</td>
                  <td>{selectedClinic.country}</td>
                </tr>
                <tr>
                  <td className="font-semibold">Zip Code</td>
                  <td>{selectedClinic.zipCode}</td>
                </tr>
                <tr>
                  <td className="font-semibold">Phone Number</td>
                  <td>{selectedClinic.phone}</td>
                </tr>
                <tr>
                  <td className="font-semibold">Email Address</td>
                  <td>{selectedClinic.email}</td>
                </tr>
                <tr>
                  <td className="font-semibold">Website</td>
                  <td>{selectedClinic.website || "-"}</td>
                </tr>
                <tr>
                  <td className="font-semibold">Owner/Director Name</td>
                  <td>{selectedClinic.ownerName}</td>
                </tr>
                <tr>
                  <td className="font-semibold">Medical Registration ID</td>
                  <td>{selectedClinic.ownerMedicalId || "-"}</td>
                </tr>
                <tr>
                  <td className="font-semibold">Clinic Admin/POC Name</td>
                  <td>{selectedClinic.adminName}</td>
                </tr>
                <tr>
                  <td className="font-semibold">Admin Contact Number</td>
                  <td>{selectedClinic.adminContact}</td>
                </tr>
                <tr>
                  <td className="font-semibold">Admin Email</td>
                  <td>{selectedClinic.adminEmail}</td>
                </tr>
                <tr>
                  <td className="font-semibold">
                    Trade/Business License Certificate
                  </td>
                  <td>{selectedClinic.tradeLicense || "-"}</td>
                </tr>
                <tr>
                  <td className="font-semibold">
                    Medical Council Approval Certificate
                  </td>
                  <td>{selectedClinic.medicalCouncilCert || "-"}</td>
                </tr>
                <tr>
                  <td className="font-semibold">Tax ID</td>
                  <td>{selectedClinic.taxId || "-"}</td>
                </tr>
                <tr>
                  <td className="font-semibold">Accreditation</td>
                  <td>{selectedClinic.accreditation || "-"}</td>
                </tr>
                <tr>
                  <td className="font-semibold">Specialties Offered</td>
                  <td>{selectedClinic.specialties?.join(", ") || "-"}</td>
                </tr>
                <tr>
                  <td className="font-semibold">Services</td>
                  <td>{selectedClinic.services?.join(", ") || "-"}</td>
                </tr>
                <tr>
                  <td className="font-semibold">Operating Hours</td>
                  <td>{selectedClinic.operatingHours || "-"}</td>
                </tr>
                <tr>
                  <td className="font-semibold">Number of Staff</td>
                  <td>{selectedClinic.staffCount || "-"}</td>
                </tr>
                <tr>
                  <td className="font-semibold">Beds Available</td>
                  <td>{selectedClinic.beds || "-"}</td>
                </tr>
                <tr>
                  <td className="font-semibold">Pharmacy Available</td>
                  <td>{selectedClinic.pharmacyAvailable ? "Yes" : "No"}</td>
                </tr>
                <tr>
                  <td className="font-semibold">Laboratory Available</td>
                  <td>{selectedClinic.laboratoryAvailable ? "Yes" : "No"}</td>
                </tr>
                <tr>
                  <td className="font-semibold">Preferred Payment Methods</td>
                  <td>{selectedClinic.paymentMethods?.join(", ") || "-"}</td>
                </tr>
                <tr>
                  <td className="font-semibold">Bank Account / Billing Info</td>
                  <td>{selectedClinic.bankInfo || "-"}</td>
                </tr>
                <tr>
                  <td className="font-semibold">Admin Username</td>
                  <td>{selectedClinic.adminUsername}</td>
                </tr>
                <tr>
                  <td className="font-semibold">Admin Password</td>
                  <td>{selectedClinic.adminPassword}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clinics;
