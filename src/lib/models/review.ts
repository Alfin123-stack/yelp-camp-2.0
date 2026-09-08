import mongoose, { Schema, models, model } from "mongoose";

export interface IReview {
  _id: string;
  body: string;
  rating: number;
  owner: mongoose.Types.ObjectId;
}

const ReviewSchema = new Schema<IReview>({
  body: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const Review = models.Review || model<IReview>("Review", ReviewSchema);

export default Review;
export type ReviewDocument = mongoose.HydratedDocument<IReview>;
