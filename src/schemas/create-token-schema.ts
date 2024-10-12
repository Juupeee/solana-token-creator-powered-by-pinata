import * as z from "zod";

export const createTokenSchema = z
  .object({
    name: z.string().min(1, "Name is required").max(30, "Name is too long"),
    symbol: z
      .string()
      .min(1, "Symbol is required")
      .max(10, "Symbol is too long")
      .refine((val) => val.toUpperCase()),
    decimals: z.number().min(0).max(9),
    supply: z.number().positive("Supply must be positive"),
    logoType: z.enum(["file", "url"]),
    logoFile: z.any().optional(),
    logoUrl: z.string().url("Invalid URL").optional(),
    description: z.string().max(1000, "Description is too long").optional(),
  })
  .refine(
    (data) =>
      (data.logoType === "file" && data.logoFile instanceof File) ||
      (data.logoType === "url" && data.logoUrl),
    { message: "Logo is required", path: ["logoFile", "logoUrl"] },
  );

export type CreateTokenValues = z.infer<typeof createTokenSchema>;
