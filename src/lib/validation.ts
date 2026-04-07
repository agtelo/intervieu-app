/**
 * Input validation schemas using Zod
 * Prevents injection attacks, malformed input, and oversized uploads
 */

import { z } from "zod";

// File upload validation
export const parseFileSchema = z.object({
  file: z
    .string()
    .refine((str) => Buffer.byteLength(str, "base64") <= 5 * 1024 * 1024, {
      message: "File exceeds 5MB limit",
    })
    .refine((str) => {
      try {
        Buffer.from(str, "base64");
        return true;
      } catch {
        return false;
      }
    }, {
      message: "Invalid base64 encoding",
    }),
});

// URL scraping validation
const ALLOWED_DOMAINS = [
  "linkedin.com",
  "github.com",
  "twitter.com",
  "x.com",
  "crunchbase.com",
  // Allow user's company domain dynamically
];

const BLOCKED_PROTOCOLS = ["file:", "gopher:", "data:", "ftp:", "javascript:"];
const BLOCKED_IPS = [
  "127.0.0.1",
  "localhost",
  "169.254.169.254",
  "0.0.0.0",
  "::1",
];

export const scrapeSchema = z.object({
  url: z
    .string()
    .url("Invalid URL format")
    .refine(
      (url) => {
        const parsed = new URL(url);
        return !BLOCKED_PROTOCOLS.some((proto) =>
          parsed.protocol.includes(proto)
        );
      },
      {
        message: "URL protocol not allowed",
      }
    )
    .refine(
      (url) => {
        const parsed = new URL(url);
        // Block private IP ranges
        if (
          BLOCKED_IPS.includes(parsed.hostname) ||
          parsed.hostname.startsWith("192.168.") ||
          parsed.hostname.startsWith("10.") ||
          parsed.hostname.startsWith("172.")
        ) {
          return false;
        }
        return true;
      },
      {
        message: "Private IP addresses not allowed",
      }
    ),
  sessionId: z.string().min(1).optional(),
});

// Email and person search validation
export const searchPersonSchema = z.object({
  email: z.string().email("Invalid email format").optional(),
  linkedin: z.string().url("Invalid LinkedIn URL").optional(),
  company: z.string().max(100, "Company name too long").optional(),
  role: z.string().max(100, "Role name too long").optional(),
});

// Chat validation
export const chatSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().max(10000, "Message too long"),
      })
    )
    .min(1, "At least one message required"),
  systemPrompt: z.string().max(5000, "System prompt too long"),
});

// Score validation
export const scoreSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      })
    )
    .min(1),
  jdText: z.string().max(10000),
});

// Generate briefing validation
export const generateSchema = z.object({
  sessionId: z.string().min(1, "Session ID required"),
});

// Session creation validation
export const createSessionSchema = z.object({
  cvText: z.string().max(50000, "CV text too long").min(1, "CV required"),
  jdText: z.string().max(20000, "JD text too long").min(1, "JD required"),
  companyUrl: z
    .string()
    .url("Invalid company URL")
    .startsWith("http", "URL must start with http/https"),
  interviewerEmail: z.string().email().optional().or(z.literal("")),
  interviewerLinkedin: z.string().url().optional().or(z.literal("")),
  interviewerRole: z.string().max(100).optional().or(z.literal("")),
});

// Helper function to safely parse request body
export async function safeParseBody<T>(
  req: Request,
  schema: z.ZodSchema<T>
): Promise<{ success: true; data: T } | { success: false; error: string }> {
  try {
    const body = await req.json();
    const result = schema.safeParse(body);

    if (!result.success) {
      const errors = result.error.issues
        .map((e) => `${e.path.join(".")}: ${e.message}`)
        .join("; ");
      return { success: false, error: errors };
    }

    return { success: true, data: result.data };
  } catch (err) {
    if (err instanceof SyntaxError) {
      return { success: false, error: "Invalid JSON" };
    }
    return {
      success: false,
      error: "Failed to parse request",
    };
  }
}
