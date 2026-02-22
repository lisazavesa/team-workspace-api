import { IsInt, IsString, MinLength } from "class-validator";

export class CreateProjectDto {
    @IsString()
    @MinLength(5)
    name: string;

    @IsInt()
    teamId: number
}