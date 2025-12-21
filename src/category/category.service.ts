import { Injectable } from "@nestjs/common";
import { CategoryType } from "@prisma/client";
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

    async getCategoryTransactionsByMonthAndYear(userId: number, month: number, year: number) {
        const currentStart = new Date(year, month - 1, 1);
        const currentEnd = new Date(year, month, 1);
        const previousMonthStart = new Date(year, month - 2, 1);
        const previousMonthEnd = new Date(year, month - 1, 1);
        const previousYearStart = new Date(year - 1, month - 1, 1);
        const previousYearEnd = new Date(year - 1, month, 1);
        const expenseWhereBase = { userId: userId, category: { type: CategoryType.EXPENSE } };
        const calculateChangePercent = (current: number, previous: number) => {
            if (previous === 0) {
                return null;
            }
            return ((current - previous) / previous) * 100;
        };

        const [
            categories,
            currentExpense,
            previousMonthExpense,
            previousYearExpense,
        ] = await Promise.all([
            this.prisma.category.findMany({
                where: { userId: userId },
                include: {
                    transactions: {
                        where: {
                            AND: [
                                { date: { gte: currentStart } },
                                { date: { lt: currentEnd } }
                            ]
                        }
                    }
                }
            }),
            this.prisma.transaction.aggregate({
                _sum: { amount: true },
                where: {
                    ...expenseWhereBase,
                    date: { gte: currentStart, lt: currentEnd },
                },
            }),
            this.prisma.transaction.aggregate({
                _sum: { amount: true },
                where: {
                    ...expenseWhereBase,
                    date: { gte: previousMonthStart, lt: previousMonthEnd },
                },
            }),
            this.prisma.transaction.aggregate({
                _sum: { amount: true },
                where: {
                    ...expenseWhereBase,
                    date: { gte: previousYearStart, lt: previousYearEnd },
                },
            }),
        ]);

        const currentTotal = currentExpense._sum.amount ?? 0;
        const previousMonthTotal = previousMonthExpense._sum.amount ?? 0;
        const previousYearTotal = previousYearExpense._sum.amount ?? 0;

        const expenseComparison = {
            currentTotal,
            previousMonthTotal,
            previousYearTotal,
            previousMonthChangePercent: calculateChangePercent(currentTotal, previousMonthTotal),
            previousYearChangePercent: calculateChangePercent(currentTotal, previousYearTotal),
        };

        return categories.map((category) => ({
            ...category,
            expenseComparison,
        }));
    }
}
