# SLSV 2026 - Stripe Payment Integration Setup Guide

This guide will walk you through setting up Stripe payments for the SLSV 2026 event website.

---

## 📋 Prerequisites

- Node.js installed (v14 or higher)
- A Stripe account ([Sign up here](https://dashboard.stripe.com/register))
- Basic knowledge of terminal/command line

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Create Environment File

Create a file named `.env` in the root directory with the following content:

```env
# Stripe API Keys (Get these from https://dashboard.stripe.com/apikeys)
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here

# Stripe Webhook Secret (Get this after creating webhook endpoint)
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Stripe Price IDs (Create products in Stripe Dashboard)
STRIPE_PRICE_GENERAL_ADMISSION=price_xxxxxxxxxxxxx
STRIPE_PRICE_VIP_TICKET=price_xxxxxxxxxxxxx
STRIPE_PRICE_EARLY_BIRD=price_xxxxxxxxxxxxx

# Server Configuration
PORT=3000
NODE_ENV=development
```

### 3. Get Your Stripe API Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Click **Developers** → **API keys**
3. Copy your **Publishable key** (starts with `pk_test_`)
4. Click **Reveal test key** to see your **Secret key** (starts with `sk_test_`)
5. Add both to your `.env` file

---

## 💳 Setting Up Products in Stripe

### Step 1: Create Products

1. Go to [Stripe Dashboard](https://dashboard.stripe.com) → **Products**
2. Click **+ Add product**
3. Create your ticket products:

**Example: General Admission Ticket**
- **Name:** SLSV 2026 - General Admission
- **Description:** Access to Smart Living Silicon Valley 2026 expo and summit
- **Pricing model:** Standard pricing
- **Price:** $50.00 (or your price)
- **Billing period:** One time
- Click **Save product**

**Example: VIP Ticket**
- **Name:** SLSV 2026 - VIP Access + Gala Dinner
- **Description:** VIP access with gala dinner and networking reception
- **Price:** $200.00 (or your price)
- Click **Save product**

### Step 2: Get Price IDs

1. After creating a product, click on it
2. In the **Pricing** section, you'll see the Price ID (starts with `price_`)
3. Copy each Price ID and add to your `.env` file
4. **IMPORTANT:** Also update the Price IDs in `index.html`:

```javascript
// In index.html, find this section and update:
const STRIPE_PRICES = {
    general: 'price_1234567890',  // ← Replace with your actual General Admission Price ID
    vip: 'price_0987654321',      // ← Replace with your VIP Price ID
    earlybird: 'price_abcdefgh'   // ← Replace with your Early Bird Price ID
};
```

---

## 🔔 Setting Up Webhooks (Important!)

Webhooks notify your server when payments are completed.

### For Local Development (using Stripe CLI)

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Login to Stripe CLI:
   ```bash
   stripe login
   ```
3. Forward webhooks to your local server:
   ```bash
   stripe listen --forward-to localhost:3000/webhook
   ```
4. Copy the webhook secret (starts with `whsec_`) and add to `.env`

### For Production (Deployed Website)

1. Go to [Stripe Dashboard](https://dashboard.stripe.com) → **Developers** → **Webhooks**
2. Click **+ Add endpoint**
3. Enter your endpoint URL: `https://yourdomain.com/webhook`
4. Select events to listen to:
   - `checkout.session.completed`
   - `payment_intent.payment_failed`
5. Click **Add endpoint**
6. Copy the **Signing secret** (starts with `whsec_`) and add to your production `.env`

---

## 🏃 Running the Server

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start at: **http://localhost:3000**

---

## 🧪 Testing Payments

Stripe provides test card numbers for testing:

| Card Number | Description |
|-------------|-------------|
| `4242 4242 4242 4242` | Successful payment |
| `4000 0000 0000 9995` | Declined payment |
| `4000 0025 0000 3155` | Requires authentication (3D Secure) |

**Test Card Details:**
- **Expiry:** Any future date (e.g., 12/34)
- **CVC:** Any 3 digits (e.g., 123)
- **ZIP:** Any 5 digits (e.g., 12345)

---

## 📁 File Structure

```
slsv.github.io/
├── server.js              # Node.js/Express server
├── package.json           # Dependencies
├── .env                   # Environment variables (create this)
├── .gitignore            # Ignores .env and node_modules
├── index.html            # Main website
├── form.html             # Contact form
├── success.html          # Payment success page
├── cancel.html           # Payment cancelled page
└── SETUP.md              # This file
```

---

## 🔧 Customization

### Change Ticket Prices
Update prices in Stripe Dashboard → Products

### Add More Ticket Types
1. Create new product in Stripe Dashboard
2. Get Price ID
3. Add to `STRIPE_PRICES` object in `index.html`
4. Add new button with: `onclick="openStripeCheckout('your_type')"`

### Customize Success Page
Edit `success.html` to match your branding

### Email Notifications
After payment, you can send confirmation emails by adding email logic in the webhook handler (`server.js`, line 49)

---

## 🌐 Deployment

### Deploy to Production

1. **Switch to Live Mode:**
   - Get live API keys from Stripe Dashboard (starts with `pk_live_` and `sk_live_`)
   - Update `.env` with live keys
   - Create live products and get live Price IDs

2. **Update Price IDs in index.html:**
   - Replace test Price IDs with live ones

3. **Deploy to your hosting:**
   - Heroku, Vercel, Railway, DigitalOcean, AWS, etc.
   - Make sure to set environment variables in your hosting platform

4. **Set up production webhook:**
   - Add webhook endpoint with your production URL
   - Update `STRIPE_WEBHOOK_SECRET` in production environment

---

## 🆘 Troubleshooting

### "No such price" error
- Make sure Price IDs in `index.html` match those in Stripe Dashboard
- Ensure you're using test keys with test prices (or live with live)

### Webhook signature verification failed
- Check that `STRIPE_WEBHOOK_SECRET` is correct
- For local dev, ensure Stripe CLI is running: `stripe listen --forward-to localhost:3000/webhook`

### Server won't start
- Check that `.env` file exists and has correct format
- Ensure all dependencies are installed: `npm install`
- Check that port 3000 is not already in use

### Payment succeeds but no confirmation
- Check server console for webhook events
- Verify webhook is properly configured
- Check `server.js` webhook handler (line 41-63)

---

## 📞 Support

- **Stripe Documentation:** https://stripe.com/docs
- **Stripe Support:** https://support.stripe.com
- **Node.js Documentation:** https://nodejs.org/docs

---

## ✅ Launch Checklist

Before going live:

- [ ] Test Mode: All payments work correctly
- [ ] Success page displays order details
- [ ] Cancel page works
- [ ] Webhooks receiving events (check Stripe Dashboard → Webhooks)
- [ ] Switched to Live API keys
- [ ] Updated Price IDs to live versions
- [ ] Production webhook endpoint configured
- [ ] Email confirmations working (if implemented)
- [ ] Tested with real test cards
- [ ] Verified on mobile devices
- [ ] SSL certificate installed (HTTPS)
- [ ] Environment variables set on production server

---

## 🔐 Security Notes

⚠️ **NEVER commit your `.env` file to Git!**
- The `.gitignore` file already excludes it
- Always use environment variables for sensitive data
- Use separate keys for development and production
- Regularly rotate your API keys

---

**Need Help?** Contact support or check the Stripe documentation for more detailed guides.

Happy coding! 🚀

