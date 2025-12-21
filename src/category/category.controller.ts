import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";

@Controller('category')
export class CategoryController {
    constructor(private categoryService: CategoryService) {}

    @UseGuards(JwtAuthGuard)
    @Post(':userId')
    async createCategory(@Body() data: CreateCategoryDto, @Param('userId', ParseIntPipe) userId: number) {
        return this.categoryService.createCategory(data, userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':userId')
    async getCategories(@Param('userId', ParseIntPipe) userId: number) {
        return this.categoryService.getCategoriesByUser(userId);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    async updateCategory(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateCategoryDto) {
        return this.categoryService.updateCategory(id, data);
    }

    @UseGuards(JwtAuthGuard)
    @Get('filter/:userId/:month/:year')
    async getCategoriesByType(
        @Param('userId', ParseIntPipe) userId: number,
        @Param('month', ParseIntPipe) month: number,
        @Param('year', ParseIntPipe) year: number
    ) {
        return this.categoryService.getCategoryTransactionsByMonthAndYear(userId, month, year);
    }
}