import { z } from "zod";

const clientSchema = z.object({
  NEXT_PUBLIC_API_URL: z.url(),
});

const parseEnv = <T extends z.ZodType>(
  schema: T,
  data: unknown,
  type: string,
): z.infer<T> => {
  const result = schema.safeParse(data);
  if (!result.success) {
    // eslint-disable-next-line no-console
    console.error(
      `❌ Invalid ${type} environment variables:`,
      result.error.format(),
    );
    throw new Error(`Invalid ${type} environment variables`);
  }
  return result.data;
};

const clientEnv = parseEnv(
  clientSchema,
  {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  "client",
);

export const env = { ...clientEnv };
