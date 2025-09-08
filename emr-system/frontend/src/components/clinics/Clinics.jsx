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
  });
  const [saving, setSaving] = useState(false);

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
                setSaving(true);
                // Generate unique Clinic ID (simple example: UKGW + 3-digit random)
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
                    });
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
              {/* Clinic Identity */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium">
                    Clinic Name
                  </label>
                  <input
                    className="form-input w-full"
                    required
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    Type of Clinic
                  </label>
                  <input
                    className="form-input w-full"
                    required
                    value={form.type}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, type: e.target.value }))
                    }
                    placeholder="Dental, General, etc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    Registration Number
                  </label>
                  <input
                    className="form-input w-full"
                    required
                    value={form.registrationNumber}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        registrationNumber: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    Year of Establishment
                  </label>
                  <input
                    className="form-input w-full"
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
                </div>
              </div>
              {/* Contact & Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium">
                    Official Address
                  </label>
                  <input
                    className="form-input w-full"
                    required
                    value={form.address}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, address: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">City</label>
                  <input
                    className="form-input w-full"
                    required
                    value={form.city}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, city: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">State</label>
                  <input
                    className="form-input w-full"
                    required
                    value={form.state}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, state: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Country</label>
                  <input
                    className="form-input w-full"
                    required
                    value={form.country}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, country: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Zip Code</label>
                  <input
                    className="form-input w-full"
                    required
                    value={form.zipCode}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, zipCode: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    Phone Number
                  </label>
                  <input
                    className="form-input w-full"
                    required
                    value={form.phone}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, phone: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    Email Address
                  </label>
                  <input
                    className="form-input w-full"
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, email: e.target.value }))
                    }
                  />
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
              {/* Ownership & Administration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium">
                    Owner/Director Name
                  </label>
                  <input
                    className="form-input w-full"
                    required
                    value={form.ownerName}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, ownerName: e.target.value }))
                    }
                  />
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
                    Clinic Admin/POC Name
                  </label>
                  <input
                    className="form-input w-full"
                    required
                    value={form.adminName}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, adminName: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    Admin Contact Number
                  </label>
                  <input
                    className="form-input w-full"
                    required
                    value={form.adminContact}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, adminContact: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    Admin Email
                  </label>
                  <input
                    className="form-input w-full"
                    required
                    type="email"
                    value={form.adminEmail}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, adminEmail: e.target.value }))
                    }
                  />
                </div>
              </div>
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
                <div>
                  <label className="block text-sm font-medium">
                    Pharmacy Available
                  </label>
                  <input
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
                <div>
                  <label className="block text-sm font-medium">
                    Laboratory Available
                  </label>
                  <input
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
              {/* System Credentials */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium">
                    Admin Username
                  </label>
                  <input
                    className="form-input w-full"
                    required
                    value={form.adminUsername}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, adminUsername: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    Admin Password
                  </label>
                  <input
                    className="form-input w-full"
                    required
                    type="password"
                    value={form.adminPassword}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, adminPassword: e.target.value }))
                    }
                  />
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
