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
    constructor(private readonly tasksServise: TasksService) {}

    @Post()
    create(@Body() dto: CreateTaskDto) {
        return this.tasksServise.create(dto)
    }


    @Get()
    findAll(@Query() query: GetTaskQueryDto)  {
        return this.tasksServise.findAll(query)
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
        return this.tasksServise.uploadFile(id, file)
    }

    @Get(':taskId/files')
    findAllFiles(@Param('taskId', ParseIntPipe) taskId: number) {
        return this.tasksServise.findAllFiles(taskId)
    }

    @Delete(':taskId/files/:fileId')
    deleteFile(
        @Param('fileId', ParseIntPipe) fileId: number,
        @Param('taskId', ParseIntPipe) taskId: number
    ) {
        return this.tasksServise.deleteFile(taskId, fileId)
    }
}
