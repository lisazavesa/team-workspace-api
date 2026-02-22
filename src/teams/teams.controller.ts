import { Controller, Get, Post, Body, Patch, Delete, Param } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { ParseIntPipe } from '@nestjs/common'

@Controller('teams')
export class TeamsController {
    constructor(private readonly teamsService: TeamsService) {}

    @Post()
    create(@Body() dto: CreateTeamDto) {
        return this.teamsService.create(dto)
    }

    @Get()
    findAll() {
        return this.teamsService.findAll();
    }

    @Get(':id')
    findById(@Param('id', ParseIntPipe) id: number) {
        return this.teamsService.findOne(id)
    }


    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTeamDto) {
        return this.teamsService.update(id, dto)
    }


    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.teamsService.remove(id)
    }
}
