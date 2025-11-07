import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateTransactionDto } from "./dto/create-transaction.dto";

@Injectable()
export class TransactionService {
    constructor(private prisma: PrismaService) {}

    async createTransaction(data: CreateTransactionDto, userId: number, categoryId: number) {
        return this.prisma.transaction.create({
            data: {
                amount: data.amount,
                date: new Date(data.date),
                description: data.description,
                userId: userId,
                categoryId: categoryId,
            },
        });
    }
}