import { Body, Controller, Delete, Get, Param, ParseEnumPipe, ParseIntPipe, Patch, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { TasksService } from './tasks.service'
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskStatus } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { GetTaskQueryDto } from './dto/task-query.dto';

@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) {}

    @Post()
    create(@Body() dto: CreateTaskDto) {
        return this.tasksService.create(dto)
    }


    @Get()
    findAll(@Query() query: GetTaskQueryDto)  {
        return this.tasksService.findAll(query)
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.tasksService.findOne(id);
    }


    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number, 
        @Body() dto: UpdateTaskDto) {
            return this.tasksService.update(id, dto)
    }


    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.tasksService.remove(id)
    }

    //file

    @Post(':id/files')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './uploads',
                filename: (req, file, cb) => {
                    const uniqueName = Date.now() + '-' + file.originalname
                    cb(null, uniqueName)
                },
            }),
        }),
    )
    uploadFile(
        @Param('id', ParseIntPipe) id: number, 
        @UploadedFile() file: Express.Multer.File
    ) {
        return this.tasksService.uploadFile(id, file)
    }

    @Get(':taskId/files')
    findAllFiles(@Param('taskId', ParseIntPipe) taskId: number) {
        return this.tasksService.findAllFiles(taskId)
    }

    @Delete(':taskId/files/:fileId')
    deleteFile(
        @Param('fileId', ParseIntPipe) fileId: number,
        @Param('taskId', ParseIntPipe) taskId: number
    ) {
        return this.tasksService.deleteFile(taskId, fileId)
    }
}
