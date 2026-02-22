import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    ParseIntPipe,
} from '@nestjs/common'
import { ProjectsService } from './projects.service'
import { CreateProjectDto } from './dto/create-project.dto'
import { UpdateProjectDto } from './dto/update-project.dto'

@Controller('projects')
export class ProjectsController {
    constructor(private readonly projectServise: ProjectsService) {}

    @Post()
    create(@Body() dto: CreateProjectDto) {
        return this.projectServise.create(dto)
    }

    @Get()
    finAll() {
        return this.projectServise.findAll()
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.projectServise.findOne(id)
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
