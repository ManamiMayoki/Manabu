const mongoose = require("mongoose");

const festivalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Festival name is required"],
      trim: true
    },
    slug: {
      type: String,
      lowercase: true,
      unique: true
    },
    type: {
      type: String,
      required: true,
      enum: ["Cultural", "Religious", "National", "Music", "Food", "Tech", "Other"]
    },
    tagline: { type: String, maxLength: 150 },
    description: { type: String, required: true },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organizer",
      required: false, // CHANGED: Set to false so you don't need a valid Organizer ID while testing
      index: true
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["Draft", "Upcoming", "Ongoing", "Completed", "Cancelled"],
      default: "Upcoming"
    },
    location: {
      venueName: { type: String, required: false }, // CHANGED: Optional for flexible testing
      address: { type: String },
      city: { type: String, required: false },      // CHANGED: Optional for flexible testing
      country: { type: String, required: false }   // CHANGED: Optional for flexible testing
    },
    bannerImage: { type: String, required: false }, // CHANGED: Set to false so you can skip image URLs during initial API test
    galleryImages: [String],
    isFree: { type: Boolean, default: true },
    festivalPassPrice: { type: Number, default: 0 },
    tags: [String]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Festival", festivalSchema);