# User Registration Guide - EMR Healthcare System

## 🚀 Registration Issues Fixed!

I've fixed all the registration/signup issues in your EMR system. Here's what was wrong and how it's now resolved:

## 🔧 Issues Fixed

### 1. **Module Import/Export Mismatch**
- **Problem**: Auth routes used ES6 imports but server used CommonJS
- **Solution**: Converted all imports to CommonJS `require()` syntax

### 2. **JWT Environment Variable**
- **Problem**: JWT_EXPIRE vs JWT_EXPIRES_IN mismatch
- **Solution**: Standardized to JWT_EXPIRES_IN with fallback

### 3. **Missing Field Validation**
- **Problem**: No proper validation for required fields
- **Solution**: Added comprehensive field validation

## 📋 Available Registration Endpoints

### 1. **Standard Registration** (with OTP verification)
```
POST /api/auth/register
```

**Required Fields:**
```json
{
  "firstName": "John",
  "lastName": "Doe", 
  "email": "john@example.com",
  "password": "password123",
  "phone": "+91-9876543210",
  "role": "patient|doctor|nurse|super_admin|super_master_admin"
}
```

**Optional Fields (role-dependent):**
```json
{
  "clinicId": "clinic_object_id",
  "specialization": "Cardiology", // for doctors
  "licenseNumber": "DOC-2024-001" // for doctors/nurses
}
```

### 2. **Quick Registration** (no OTP - for testing)
```
POST /api/auth/quick-register
```
Same fields as above, but user is immediately verified and logged in.

## 🧪 Testing Registration

### Method 1: Using the Test Script
```bash
npm run test-register
```

### Method 2: Using Postman/Thunder Client
**URL:** `http://localhost:5000/api/auth/quick-register`
**Method:** POST
**Body (JSON):**

#### Super Admin Registration:
```json
{
  "firstName": "Super",
  "lastName": "Admin",
  "email": "superadmin@test.com",
  "password": "admin123456",
  "phone": "+91-9999999999",
  "role": "super_master_admin"
}
```

#### Doctor Registration:
```json
{
  "firstName": "Dr. Jane",
  "lastName": "Smith",
  "email": "doctor@test.com",
  "password": "doctor123456",
  "phone": "+91-9999999998",
  "role": "doctor",
  "clinicId": "507f1f77bcf86cd799439011",
  "specialization": "General Medicine",
  "licenseNumber": "DOC-2024-TEST"
}
```

#### Patient Registration:
```json
{
  "firstName": "John",
  "lastName": "Patient",
  "email": "patient@test.com",
  "password": "patient123456",
  "phone": "+91-9999999997",
  "role": "patient",
  "clinicId": "507f1f77bcf86cd799439011",
  "dateOfBirth": "1990-01-01",
  "gender": "male"
}
```

## 🔐 User Roles Available

1. **super_master_admin** - Highest level access
2. **super_admin** - Clinic-level admin
3. **doctor** - Medical practitioners
4. **nurse** - Nursing staff
5. **billing_staff** - Billing department
6. **pharmacy_staff** - Pharmacy management
7. **patient** - Patients

## ✅ Expected Response

**Success Response:**
```json
{
  "success": true,
  "message": "User registered and logged in successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "patient",
    "clinicId": "clinic_id",
    "specialization": null
  }
}
```

## 🚨 Common Errors & Solutions

### Error: "Please provide all required fields"
**Solution:** Ensure you include firstName, lastName, email, password, phone, and role

### Error: "User already exists"
**Solution:** Use a different email address or delete the existing user from MongoDB

### Error: "Registration failed"
**Solution:** Check server logs for detailed error information

## 🔄 Testing Steps

1. **Start the backend server:**
   ```bash
   npm run dev
   ```

2. **Test registration:**
   ```bash
   npm run test-register
   ```

3. **Check MongoDB Compass:**
   - Connection: `mongodb://localhost:27017`
   - Database: `emr_healthcare_db`
   - Collection: `users`

## 🎯 Next Steps

1. Use `/api/auth/quick-register` for immediate testing
2. Use `/api/auth/register` + `/api/auth/verify-otp` for production
3. Test login with registered users using `/api/auth/login`
4. View registered users in MongoDB Compass

The registration system is now fully functional! 🎉
