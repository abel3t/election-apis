import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaService } from 'shared/services';
import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType()
export class CheckCodeInput {
  @Field(() => String)
  electionId: string;

  @Field(() => String)
  codeId: string;
}

@ObjectType()
export class CheckCodeResult {
  @Field(() => Boolean)
  isValid: boolean;
}

export class CheckCodeQuery {
  constructor(public readonly electionId: string, public readonly codeId) {}
}

@QueryHandler(CheckCodeQuery)
export class CheckCodeHandler implements IQueryHandler<CheckCodeQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute({ electionId, codeId }: CheckCodeQuery) {
    const existedCode = await this.prisma.code.findFirst({
      where: {
        id: codeId,
        electionId,
        isActive: true,
        isUsed: false
      }
    });

    return { isValid: !!existedCode };
  }
}
