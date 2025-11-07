import { IsOptional } from "class-validator";

export class UpdateTransactionDto {

    @IsOptional()
    amount?: number;

    @IsOptional()
    date?: Date;

    @IsOptional()
    description?: string;
}