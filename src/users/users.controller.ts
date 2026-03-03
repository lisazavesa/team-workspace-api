import { Controller, Get, Post, Body, Query, Param, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { GetUsersQueryDto } from './dto/users-query.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    create(@Body() dto: CreateUserDto) {
        return this.usersService.create(dto)
    }

    @Get()
    findAll(@Query() query: GetUsersQueryDto) {
        return this.usersService.findAll(query);
    }

    @Get()
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.findOne(id);
    }
}
