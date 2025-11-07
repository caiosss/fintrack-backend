import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";

@Injectable()
export class CategoryService {
    constructor(private prisma: PrismaService) {}

    async createCategory(data: CreateCategoryDto, userId: number) {
        return this.prisma.category.create({
            data: {
                name: data.name,
                type: data.type,
                userId: userId,
            }
        })
    }

    async getCategoriesByUser(userId: number) {
        return this.prisma.category.findMany({
            where: { userId: userId },
            include: {
                transactions: true,
            },
        });
    }

    async updateCategory (categoryId: number, data: UpdateCategoryDto) {
        return this.prisma.category.update({
            where: { id: categoryId },
            data: {
                name: data.name ?? data.name,
                type: data.type ?? data.type,
            }
        });
    }
}