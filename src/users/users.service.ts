import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GetUsersQueryDto } from './dto/users-query.dto';
import { Prisma, User } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from './dto/user-response.dto';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) {}

    private toResponseDto(user: User) {
    return plainToInstance(UserResponseDto, user, {
        excludeExtraneousValues: true,
        });
    }

    async create(dto: CreateUserDto) {
        const passwordHash = await bcrypt.hash(dto.password, 10);

        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                passwordHash
            },
        })

        return this.toResponseDto(user);
    }

    async findAll(query: GetUsersQueryDto) {
        const page = query.page ?? 1
        const limit = query.limit ?? 10

        const safeLimit = Math.min(limit, 50)

        const where: Prisma.UserWhereInput = {
            deletedAt: null,
            ...(query.email && {
                email: {
                    contains: query.email,
                    mode: Prisma.QueryMode.insensitive
                }
            })
        }

        const total = await this.prisma.user.count({ where })

        const skip = (page - 1) * safeLimit

        const users = await this.prisma.user.findMany({
            where,
            skip,
            take: safeLimit,
            orderBy: {
                createdAt: query.order ?? 'desc'
            },
            include: {
                teamMembers: true,
                assignedTasks: true,
            }
        })

        const lastPage = total === 0 ? 1 : Math.ceil(total / safeLimit)

        return {
            data: plainToInstance(UserResponseDto, users, {
                excludeExtraneousValues: true,
            }),
            meta: {
                total,
                page,
                lastPage,
            },
        };
    }

    async findOne(id: number) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: {
                teamMembers: true,
                assignedTasks: true,
            },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return this.toResponseDto(user);
    }
}
