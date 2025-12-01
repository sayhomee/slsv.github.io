# 📧 Mailgun Setup Guide for SLSV 2026

Complete guide to set up email notifications for your contact form using Mailgun.

---

## 🚀 Quick Setup

### Step 1: Get Your Mailgun API Key

1. Go to [Mailgun Dashboard](https://app.mailgun.com)
2. Log in to your account
3. Click **Sending** → **Domain settings** (in the left sidebar)
4. Click on your domain (or use the sandbox domain for testing)
5. Click **API Keys** tab
6. Copy your **Private API key** (starts with a long string)

### Step 2: Get Your Mailgun Domain

**Option A: Use Sandbox Domain (for testing)**
- In Mailgun Dashboard → **Sending** → **Domains**
- You'll see a sandbox domain like: `sandboxXXXXXXXX.mailgun.org`
- **Note:** Sandbox can only send to authorized recipients (you need to add emails)

**Option B: Use Your Own Domain (for production)**
- Add and verify your own domain in Mailgun
- Follow the DNS setup instructions
- Example: `mg.yourdomain.com` or `yourdomain.com`

### Step 3: Add to Environment Variables

Update your `.env` file:

```env
# MAILGUN CONFIGURATION
MAILGUN_API_KEY=your_private_api_key_here
MAILGUN_DOMAIN=sandboxXXXXXXXX.mailgun.org
ADMIN_EMAIL=zeeshan@sayhomee.com
```

**Example with real values:**
```env
MAILGUN_API_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
MAILGUN_DOMAIN=sandbox1234567890abcdef.mailgun.org
ADMIN_EMAIL=zeeshan@sayhomee.com
```

---

## 🔐 For Sandbox Domain (Testing)

If using sandbox domain, you need to add authorized recipients:

1. Go to [Mailgun Dashboard](https://app.mailgun.com)
2. Click **Sending** → **Domain settings**
3. Select your sandbox domain
4. Click **Authorized Recipients** tab
5. Click **Add Recipient**
6. Enter: `zeeshan@sayhomee.com`
7. Check the verification email and click the link

**Now you can receive test emails!**

---

## 🌐 For Production (Your Own Domain)

### Step 1: Add Your Domain to Mailgun

1. Go to **Sending** → **Domains**
2. Click **Add New Domain**
3. Enter your domain: `mg.yourdomain.com` (recommended subdomain)
4. Click **Add Domain**

### Step 2: Verify Domain with DNS Records

Mailgun will show you DNS records to add. You need to add these to your domain's DNS settings:

**Required DNS Records:**

1. **TXT Record** (for verification)
   ```
   Type: TXT
   Name: mg
   Value: v=spf1 include:mailgun.org ~all
   ```

2. **MX Records** (for receiving)
   ```
   Type: MX
   Name: mg
   Priority: 10
   Value: mxa.mailgun.org
   
   Type: MX
   Name: mg
   Priority: 10
   Value: mxb.mailgun.org
   ```

3. **CNAME Records** (for tracking)
   ```
   Type: CNAME
   Name: email.mg
   Value: mailgun.org
   ```

4. **TXT Record** (DKIM key for authentication)
   ```
   Type: TXT
   Name: k1._domainkey.mg
   Value: [long string provided by Mailgun]
   ```

### Step 3: Verify Setup

1. After adding DNS records, wait 24-48 hours for propagation
2. In Mailgun Dashboard, click **Verify DNS Settings**
3. Once verified, you'll see green checkmarks ✅
4. Now you can send unlimited emails!

---

## ✅ Install Dependencies

If you haven't already:

```bash
npm install
```

This will install:
- `mailgun.js` - Mailgun client library
- `form-data` - Required for Mailgun

---

## 🧪 Test the Form

### Step 1: Start Server

```bash
npm start
```

### Step 2: Open Form

Navigate to: `http://localhost:3000/form.html`

### Step 3: Fill Out Form

- **Full Name:** Test User
- **Email:** test@example.com
- **Organization:** Test Company
- **Interest:** General Inquiry
- **Message:** This is a test message

### Step 4: Submit

Click **Submit Inquiry**

### Step 5: Check Email

Check inbox for: `zeeshan@sayhomee.com`

**You should receive an email with:**
- Subject: `🎟️ New Inquiry: General Inquiry - Test User`
- All form details formatted nicely

### Step 6: Check Server Console

You should see:
```
📧 Form submission received and email sent!
   From: Test User (test@example.com)
   Interest: General Inquiry
```

---

## 🎨 Email Preview

The admin will receive a beautifully formatted email:

```
🎟️ New SLSV 2026 Inquiry
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Name: Test User
Email: test@example.com
Organization: Test Company
Interested In: General Inquiry

Message:
This is a test message

─────────────────────────────
Submitted on: 12/1/2024, 10:30:45 AM
From: SLSV 2026 Contact Form
```

---

## 🔧 Customization

### Change Admin Email

Update `.env`:
```env
ADMIN_EMAIL=newemail@domain.com
```

### Change Email Template

Edit `server.js` around line 140 - customize the HTML template in the `emailHtml` variable.

### Add Multiple Recipients

```javascript
to: ['admin1@domain.com', 'admin2@domain.com'],
```

### Add CC/BCC

```javascript
cc: 'manager@domain.com',
bcc: 'archive@domain.com',
```

### Customize Subject Line

```javascript
subject: `New Contact: ${fullName} - ${interest}`,
```

---

## 🚨 Troubleshooting

### "Forbidden" Error
- Check API key is correct
- Ensure API key has sending permissions
- Verify domain is verified in Mailgun

### "Domain not found" Error
- Check `MAILGUN_DOMAIN` matches exactly in Mailgun dashboard
- Include the full domain (e.g., `sandbox123.mailgun.org`)

### Emails Not Arriving (Sandbox)
- Verify recipient email is authorized in Mailgun
- Check spam folder
- Check Mailgun logs in dashboard

### Emails Not Arriving (Production)
- Verify domain DNS records are set up correctly
- Wait 24-48 hours for DNS propagation
- Check Mailgun logs for delivery status

### "Invalid recipient" Error
- For sandbox: Add recipient as authorized in Mailgun Dashboard
- For production: Ensure domain is fully verified

---

## 📊 Monitor Email Delivery

### View Logs in Mailgun Dashboard

1. Go to **Sending** → **Logs**
2. See all sent emails, delivery status, and errors
3. Filter by date, recipient, or status

### Check Delivery Rates

1. Go to **Analytics**
2. View:
   - Emails sent
   - Emails delivered
   - Bounce rate
   - Complaint rate

---

## 💰 Pricing

**Free Tier:**
- 5,000 emails/month for 3 months
- Then $0.80 per 1,000 emails

**Foundation Plan ($35/month):**
- 50,000 emails/month included
- $0.80 per 1,000 additional emails

For SLSV 2026, the free tier should be more than enough!

---

## 🔐 Security Best Practices

1. ✅ Never commit `.env` file to Git
2. ✅ Use separate API keys for dev/production
3. ✅ Rotate API keys regularly
4. ✅ Enable IP restrictions in Mailgun (optional)
5. ✅ Monitor logs for suspicious activity
6. ✅ Set up SPF, DKIM, and DMARC records

---

## 📞 Need Help?

- **Mailgun Docs:** https://documentation.mailgun.com
- **Mailgun Support:** support@mailgun.com
- **API Reference:** https://documentation.mailgun.com/en/latest/api_reference.html

---

## ✅ Launch Checklist

Before going live:

- [ ] Mailgun account created
- [ ] API key obtained and added to `.env`
- [ ] Domain verified (for production)
- [ ] Test email sent successfully
- [ ] Email arrives in admin inbox
- [ ] Email not in spam folder
- [ ] Form validation working
- [ ] Success/error messages displaying
- [ ] Mobile responsive design tested

---

**Ready to receive inquiries! 📧**

