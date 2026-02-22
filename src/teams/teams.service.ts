import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';

@Injectable()
export class TeamsService {
    constructor(private prisma: PrismaService) {}

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

    findOne(id: number) {
        return this.prisma.team.findUnique({
            where: { id }
        })
    }

    update(id: number, dto: UpdateTeamDto) {
        return this.prisma.team.update({
            where: { id },
            data: dto
        })
    }

    remove(id: number) {
        return this.prisma.team.update({
            where: { id },
            data: {
                deletedAt: new Date()
            }
        })
    }
}
