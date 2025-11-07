# Travel Agency

A **full-featured MERN-based backend** for a travel agency application, designed with scalability, security, and real-world functionality in mind. This backend powers user authentication, tour management, bookings, payments, AI-assisted chat, and admin controls — making it a professional-grade solution for 2025-ready travel platforms.  

---

## Features

### **User & Authentication**
- **JWT-based authentication** for secure login and registration.
- Role-based access control:
  - **Admin:** Full control over tours and bookings.
  - **User:** Can browse tours, book trips, and interact with AI chat assistant.

### **Tour Management**
- **CRUD operations for tours**: Admins can create, update, and delete travel destinations.
- **Cloudinary integration** for image uploads.
- Users can:
  - Browse available tours.
  - Check tour availability and slots.

### **Booking & Payment**
- **Secure Razorpay integration** for handling online payments.
- Once payment is confirmed:
  - Booking is stored in MongoDB.
  - Admin can approve or cancel bookings.
  - **Automated email notifications** via Nodemailer inform users of booking status.

### **Real-Time AI Chat Assistant**
- Logged-in users can chat with an AI assistant about tours or bookings.
- **All chat data stored in MongoDB** for future reference.
- Provides instant responses to queries, enhancing user experience.

### **Admin Controls**
- Approve or cancel user bookings.
- Manage tours and monitor bookings in real-time.
- View chat histories and manage user interactions.

### **Database & Storage**
- **MongoDB** as the primary database for tours, bookings, and chat data.
- Cloud storage for images using **Cloudinary**.

---

## Tech Stack

- **Backend:** Node.js, Express.js  
- **Database:** MongoDB (Mongoose ORM)  
- **Authentication:** JWT (JSON Web Tokens)  
- **Payments:** Razorpay  
- **Email Notifications:** Nodemailer  
- **Image Uploads:** Cloudinary  
- **Real-Time AI Chat:** MongoDB for chat storage, custom AI integration  
- **Other:** dotenv for environment variables, bcrypt for password hashing

---

## Installation

1. Clone the repository:  
```bash
git clone https://github.com/yourusername/travel-agency
