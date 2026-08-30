import { memoryAdapter } from "@better-auth/memory-adapter";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";

import { getServerEnvironment } from "@/lib/server/env";

const memoryDatabase = {
  account: [],
  session: [],
  user: [],
  verification: [],
};

export const auth = betterAuth({
  appName: "Clario",
  ...(getServerEnvironment().BETTER_AUTH_URL && {
    baseURL: getServerEnvironment().BETTER_AUTH_URL,
  }),
  basePath: "/api/auth",
  database: memoryAdapter(memoryDatabase),
  emailAndPassword: {
    disableSignUp: true,
    enabled: true,
    minPasswordLength: 12,
  },
  plugins: [nextCookies()],
  secret: getServerEnvironment().CLARIO_AUTH_SECRET,
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
});
