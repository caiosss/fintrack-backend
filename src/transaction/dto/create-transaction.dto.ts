import { IsDate, IsNumber, IsString } from "class-validator";

export class CreateTransactionDto {
    @IsNumber({}, { message: 'O campo quantidade deve ser um número' })
    amount: number;
    
    @IsDate({ message: 'O campo data deve ser uma data válida' })
    date: Date;
    
    @IsString()
    description?: string;
}