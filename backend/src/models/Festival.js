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
      unique: true,
      sparse: true
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
      required: false,
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
      venueName: { type: String, required: false },
      address: { type: String },
      city: { type: String, required: false },
      country: { type: String, required: false }
    },
    bannerImage: { type: String, required: false },
    galleryImages: [String],
    isFree: { type: Boolean, default: true },
    festivalPassPrice: { type: Number, default: 0 },
    tags: [String]
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual Populate
festivalSchema.virtual("events", {
  ref: "Event",
  localField: "_id",
  foreignField: "festival_id"
});

// Auto-generate slug from name if not provided
festivalSchema.pre("save", function (next) {
  if (this.name && (!this.slug || this.isModified("name"))) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") + "-" + Date.now();
  }
  next();
});

module.exports = mongoose.model("Festival", festivalSchema);