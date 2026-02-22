import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';

@Injectable()
export class TeamsService {
    constructor(private readonly prisma: PrismaService) {}

    create(dto: CreateTeamDto) {
        return this.prisma.team.create({
            data: dto
        })
    }

    findAll() {
        return this.prisma.team.findMany({
            where: {
                deletedAt: null
            }
        })
    }

    async findOne(id: number) {
        const team = await this.prisma.team.findUnique({
            where: { id }
        })

        if (!team) {
                throw new NotFoundException('Team not found')
            }
        
        return team
    }

    async update(id: number, dto: UpdateTeamDto) {
        const team = await this.findOne(id)

        if (!team) {
                throw new NotFoundException('Team not found')
            }
        
        return this.prisma.team.update({
            where: { id },
            data: dto
        })

    }

    async remove(id: number) {
        const team = await this.findOne(id)

        if (!team) {
                throw new NotFoundException('Team not found')
            }

        return this.prisma.team.update({
            where: { id },
            data: {
                deletedAt: new Date()
            }
        })
    }
}
