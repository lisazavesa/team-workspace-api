import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GetUsersQueryDto } from './dto/users-query.dto';
import { contains } from 'class-validator';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) {}

    async create(email: string, passwordHash: string) {
        return this.prisma.user.create({
            data: {
                email,
                passwordHash
            },
        });
    }

    async findAll(query: GetUsersQueryDto) {
        // return this.prisma.user.findMany();
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
            data: users,
            meta: {
                total,
                page,
                lastPage
            }
        }
    }
}
