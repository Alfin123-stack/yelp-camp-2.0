import mongoose, { Schema, models, model } from "mongoose";
import Review from "./review";

export interface ICampgroundImage {
  url: string;
  filename: string;
}

export interface ICampground {
  _id: string;
  title: string;
  images: ICampgroundImage[];
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
  price: number;
  description: string;
  location: string;
  author: mongoose.Types.ObjectId;
  reviews: mongoose.Types.ObjectId[];
}

const ImageSchema = new Schema<ICampgroundImage>({
  url: String,
  filename: String,
});

// Same virtual helper as the original Express app: a Cloudinary
// transformation url for a smaller thumbnail.
ImageSchema.virtual("thumbnail").get(function (this: ICampgroundImage) {
  return this.url?.replace("/upload", "/upload/w_200");
});

const opts = { toJSON: { virtuals: true }, toObject: { virtuals: true } };

const CampgroundSchema = new Schema<ICampground>(
  {
    title: { type: String, required: true },
    images: [ImageSchema],
    geometry: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  opts
);

// Cascade delete: when a campground is deleted, remove its reviews too.
CampgroundSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: { $in: doc.reviews },
    });
  }
});

const Campground = models.Campground || model<ICampground>("Campground", CampgroundSchema);

export default Campground;
export type CampgroundDocument = mongoose.HydratedDocument<ICampground>;
