import { CommandHandler, IQueryHandler } from "@nestjs/cqrs";
import { PrismaService } from "shared/services";
import { Field, InputType } from "@nestjs/graphql";
import { BadRequestException } from "@nestjs/common";

@InputType()
export class UpdateCodeInput {
  @Field(() => String)
  electionId: string;

  @Field(() => String)
  codeId: string;

  @Field(() => Number)
  downloaded: number;

  @Field(() => Boolean)
  isActive: boolean;
}

interface IUpdateCodeCommand {
  electionId: string;
  codeId: string;
  downloaded: number;
  isActive: boolean;
}

export class UpdateCodeCommand {
  constructor(params: IUpdateCodeCommand) {
    Object.assign(this, params);
  }

  public readonly electionId: string;
  public readonly codeId: string;
  public readonly downloaded: number;
  public readonly isActive: boolean;
}

@CommandHandler(UpdateCodeCommand)
export class UpdateCodeHandler implements IQueryHandler<UpdateCodeCommand> {
  constructor(private readonly prisma: PrismaService) {}

  async execute({ electionId, codeId, downloaded, isActive }: UpdateCodeCommand) {
    const existedCode = await this.prisma.code.findFirst({
      where: {
        id: codeId,
        electionId
      }
    });

    if (!existedCode) {
      throw new BadRequestException("Code is invalid!");
    }

    await this.prisma.code.update({
      where: {
        id: codeId
      },
      data: {
        downloaded,
        isActive
      }
    });

    return this.prisma.code.findFirst({
      where: {
        id: codeId,
        electionId
      }
    });
  }
}
