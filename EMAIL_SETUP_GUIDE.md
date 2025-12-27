# Email Setup Guide for Travelify

## Current Status
✅ **Development Mode**: Emails are logged to console (working)  
❌ **Production Mode**: Gmail authentication needs to be fixed

## Quick Fix for Demo
The system currently works in **development mode** where emails are logged to the backend console. This is perfect for demonstrating the functionality to HR without needing real email setup.

## To See Rejection Emails During Demo:
1. **Start backend server**: `npm run dev` in backend folder
2. **Reject a booking** from admin panel
3. **Check backend console** - you'll see the complete email content
4. **User sees rejection reason** in their "My Bookings" page

## For Production Email Setup:

### Option 1: Fix Gmail App Password (Recommended)
1. **Go to Google Account Settings**: https://myaccount.google.com/
2. **Enable 2-Factor Authentication** (required for app passwords)
3. **Generate App Password**:
   - Go to Security → 2-Step Verification → App passwords
   - Select "Mail" and "Other (Custom name)"
   - Enter "Travelify" as the name
   - Copy the 16-character password
4. **Update .env file**:
   ```
   EMAIL_PASS=your_new_16_character_app_password
   ```

### Option 2: Use Alternative Email Service
Replace Gmail with a more developer-friendly service:

#### Ethereal Email (Free Testing)
```javascript
// In sendEmail.js
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'ethereal_username',
        pass: 'ethereal_password'
    }
});
```

#### SendGrid (Production Ready)
```javascript
// Install: npm install @sendgrid/mail
import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
```

### Option 3: Use Mailtrap (Development)
Perfect for testing without sending real emails:
```javascript
const transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "your_mailtrap_user",
        pass: "your_mailtrap_pass"
    }
});
```

## Current Development Mode Features:
✅ All email content is logged to console  
✅ Rejection reasons are stored in database  
✅ Users see rejection reasons in frontend  
✅ No email failures block the booking process  
✅ Perfect for demos and development  

## For HR Demo:
1. **Show the booking flow** (works perfectly)
2. **Show admin rejection** with custom reasons
3. **Show user sees rejection reason** in their bookings
4. **Mention**: "In production, users would also receive email notifications"
5. **Show console logs** if they want to see email content

This demonstrates the complete functionality without needing complex email setup!