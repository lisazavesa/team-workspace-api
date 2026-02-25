import { Body, Controller, Delete, Get, Param, ParseEnumPipe, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { TasksService } from './tasks.service'
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskStatus } from '@prisma/client';

@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksServise: TasksService) {}

    @Post()
    create(@Body() dto: CreateTaskDto) {
        return this.tasksServise.create(dto)
    }


    @Get()
    findAll(
        @Query('status', new ParseEnumPipe(TaskStatus))
        status?: TaskStatus,
        @Query('projectId', ParseIntPipe) projectId?: number,
        @Query('assigneeId', ParseIntPipe) assigneeId?: number,
    ) {
        return this.tasksServise.findAll({ status, projectId, assigneeId })
    }


    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number, 
        @Body() dto: UpdateTaskDto) {
            return this.tasksServise.update(id, dto)
    }


    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.tasksServise.remove(id)
    }


}
