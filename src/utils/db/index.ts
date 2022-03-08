import { Prisma, PrismaClient } from '@prisma/client'

let user: Prisma.UserCreateInput

export const prisma = new PrismaClient();

