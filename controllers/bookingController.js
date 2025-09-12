// controllers/bookingController.js
const Booking = require('../models/Booking');

// GET all bookings
const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate('user').populate('learning');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

// GET single booking
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('user').populate('learning');
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
};

// POST new booking
const createBooking = async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.status(201).json(booking);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create booking' });
  }
};

module.exports = { getBookings, getBookingById, createBooking };
