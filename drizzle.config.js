/** @type { import("drizzle-kit").Config } */
export default {
  schema: "./utils/schema.tsx",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://ai-content-generator_owner:CaEq30WsYUuR@ep-green-sky-a570v7gb.us-east-2.aws.neon.tech/ai-content-generator?sslmode=require",
  },
};
