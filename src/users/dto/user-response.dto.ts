import { Expose, Type } from 'class-transformer';
import { ProjectResponseDto } from 'src/projects/dto/project-response.dto';
import { TaskResponseDto } from 'src/tasks/dto/task-response.dto';
import { TeamResponseDto } from 'src/teams/dto/team-response.dto';

export class UserResponseDto {
    @Expose()
    id: number;
    
    @Expose()
    email: string;
    
    @Expose()
    name: string;

    @Expose()
    createdAt: Date;

    @Expose()
    updatedAt: Date;
    
    @Expose()
    deletedAt: Date | null;
    
    @Expose()
    @Type(() => TeamResponseDto)
    teams?: TeamResponseDto[];

    @Expose()
    @Type(() => ProjectResponseDto)
    projects?: ProjectResponseDto[];

    @Expose()
    @Type(() => TaskResponseDto)
    assignedTasks?: TaskResponseDto[];
}