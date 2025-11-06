import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import * as bcrypt from 'bcryptjs';
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    async create(data: CreateUserDto) {
        const userExists = await this.prisma.user.findUnique({
            where: { email: data.email, name: data.name },
        });

        if (userExists) throw new BadRequestException("Email ou user name já cadastrado!");

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const user = await this.prisma.user.create({
            data: {
                email: data.email,
                name: data.name,
                password: hashedPassword,
            },
        });

        const { password, ...result } = user;

        return result;
    }

    async update(id: number, data: UpdateUserDto) {
        const user = await this.prisma.user.findUnique({ where: { id } });

        if (!user) throw new NotFoundException("Usuário não encontrado!");

        let password: string | undefined;

        if(data.password) {
            password = await bcrypt.hash(data.password, 10);
        }

        const updatedUser = await this.prisma.user.update({
            where: { id },
            data: {
                name: data.name ?? user.name,
                password: password ?? user.password,
            },
            select: { id: true, email: true, name: true, createdAt: true },
        });

        return updatedUser;
    }
}