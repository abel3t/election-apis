import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaService } from 'shared/services';
import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType()
export class CheckCodeInput {
  @Field(() => String)
  electionId?: string;
  @Field(() => String)
  code: string;
}

@ObjectType()
export class CheckCodeResult {
  @Field(() => Boolean)
  isValid: boolean;
}

export class CheckCodeQuery {
  constructor(public readonly electionId: string, public readonly code) {}
}

@QueryHandler(CheckCodeQuery)
export class CheckCodeHandler implements IQueryHandler<CheckCodeQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute({ electionId, code }: CheckCodeQuery) {
    const existedCode = await this.prisma.code.findFirst({
      where: {
        id: code,
        electionId,
        isActive: true,
        isUsed: false
      }
    });

    return { isValid: !!existedCode };
  }
}
