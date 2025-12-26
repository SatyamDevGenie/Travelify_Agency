# Booking & Payment Implementation Guide

## Overview
This document describes the complete booking and payment functionality implemented in the Travelify application.

## Features Implemented

### 1. User Booking System
- ✅ Users can book any available tour
- ✅ Booking form with guest details (name, email, phone, number of guests)
- ✅ Real-time slot availability checking
- ✅ Booking status tracking (pending, confirmed, cancelled)

### 2. Razorpay Payment Gateway Integration
- ✅ Complete Razorpay integration for secure payments
- ✅ Order creation before payment
- ✅ Payment verification on backend
- ✅ Payment status tracking (pending, completed, failed, refunded)
- ✅ Proper error handling and user feedback

### 3. Admin Booking Management
- ✅ Admin can view all bookings
- ✅ Admin can confirm bookings
- ✅ Admin can cancel bookings
- ✅ Automatic slot management (slots decrease on booking, increase on cancellation)

### 4. Email Notifications
- ✅ Email sent to user when booking is created (pending status)
- ✅ Email sent when admin confirms booking
- ✅ Email sent when admin cancels booking (with refund information)
- ✅ Professional email templates with booking details

### 5. Frontend Pages & Components
- ✅ Booking Modal component with Razorpay integration
- ✅ My Bookings page for users to view their bookings
- ✅ Admin Bookings Management page
- ✅ Updated Tour Detail page with booking functionality
- ✅ Navigation menu updates with booking links

## Backend Implementation

### Models
- **Booking Model** (`backend/models/bookingModel.js`)
  - Tour reference
  - User reference
  - Number of guests
  - Total amount
  - Payment status
  - Booking status
  - Razorpay payment details
  - Guest details

### Controllers
- **Booking Controller** (`backend/controllers/bookingController.js`)
  - `createOrder` - Create Razorpay order
  - `verifyPayment` - Verify payment and create booking
  - `getMyBookings` - Get user's bookings
  - `getAllBookings` - Get all bookings (Admin)
  - `getBookingById` - Get single booking
  - `confirmBooking` - Confirm booking (Admin)
  - `cancelBooking` - Cancel booking (Admin)

### Routes
- **Booking Routes** (`backend/routes/bookingRoutes.js`)
  - `POST /api/bookings/create-order` - Create payment order
  - `POST /api/bookings/verify-payment` - Verify and create booking
  - `GET /api/bookings/my-bookings` - Get user bookings
  - `GET /api/bookings/all/bookings` - Get all bookings (Admin)
  - `GET /api/bookings/:id` - Get booking by ID
  - `PUT /api/bookings/:id/confirm` - Confirm booking (Admin)
  - `PUT /api/bookings/:id/cancel` - Cancel booking (Admin)

## Frontend Implementation

### Redux Slice
- **Booking Slice** (`frontend/src/features/booking/bookingSlice.js`)
  - State management for bookings
  - Async thunks for API calls
  - Loading and error states

### Components
- **BookingModal** (`frontend/src/components/BookingModal.jsx`)
  - Booking form
  - Razorpay payment integration
  - Order creation and payment handling

### Pages
- **MyBookings** (`frontend/src/pages/MyBookings.jsx`)
  - Display user's bookings
  - Booking status indicators
  - Booking details

- **AdminBookings** (`frontend/src/pages/AdminBookings.jsx`)
  - Display all bookings
  - Admin actions (confirm/cancel)
  - Booking management interface

### Utilities
- **Razorpay Loader** (`frontend/src/utils/razorpay.js`)
  - Dynamic Razorpay SDK loading

## Environment Variables Required

### Backend (.env)
```
MONGODB_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

### Frontend (.env)
```
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

## Setup Instructions

### 1. Backend Setup
1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```

2. Create `.env` file with required variables (see above)

3. Start the server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup
1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Create `.env` file with `VITE_RAZORPAY_KEY_ID`

3. Start the development server:
   ```bash
   npm run dev
   ```

### 3. Razorpay Setup
1. Create a Razorpay account at https://razorpay.com
2. Get your Key ID and Key Secret from the dashboard
3. Add them to your `.env` files
4. For testing, use Razorpay test mode credentials

## Testing Payment Flow

### Test Cards (Razorpay Test Mode)
- **Success**: 4111 1111 1111 1111
- **Failure**: 4000 0000 0000 0002
- **CVV**: Any 3 digits
- **Expiry**: Any future date

## Workflow

1. **User Books Tour**
   - User clicks "Book Your Adventure Now" on tour detail page
   - Booking modal opens with form
   - User fills guest details and number of guests
   - System creates Razorpay order
   - User completes payment via Razorpay gateway
   - Payment verified on backend
   - Booking created with "pending" status
   - Email sent to user

2. **Admin Reviews Booking**
   - Admin navigates to "Manage Bookings"
   - Views all pending bookings
   - Can confirm or cancel bookings

3. **Admin Confirms Booking**
   - Admin clicks "Confirm Booking"
   - Booking status changes to "confirmed"
   - Email sent to user with confirmation

4. **Admin Cancels Booking**
   - Admin clicks "Cancel Booking"
   - Booking status changes to "cancelled"
   - Payment status changes to "refunded"
   - Tour slots are restored
   - Email sent to user with cancellation and refund info

## Security Features

- ✅ JWT authentication for all booking endpoints
- ✅ Admin-only access for booking management
- ✅ Payment signature verification
- ✅ User can only view their own bookings
- ✅ Input validation on both frontend and backend
- ✅ Slot availability checking before booking

## Email Templates

All emails include:
- Professional greeting
- Booking details (tour, location, guests, amount)
- Booking status
- Booking ID
- Appropriate messaging based on status

## Notes

- Razorpay integration uses test mode credentials for development
- Email functionality requires Gmail App Password (not regular password)
- All bookings require payment before creation
- Slots are automatically managed (decrease on booking, increase on cancellation)
- Users receive immediate email notifications on status changes


