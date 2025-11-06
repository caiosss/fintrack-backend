import { Body, Controller, Param, ParseIntPipe, Post, UseGuards } from "@nestjs/common";
import { TransactionService } from "./transaction.service";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { CreateTransactionDto } from "./dto/create-transaction.dto";

@Controller('transaction')
export class TransactionController {
    constructor(private readonly transactionService: TransactionService) {}

    @UseGuards(JwtAuthGuard)
    @Post(':userId/:categoryId')
    create (@Param('userId', ParseIntPipe) userId: number, @Param('categoryId', ParseIntPipe) categoryId: number, @Body() data: CreateTransactionDto) {
        return this.transactionService.createTransaction(data, userId, categoryId);
    }
}