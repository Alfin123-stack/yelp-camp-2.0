import { describe, it, expect } from "vitest";
import {
  campgroundSchema,
  reviewSchema,
  registerSchema,
  loginSchema,
} from "@/lib/validations/schemas";

describe("campgroundSchema", () => {
  const valid = {
    title: "Riverside Camp",
    price: "25.50",
    location: "Boulder, CO",
    description: "A nice quiet spot by the river.",
  };

  it("accepts valid input and coerces price to a number", () => {
    const result = campgroundSchema.safeParse(valid);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.price).toBe(25.5);
    }
  });

  it("rejects HTML in the title (anti-XSS)", () => {
    const result = campgroundSchema.safeParse({ ...valid, title: "<script>alert(1)</script>" });
    expect(result.success).toBe(false);
  });

  it("rejects HTML in the description", () => {
    const result = campgroundSchema.safeParse({
      ...valid,
      description: "<img src=x onerror=alert(1)>",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a negative price", () => {
    const result = campgroundSchema.safeParse({ ...valid, price: "-5" });
    expect(result.success).toBe(false);
  });

  it("rejects an empty title", () => {
    const result = campgroundSchema.safeParse({ ...valid, title: "" });
    expect(result.success).toBe(false);
  });

  it("rejects a title over the length cap", () => {
    const result = campgroundSchema.safeParse({ ...valid, title: "a".repeat(101) });
    expect(result.success).toBe(false);
  });

  it("rejects a description over the length cap", () => {
    const result = campgroundSchema.safeParse({ ...valid, description: "a".repeat(5001) });
    expect(result.success).toBe(false);
  });
});

describe("reviewSchema", () => {
  it("accepts a valid review", () => {
    const result = reviewSchema.safeParse({ rating: "4", body: "Great campsite!" });
    expect(result.success).toBe(true);
  });

  it("rejects a rating outside 1-5", () => {
    expect(reviewSchema.safeParse({ rating: "0", body: "x" }).success).toBe(false);
    expect(reviewSchema.safeParse({ rating: "6", body: "x" }).success).toBe(false);
  });

  it("rejects HTML in the review body", () => {
    const result = reviewSchema.safeParse({ rating: "5", body: "<b>nice</b>" });
    expect(result.success).toBe(false);
  });

  it("rejects a review body over the length cap", () => {
    const result = reviewSchema.safeParse({ rating: "5", body: "a".repeat(1001) });
    expect(result.success).toBe(false);
  });
});

describe("registerSchema", () => {
  const valid = { email: "a@example.com", username: "camper_1", password: "hunter22" };

  it("accepts valid input", () => {
    expect(registerSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects an invalid email", () => {
    expect(registerSchema.safeParse({ ...valid, email: "not-an-email" }).success).toBe(false);
  });

  it("rejects a too-short username or password", () => {
    expect(registerSchema.safeParse({ ...valid, username: "ab" }).success).toBe(false);
    expect(registerSchema.safeParse({ ...valid, password: "short" }).success).toBe(false);
  });

  it("rejects a username with special characters", () => {
    expect(registerSchema.safeParse({ ...valid, username: "no spaces!" }).success).toBe(false);
  });

  it("rejects a password over bcrypt's 72-byte limit", () => {
    expect(registerSchema.safeParse({ ...valid, password: "a".repeat(73) }).success).toBe(false);
  });
});

describe("loginSchema", () => {
  it("accepts valid input", () => {
    expect(loginSchema.safeParse({ username: "camper_1", password: "hunter22" }).success).toBe(
      true
    );
  });

  it("rejects empty fields", () => {
    expect(loginSchema.safeParse({ username: "", password: "" }).success).toBe(false);
  });
});
