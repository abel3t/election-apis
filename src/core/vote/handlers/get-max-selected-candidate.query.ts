import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaService } from 'shared/services';
import { BadRequestException } from '@nestjs/common';
import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class GetMaxSelectedCandidateResult {
  @Field(() => Int)
  maxSelected: number;
}

export class GetMaxSelectedCandidate {
  constructor(public readonly electionId: string, public readonly codeId) {}
}

@QueryHandler(GetMaxSelectedCandidate)
export class GetMaxSelectedCandidateHandler implements IQueryHandler<GetMaxSelectedCandidate> {
  constructor(private readonly prisma: PrismaService) {}

  async execute({ electionId, codeId }: GetMaxSelectedCandidate) {
    const existedCode = await this.prisma.code.findFirst({
      where: {
        id: codeId,
        electionId,
        isActive: true,
        isUsed: false
      }
    });

    if (!existedCode) {
      throw new BadRequestException('Code is invalid.');
    }

    const election = await this.prisma.election.findUnique({ where: { id: electionId }});

    if (!election) {
      throw new BadRequestException('Election is invalid.');
    }

    return { maxSelected: election.maxSelected };
  }
}
