# 🎉 SLSV 2026 - Smart Living Silicon Valley

Official website for the Smart Living Silicon Valley 2026 event with integrated Stripe payment processing.

![Event Date](https://img.shields.io/badge/Event%20Date-Jan%2010%2C%202026-blue)
![Stripe](https://img.shields.io/badge/Payments-Stripe-blueviolet)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)

---

## ✨ Features

- 🎨 Modern, responsive design with particle animations
- 💳 Integrated Stripe payment processing
- 🎫 Multiple ticket types support
- 📧 Contact form for sponsorship inquiries
- 🌐 Bilingual support (English/Chinese)
- ✅ Payment success/cancel pages
- 🔔 Webhook support for payment confirmations
- 📱 Mobile-friendly responsive layout

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
```bash
# Copy the template
cp ENV_TEMPLATE.txt .env

# Edit .env with your Stripe keys
```

### 3. Configure Stripe Price IDs
Update the Price IDs in `index.html` (around line 795):
```javascript
const STRIPE_PRICES = {
    general: 'price_YOUR_GENERAL_PRICE_ID',
    vip: 'price_YOUR_VIP_PRICE_ID',
    earlybird: 'price_YOUR_EARLYBIRD_PRICE_ID'
};
```

### 4. Start the Server
```bash
npm start
# or for development with auto-reload:
npm run dev
```

### 5. Open in Browser
Navigate to: **http://localhost:3000**

---

## 📖 Detailed Setup Guide

For complete setup instructions, including:
- How to get Stripe API keys
- Creating products in Stripe Dashboard
- Setting up webhooks
- Testing payments
- Deployment instructions

**👉 See [SETUP.md](./SETUP.md) for the full guide**

---

## 📁 Project Structure

```
slsv.github.io/
├── 📄 index.html          # Main event website
├── 📄 form.html           # Contact/inquiry form
├── 📄 success.html        # Payment success page
├── 📄 cancel.html         # Payment cancelled page
├── ⚙️  server.js           # Node.js/Express server
├── 📦 package.json        # Dependencies
├── 🔐 .env                # Environment variables (create this!)
├── 📋 ENV_TEMPLATE.txt    # Template for .env file
├── 📚 SETUP.md            # Detailed setup guide
├── 📖 README.md           # This file
└── 🚫 .gitignore          # Git ignore rules
```

---

## 🔧 Configuration

### Environment Variables

Create a `.env` file with:

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_GENERAL_ADMISSION=price_...
STRIPE_PRICE_VIP_TICKET=price_...
STRIPE_PRICE_EARLY_BIRD=price_...
PORT=3000
NODE_ENV=development
```

### Stripe Price IDs

Update in `index.html`:
```javascript
const STRIPE_PRICES = {
    general: 'price_...',
    vip: 'price_...',
    earlybird: 'price_...'
};
```

---

## 🧪 Testing

### Test Card Numbers

Use these test cards from Stripe:

| Card Number | Result |
|-------------|--------|
| `4242 4242 4242 4242` | ✅ Success |
| `4000 0000 0000 9995` | ❌ Declined |
| `4000 0025 0000 3155` | 🔐 Requires Authentication |

**Other Details:**
- Expiry: Any future date (12/34)
- CVC: Any 3 digits (123)
- ZIP: Any 5 digits (12345)

---

## 🌐 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Main website |
| `/form.html` | GET | Contact form |
| `/success.html` | GET | Payment success page |
| `/cancel.html` | GET | Payment cancelled page |
| `/create-checkout-session` | POST | Create Stripe checkout |
| `/checkout-session` | GET | Get session details |
| `/webhook` | POST | Stripe webhook handler |
| `/health` | GET | Health check |

---

## 🎫 Ticket Types

Configure your ticket types in the Stripe Dashboard:

1. **General Admission** - Basic event access
2. **VIP Ticket** - VIP access + Gala Dinner
3. **Early Bird** - Discounted early registration

Each ticket type needs a corresponding Price ID in Stripe.

---

## 🔔 Webhooks

Webhooks are used to handle payment confirmations.

### Local Development
```bash
# Install Stripe CLI
stripe listen --forward-to localhost:3000/webhook
```

### Production
1. Add webhook endpoint in Stripe Dashboard
2. URL: `https://yourdomain.com/webhook`
3. Events: `checkout.session.completed`, `payment_intent.payment_failed`
4. Copy webhook secret to `.env`

---

## 🚀 Deployment

### Prerequisites
- ✅ All test payments working
- ✅ Switched to live Stripe keys
- ✅ Updated Price IDs to live versions
- ✅ Production webhook configured

### Deployment Platforms

**Option 1: Heroku**
```bash
heroku create
git push heroku main
heroku config:set STRIPE_SECRET_KEY=sk_live_...
```

**Option 2: Vercel/Railway/Render**
- Connect your Git repository
- Set environment variables in dashboard
- Deploy

**Option 3: VPS (DigitalOcean, AWS, etc.)**
- Upload files via FTP/Git
- Install Node.js
- Set up PM2 for process management
- Configure Nginx as reverse proxy

---

## 🔐 Security

- ✅ `.env` file is gitignored
- ✅ Never expose secret keys in frontend
- ✅ Webhook signature verification enabled
- ✅ Use HTTPS in production
- ✅ Separate test/live API keys

---

## 📧 Support

- **Stripe Docs:** https://stripe.com/docs
- **Stripe Support:** https://support.stripe.com
- **Node.js Docs:** https://nodejs.org/docs

---

## 📝 License

MIT License - Feel free to use this for your own events!

---

## 🤝 Contributing

Contributions welcome! Feel free to submit issues or pull requests.

---

## 📞 Contact

For event inquiries, use the contact form at `/form.html`

---

**Built with ❤️ for SLSV 2026**

