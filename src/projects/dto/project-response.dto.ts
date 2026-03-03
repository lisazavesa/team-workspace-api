import { Expose, Type } from 'class-transformer';
import { TaskResponseDto } from 'src/tasks/dto/task-response.dto';
import { TeamResponseDto } from 'src/teams/dto/team-response.dto';

export class ProjectResponseDto {
    @Expose()
    id: number;
    
    @Expose()
    name: string;
    
    @Expose()
    teamId: number;
    
    @Expose()
    createdAt: Date;
    
    @Expose()
    updatedAt: Date;

    @Expose()
    deletedAt: Date | null;

    @Expose()
    @Type(() => TeamResponseDto)
    team?: TeamResponseDto;

    @Expose()
    @Type(() => TaskResponseDto)
    tasks?: TaskResponseDto[];
}