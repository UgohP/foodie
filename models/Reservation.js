const mongoose = require("mongoose");
const ReservationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  persons: {
    type: String,
    required: true,
    min: 1,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const Reservation = mongoose.model("Reservation", ReservationSchema);
module.exports = Reservation;
