import { IsInt } from "class-validator";

export class ProjectStatsDto {
    @IsInt()
    id: number
    @IsInt()
    totalTasks: number
    @IsInt()
    completedTasks: number
    @IsInt()
    inProgressTasks: number
    @IsInt()
    todoTasks: number
    @IsInt()
    progress: number
}