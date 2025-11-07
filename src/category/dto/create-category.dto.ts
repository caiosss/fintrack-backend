import { CategoryType } from "@prisma/client";
import { IsArray, IsEnum, IsString } from "class-validator";
import { CreateTransactionDto } from "src/transaction/dto/create-transaction.dto";

export class CreateCategoryDto {
    @IsString()
    name: string;

    @IsEnum(CategoryType, { message: 'O campo tipo deve ser um dos seguintes valores: receita, despesa, investimento' })
    type: CategoryType;
}