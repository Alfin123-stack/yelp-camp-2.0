import { describe, it, expect } from "vitest";
import { cn, escapeHtml, isSafeRelativePath } from "@/lib/utils";

describe("cn", () => {
  it("merges class names and resolves Tailwind conflicts", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });

  it("drops falsy values", () => {
    expect(cn("a", false, undefined, null, "b")).toBe("a b");
  });
});

describe("escapeHtml", () => {
  it("escapes the five reserved HTML characters", () => {
    expect(escapeHtml(`<script>"alert('xss')" & more</script>`)).toBe(
      "&lt;script&gt;&quot;alert(&#39;xss&#39;)&quot; &amp; more&lt;/script&gt;"
    );
  });

  it("leaves plain text untouched", () => {
    expect(escapeHtml("Riverside Camp, Boulder CO")).toBe("Riverside Camp, Boulder CO");
  });
});

describe("isSafeRelativePath", () => {
  it("accepts a plain relative path", () => {
    expect(isSafeRelativePath("/campgrounds")).toBe(true);
    expect(isSafeRelativePath("/campgrounds/123/edit")).toBe(true);
  });

  it("accepts a relative path with a query string", () => {
    expect(isSafeRelativePath("/campgrounds?success=hi")).toBe(true);
  });

  it("rejects protocol-relative URLs (open redirect via //host)", () => {
    expect(isSafeRelativePath("//evil.example")).toBe(false);
    expect(isSafeRelativePath("/\\evil.example")).toBe(false);
  });

  it("rejects absolute URLs to another origin", () => {
    expect(isSafeRelativePath("https://evil.example")).toBe(false);
    expect(isSafeRelativePath("http://evil.example/login")).toBe(false);
  });

  it("rejects a path with no leading slash", () => {
    expect(isSafeRelativePath("campgrounds")).toBe(false);
  });

  it("rejects an empty string", () => {
    expect(isSafeRelativePath("")).toBe(false);
  });
});
