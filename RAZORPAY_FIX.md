# Razorpay International Card Fix

## Problem
Your Razorpay account has international cards disabled, causing payment failures.

## Solutions

### Option 1: Enable International Cards in Razorpay Dashboard
1. Login to https://dashboard.razorpay.com
2. Go to Settings → Configuration → Payment Methods
3. Under "Cards" section, enable "International Cards"
4. Save settings

### Option 2: Use Indian Test Cards Only
Use these specific Indian test cards:

**Mastercard (Recommended):**
- Card: 5555 5555 5555 4444
- CVV: 123
- Expiry: 12/25

**Visa India:**
- Card: 4000 0035 6000 0008
- CVV: 123
- Expiry: 12/25

**RuPay:**
- Card: 6521 1500 0000 0008
- CVV: 123
- Expiry: 12/25

### Option 3: Use UPI (Most Reliable for Testing)
- Success UPI ID: success@razorpay
- Failure UPI ID: failure@razorpay

### Option 4: Use Net Banking
- Select any Indian bank
- Use test credentials provided by Razorpay

## Current Implementation
The code has been updated to:
1. Show multiple test card options
2. Recommend UPI for testing
3. Better error handling
4. Clear instructions for users

## Test Steps
1. Select "Pay with Card (Test)" option
2. Try UPI payment first (most reliable)
3. If UPI doesn't work, try Mastercard: 5555 5555 5555 4444
4. If cards fail, use Net Banking option