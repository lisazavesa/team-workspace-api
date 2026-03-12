import { Test, TestingModule } from '@nestjs/testing';
import { TeamsService } from './teams.service';
import { PrismaService } from '../prisma/prisma.service';
import { PinoLogger } from 'nestjs-pino';
import { NotFoundException } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { TeamResponseDto } from './dto/team-response.dto';

describe('TeamsService', () => {
  let service: TeamsService;
  let prisma: {
    team: {
      create: jest.Mock;
      findMany: jest.Mock;
      findUnique: jest.Mock;
      update: jest.Mock;
      count: jest.Mock;
    };
  }

  beforeEach(async () => {
    prisma = {
      team: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        count: jest.fn(),
      }
    }
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeamsService,
        {
          provide: PrismaService,
          useValue: prisma
        },
        {
          provide: PinoLogger,
          useValue: {
            info: jest.fn(),
            warn: jest.fn(),
            setContext: jest.fn(),
          }
        }
      ],
    }).compile();

    service = module.get<TeamsService>(TeamsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create team', async () => {
    const dto = { name: 'Backend Team'};

    const fakeTeam = {
      id: 1,
      name: dto.name,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    prisma.team.create.mockResolvedValue(fakeTeam);

    const result = await service.create(dto);

    expect(prisma.team.create).toHaveBeenCalledWith({
      data: dto,
    });
    
    expect(result).toEqual(fakeTeam);
    expect(result.name).toBe('Backend Team');
  })

  it('should return paginated teams', async () => {
    const query = {page: 1, limit: 10};

    const fakeTeams = [
      {
        id: 1,
        name: 'Backend',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      }
    ];

    prisma.team.count.mockResolvedValue(1);
    prisma.team.findMany.mockResolvedValue(fakeTeams);

    const result = await service.findAll(query);

    expect(prisma.team.count).toHaveBeenCalled();
    expect(prisma.team.findMany).toHaveBeenCalled();

    expect(result.data.length).toBe(1);
    expect(result.meta.total).toBe(1);
    expect(result.meta.page).toBe(1);
  })

  it('should return team by id', async () => {

    const fakeTeam = {
      id: 1,
      name: 'Backend',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    prisma.team.findUnique.mockResolvedValue(fakeTeam);

    const result = await service.findOne(1);

    expect(prisma.team.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    });

    expect(result.id).toBe(1);
  })

  it('should throw if team not found', async () => {
    prisma.team.findUnique.mockResolvedValue(null);

    await expect(service.findOne(999))
      .rejects
      .toThrow(NotFoundException);

  })

});
