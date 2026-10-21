import { PrismaClient } from '@prisma/client';

declare global {
    var prisma: PrismaClient | undefined;
};

export const db = globalThis.prisma || new PrismaClient();

//for hot reload we write all this code so that prisma client doesnot get
//initialize everytime we change a line of code in development

if ( process.env.NODE_ENV !== "production" ) globalThis.prisma = db
