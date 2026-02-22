import { Controller, Get, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    create(@Body() body: {email: string, passwordHash: string}) {
        return this.usersService.create(body.email, body.passwordHash)
    }

    @Get()
    findAll() {
        return this.usersService.findAll();
    }
}
