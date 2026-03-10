import { Test, TestingModule } from '@nestjs/testing';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { TeamResponseDto } from './dto/team-response.dto';


describe('TeamsController', () => {
  let controller: TeamsController;
  let service: TeamsService;

  const mockTeamsService = {
    create: jest.fn((dto: CreateTeamDto) => ({
      id: 1,
      name: dto.name,
      createdAt: new Date(),
      deletedAt: null,
    } as TeamResponseDto)
  ),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeamsController],
        providers: [
          {
            provide: TeamsService,
            useValue: mockTeamsService,
          },
        ],
    }).compile();

    controller = module.get<TeamsController>(TeamsController);
    service = module.get<TeamsService>(TeamsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create team', async () => {
    const dto: CreateTeamDto = { name: 'Backend Team' };
    const result = await controller.create(dto);

    expect(result).toBeDefined();
    expect(result.name).toBe('Backend Team');
    expect(mockTeamsService.create).toHaveBeenCalledWith(dto);
  });
});
