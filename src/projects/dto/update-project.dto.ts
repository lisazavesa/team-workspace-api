import { IsInt, IsOptional, IsString, MinLength } from "class-validator";

export class UpdateProjectDto {
    @IsOptional()
    @IsString()
    @MinLength(5)
    name?: string;
}