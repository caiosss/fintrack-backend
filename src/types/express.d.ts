import type { User as PrismaUser } from "@prisma/client";

declare global {
  namespace Express {
    interface User extends Omit<PrismaUser, "password"> {}

    interface Request {
      user?: User;
    }
  }
}

export {};
