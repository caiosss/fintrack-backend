import { CategoryType } from "@prisma/client";
import { IsOptional } from "class-validator";

export class UpdateCategoryDto {

    @IsOptional()
    name?: string;

    @IsOptional()
    type?: CategoryType;
}