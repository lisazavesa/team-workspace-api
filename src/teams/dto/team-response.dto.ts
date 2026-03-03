import { Expose, Type } from 'class-transformer';
import { ProjectResponseDto } from 'src/projects/dto/project-response.dto';
import { UserResponseDto } from 'src/users/dto/user-response.dto';

export class TeamResponseDto {
    @Expose()
    id: number;
    
    @Expose()
    name: string;
    
    @Expose()
    createdAt: Date;
    
    @Expose()
    updatedAt: Date;

    @Expose()
    deletedAt: Date | null;

    @Expose()
    @Type(() => UserResponseDto)
    members?: UserResponseDto[];

    @Expose()
    @Type(() => ProjectResponseDto)
    projects?: ProjectResponseDto[];
}