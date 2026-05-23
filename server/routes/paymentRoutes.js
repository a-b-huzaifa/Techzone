import express from 'express';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Stripe checkout — simplified (no Stripe key required to run)
router.post('/checkout', protect, async (req, res) => {
  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey || stripeKey.includes('your_key')) {
      return res.json({ success: true, clientSecret: 'mock_secret', message: 'Stripe not configured — using COD mode' });
    }
    const Stripe = (await import('stripe')).default;
    const stripe = Stripe(stripeKey);
    const { amount, currency = 'usd' } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency,
      metadata: { userId: req.user._id.toString() },
    });
    res.json({ success: true, clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
