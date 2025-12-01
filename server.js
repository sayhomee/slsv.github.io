require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const formData = require('form-data');
const Mailgun = require('mailgun.js');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Mailgun
const mailgun = new Mailgun(formData);
const mg = mailgun.client({
    username: 'api',
    key: process.env.MAILGUN_API_KEY || ''
});

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// Serve HTML files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/form.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'form.html'));
});

// Generate friendly order number
function generateOrderNumber() {
    const timestamp = Date.now().toString().slice(-8); // Last 8 digits of timestamp
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `SLSV-${timestamp}-${random}`;
}

// Stripe Checkout Session - Create
app.post('/create-checkout-session', async (req, res) => {
    try {
        const { priceId, ticketType } = req.body;
        
        // Generate friendly order number
        const orderNumber = generateOrderNumber();
        
        // Create Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId, // Stripe Price ID from your dashboard
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${req.headers.origin}/success.html?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.origin}/cancel.html`,
            metadata: {
                ticket_type: ticketType,
                order_number: orderNumber // Store friendly order number
            }
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).json({ error: error.message });
    }
});

// Webhook endpoint for Stripe events
app.post('/webhook', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;
            const orderNumber = session.metadata?.order_number || 'N/A';
            const ticketType = session.metadata?.ticket_type || 'Unknown';
            const amount = (session.amount_total / 100).toFixed(2);
            
            console.log('\n✅ Payment Successful!');
            console.log(`   Order Number: ${orderNumber}`);
            console.log(`   Ticket Type: ${ticketType}`);
            console.log(`   Amount: $${amount}`);
            console.log(`   Customer: ${session.customer_details?.email || 'N/A'}`);
            console.log(`   Transaction ID: ${session.id}\n`);
            
            // TODO: Add your business logic here
            // - Send confirmation email
            // - Create database entry
            // - Generate ticket
            // - Update inventory
            
            break;
        case 'payment_intent.payment_failed':
            console.log('❌ Payment failed:', event.data.object);
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
});

// Get session details (for success page)
app.get('/checkout-session', async (req, res) => {
    const { sessionId } = req.query;
    
    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        res.json(session);
    } catch (error) {
        console.error('Error retrieving session:', error);
        res.status(500).json({ error: error.message });
    }
});

// Contact Form Submission
app.post('/submit-form', async (req, res) => {
    try {
        const { fullName, email, organization, interest, message } = req.body;
        
        // Validate required fields
        if (!fullName || !email || !interest) {
            return res.status(400).json({ 
                success: false, 
                error: 'Please fill in all required fields' 
            });
        }

        // Email content
        const emailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #00f3ff; border-bottom: 2px solid #bc13fe; padding-bottom: 10px;">
                    🎟️ New SLSV 2026 Inquiry
                </h2>
                
                <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <p style="margin: 10px 0;"><strong>Name:</strong> ${fullName}</p>
                    <p style="margin: 10px 0;"><strong>Email:</strong> ${email}</p>
                    <p style="margin: 10px 0;"><strong>Organization:</strong> ${organization || 'Not provided'}</p>
                    <p style="margin: 10px 0;"><strong>Interested In:</strong> ${interest}</p>
                </div>
                
                ${message ? `
                <div style="margin: 20px 0;">
                    <h3 style="color: #333;">Message:</h3>
                    <p style="background: #fff; padding: 15px; border-left: 4px solid #00f3ff; border-radius: 4px;">
                        ${message.replace(/\n/g, '<br>')}
                    </p>
                </div>
                ` : ''}
                
                <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                
                <p style="color: #666; font-size: 12px;">
                    Submitted on: ${new Date().toLocaleString()}<br>
                    From: SLSV 2026 Contact Form
                </p>
            </div>
        `;

        // Send email via Mailgun
        const messageData = {
            from: `SLSV 2026 Website <noreply@${process.env.MAILGUN_DOMAIN}>`,
            to: process.env.ADMIN_EMAIL || 'zeeshan@sayhomee.com',
            subject: `🎟️ New Inquiry: ${interest} - ${fullName}`,
            html: emailHtml,
            text: `
New SLSV 2026 Inquiry

Name: ${fullName}
Email: ${email}
Organization: ${organization || 'Not provided'}
Interested In: ${interest}

Message:
${message || 'No message provided'}

Submitted: ${new Date().toLocaleString()}
            `
        };

        // Send the email
        await mg.messages.create(process.env.MAILGUN_DOMAIN, messageData);

        console.log('\n📧 Form submission received and email sent!');
        console.log(`   From: ${fullName} (${email})`);
        console.log(`   Interest: ${interest}\n`);

        res.json({ 
            success: true, 
            message: 'Your inquiry has been submitted successfully!' 
        });

    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to send your inquiry. Please try again.' 
        });
    }
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
    console.log(`📝 Form available at http://localhost:${PORT}/form.html`);
    console.log(`\n⚡ Stripe integration active`);
    console.log(`💳 Ready to accept payments!\n`);
});

