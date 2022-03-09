import { Kudo, Prisma } from "@prisma/client";
import { prisma } from ".";


export const createKudo = async (kudo: Prisma.KudoCreateInput): Promise<Kudo> => {
  return await prisma.kudo.create({
    data: kudo
  });
}