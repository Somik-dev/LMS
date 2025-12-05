import Stripe from 'stripe';
import mongoose from 'mongoose';
import { Course } from '../Models/course.model.js';
import { CoursePurchase } from '../Models/coursePurchase.model.js';
import {User} from "../Models/user.models.js";
import { Lecture } from '../Models/lecture.model.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create a Stripe Checkout Session
export const createCheckoutSession = async (req, res) => {
  try {
    const userId = req.user.id;
    const { courseId } = req.body;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Create a pending purchase record
    const newPurchase = new CoursePurchase({
      courseId,
      userId,
      amount: course.coursePrice,
      status: 'pending',
    });

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: course.courseTitle,
              images: [course.thumbnailUrl],
            },
            unit_amount: course.coursePrice * 100, // in paise
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `http://localhost:5173/course-progress/${courseId}`,
      cancel_url: `http://localhost:5173/course-details/${courseId}`,
      metadata: {
        courseId,
        userId,
      },
    });

    // Save payment session ID in the purchase record
    newPurchase.paymentId = session.id;
    await newPurchase.save();

    return res.status(200).json({
      success: true,
      url: session.url,
    });
  } catch (error) {
    console.error('🚨 Stripe Checkout Error:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// Stripe Webhook Handler
export const stripeWebhook = async (req, res) => {
  let event;
  const secret = process.env.WEBHOOK_ENDPOINT_SECRET;

  try {
    // Stripe requires raw body to verify signature
    const payload = req.rawBody || JSON.stringify(req.body, null, 2);
    const sig = req.headers['stripe-signature'];

    // Use real signature header in production
    event = stripe.webhooks.constructEvent(payload, sig, secret);
  } catch (error) {
    console.error('❌ Webhook signature verification failed:', error.message);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  // Handle event
  if (event.type === 'checkout.session.completed') {
    console.log('✅ checkout.session.completed received');

    try {
      const session = event.data.object;

      const purchase = await CoursePurchase.findOne({
        paymentId: session.id,
      }).populate('courseId');

      if (!purchase) {
        return res.status(404).json({ message: 'Purchase not found' });
      }

      purchase.status = 'completed';
      if (session.amount_total) {
        purchase.amount = session.amount_total / 100;
      }
      await purchase.save();

      // Make all lectures accessible
      if (purchase.courseId?.lectures?.length > 0) {
        await Lecture.updateMany(
          { _id: { $in: purchase.courseId.lectures } },
          { $set: { isPreviewFree: true } }
        );
      }

      // Add course to user's enrolled list
      await User.findByIdAndUpdate(
        purchase.userId,
        { $addToSet: { enrolledCourses: purchase.courseId._id } },
        { new: true }
      );

      // Add user to course's student list
      await Course.findByIdAndUpdate(
        purchase.courseId._id,
        { $addToSet: { enrolledStudents: purchase.userId } },
        { new: true }
      );

      console.log('🎓 User enrolled and course updated');
    } catch (error) {
      console.error('❌ Error processing event:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  res.status(200).send({ received: true });
};

export const getCourseDetailsWithPurchaseStatus = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    // 🔍 Validate courseId format
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: 'Invalid course ID' });
    }

    const objectCourseId = new mongoose.Types.ObjectId(courseId);

    // 📘 Fetch course details with full population
    const course = await Course.findById(objectCourseId)
      .populate({
        path: 'creator',
        select: '-password -__v' // sensitive fields omitted
      })
      .populate({
        path: 'lectures',
        options: { sort: { order: 1 } } // optional: sort lectures
      })
      .lean();

    // ❌ Course not found
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // ✅ Check if user purchased the course
    const purchase = await CoursePurchase.findOne({
      userId,
      courseId: objectCourseId
    }).lean();

    // 📤 Send course + purchase status
    return res.status(200).json({
      course,
      purchased: !!purchase
    });

  } catch (error) {
    console.error('❗ Error fetching course details:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getAllPurchaseCourse = async (req, res) => {
  try {
    const purchasedCourses = await CoursePurchase.find({ status: "completed" })
      .populate({
        path: "courseId",
        populate: {
          path: "creator",
          select: "name email", 
        }
      })
      .populate({
        path: "userId",
        select: "name email", 
      })
      .lean();

    return res.status(200).json({
      purchasedCourses: purchasedCourses || [],
    });
  } catch (error) {
    console.error('Error fetching purchased courses:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

