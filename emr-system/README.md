# EMR Healthcare Management System

A comprehensive Electronic Medical Records (EMR) system built with the MERN stack, designed for modern healthcare facilities with role-based access control and professional UI design.

## 🏥 System Overview

This EMR system provides a complete healthcare management solution with support for multiple user roles, clinic management, appointment scheduling, billing, and patient records management.

## 🚀 Features

### Core Functionality
- **Multi-role Authentication**: JWT-based authentication with OTP verification
- **Role-based Access Control**: Granular permissions for different user types
- **Clinic Management**: Multi-clinic support with hierarchical admin structure
- **Patient Management**: Comprehensive patient records and medical history
- **Appointment Scheduling**: Advanced scheduling system with conflict resolution
- **Billing System**: Complete invoicing and payment tracking
- **Audit Logging**: Comprehensive activity tracking for compliance

### User Roles
1. **Super Master Admin**: System-wide oversight, clinic management
2. **Super Admin**: Clinic-level administration and staff management
3. **Doctors**: Patient care, prescriptions, appointment management
4. **Nurses**: Patient care support, vital signs, medication tracking
5. **Billing Staff**: Invoice management, payment processing
6. **Pharmacy Staff**: Medication dispensing, inventory management
7. **Patients**: Appointment booking, medical records access, bill payments

## 🛠 Technology Stack

### Backend
- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Nodemailer** for email services
- **Express-validator** for input validation

### Frontend
- **React** with functional components and hooks
- **React Router** for navigation
- **Axios** for API communication
- **React Hook Form** for form management
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **React Hot Toast** for notifications

## 📁 Project Structure

```
emr-system/
├── backend/
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── middleware/      # Authentication & validation
│   ├── server.js        # Main server file
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/  # React components
    │   ├── contexts/    # Context providers
    │   ├── services/    # API services
    │   └── main.jsx     # Entry point
    └── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Compass)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd emr-system
   ```

2. **Set up the Backend**
   ```bash
   cd backend
   npm install
   ```

3. **Configure Environment Variables**
   - Copy `.env.example` to `.env`
   - Update the following variables:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/emrdb
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=7d
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_password
   ```

4. **Set up the Frontend**
   ```bash
   cd ../frontend
   npm install
   ```

5. **Start MongoDB**
   - Ensure MongoDB is running on localhost:27017
   - Or use MongoDB Compass to connect to local database

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd backend
   npm start
   ```
   The backend will run on http://localhost:5000

2. **Start the Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will run on http://localhost:3000

## 🎨 Design System

### Color Palette
- **Primary**: Light blue (#3B82F6) for buttons, links, and active states
- **Background**: Pure white (#FFFFFF)
- **Text**: Gray scale for hierarchy and readability
- **Status Colors**: Green (success), Red (error), Yellow (warning)

### UI Principles
- Minimal and clean design aesthetic
- Consistent spacing using 8px grid system
- Professional healthcare-focused interface
- Responsive design for all device sizes
- Accessibility-compliant color contrasts

## 🔐 Authentication Flow

1. **Registration**: Users register with role selection and basic information
2. **OTP Verification**: Email-based OTP verification for account activation
3. **Login**: Secure JWT-based authentication
4. **Role-based Routing**: Automatic redirection to appropriate dashboard

## 📊 Dashboard Features

### Super Master Admin
- System-wide metrics and analytics
- Clinic management and oversight
- User activity monitoring
- Revenue tracking across all clinics

### Super Admin
- Clinic staff management
- Patient registration and management
- Appointment oversight
- Clinic-level reporting

### Doctor Dashboard
- Today's appointment schedule
- Patient medical records
- Prescription management
- Clinical notes and observations

### Patient Portal
- Appointment booking and history
- Medical records access
- Bill payment and history
- Prescription viewing

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **Role-based Authorization**: Granular access control
- **Input Validation**: Comprehensive server-side validation
- **CORS Configuration**: Secure cross-origin resource sharing

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-otp` - OTP verification
- `GET /api/auth/me` - Get current user

### Clinics
- `GET /api/clinics` - Get all clinics
- `POST /api/clinics` - Create new clinic
- `PUT /api/clinics/:id` - Update clinic
- `DELETE /api/clinics/:id` - Delete clinic

### Users
- `GET /api/users` - Get users (filtered by role/clinic)
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Patients
- `GET /api/patients` - Get all patients
- `GET /api/patients/:id` - Get patient details
- `PUT /api/patients/:id` - Update patient

### Appointments
- `GET /api/appointments` - Get appointments
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/:id` - Update appointment

### Billing
- `GET /api/billing` - Get all bills
- `POST /api/billing` - Create new bill
- `PUT /api/billing/:id` - Update bill

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 🚀 Deployment

### Production Build
```bash
# Build frontend
cd frontend
npm run build

# Start production server
cd ../backend
NODE_ENV=production npm start
```

### Environment Configuration
- Set `NODE_ENV=production`
- Configure production MongoDB URI
- Update CORS settings for production domain
- Set up SSL certificates for HTTPS

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions, please contact:
- Email: support@emr-system.com
- Documentation: [View Docs](docs/README.md)

## 🔄 Version History

- **v1.0.0** - Initial release with core functionality
- Role-based authentication and authorization
- Basic clinic and patient management
- Appointment scheduling system
- Billing and payment tracking

---

**Built with ❤️ for modern healthcare facilities**