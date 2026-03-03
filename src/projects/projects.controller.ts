import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    ParseIntPipe,
    Query,
} from '@nestjs/common'
import { ProjectsService } from './projects.service'
import { CreateProjectDto } from './dto/create-project.dto'
import { GetProjectQueryDto } from './dto/project-query.dto'

@Controller('projects')
export class ProjectsController {
    constructor(private readonly projectServise: ProjectsService) {}

    @Post()
    create(@Body() dto: CreateProjectDto) {
        return this.projectServise.create(dto)
    }

    @Get()
    findAll(@Query() query: GetProjectQueryDto) {
        return this.projectServise.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.projectServise.findOne(id)
    }

    //аналитический эндпоинт, возвращает числа, а не сущности/списки задач
    @Get(':id/stats')
    getStats(@Param('id', ParseIntPipe) id: number) {
        return this.projectServise.getStats(id)
    }

    @Get('/team/:teamId')
    findByTeam(@Param('teamId', ParseIntPipe) teamId: number) {
        return this.projectServise.findByTeam(teamId)
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.projectServise.remove(id)
    }
}
