import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { GetUsersQueryDto } from './dto/users-query.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    create(@Body() body: {email: string, passwordHash: string}) {
        return this.usersService.create(body.email, body.passwordHash)
    }

    @Get()
    findAll(@Query() query: GetUsersQueryDto) {
        return this.usersService.findAll(query);
    }
}
