import { Controller, Get, Post, Body, Patch, Delete, Param, Query } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { ParseIntPipe } from '@nestjs/common'
import { GetTeamsQueryDto } from './dto/teams-query.dto';

@Controller('teams')
export class TeamsController {
    constructor(private readonly teamsService: TeamsService) {}

    @Post()
    create(@Body() dto: CreateTeamDto) {
        return this.teamsService.create(dto)
    }

    @Get()
    findAll(@Query() query: GetTeamsQueryDto) {
        return this.teamsService.findAll(query);
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
