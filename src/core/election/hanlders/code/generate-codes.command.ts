import { BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Field, InputType } from '@nestjs/graphql';
import { PrismaService } from 'shared/services';

@InputType()
export class GenerateCodesCodeInput {
  @Field(() => Number)
  amount: number;

  @Field(() => String)
  electionId: string;
}

interface ICreateCodeCommand {
  amount: number;
  userId: string;
  electionId: string;
}

export class GenerateCodesCommand {
  constructor(params: ICreateCodeCommand) {
    Object.assign(this, params);
  }

  public readonly amount: number;
  public readonly userId: string;
  public readonly electionId: string;
}

@CommandHandler(GenerateCodesCommand)
export class GenerateCodesHandler
  implements ICommandHandler<GenerateCodesCommand>
{
  constructor(private readonly prisma: PrismaService) {}

  async execute({ amount, electionId, userId }: GenerateCodesCommand) {
    if (!amount) {
      throw new BadRequestException('Amount is invalid!');
    }

    const codes = [];
    const date = new Date();
    for (let i = 0; i < amount; i++) {
      date.setSeconds(date.getSeconds() + i);

      const createdAt = date.toISOString();
      codes.push({ electionId, createdAt });
    }

    await this.prisma.code.createMany({ data: codes });

    return this.prisma.code.findMany({ where: { electionId } });
  }
}
