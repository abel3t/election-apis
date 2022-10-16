import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from 'shared/services';
import { BadRequestException } from '@nestjs/common';

export class UpdateElectionCommand {
  constructor(public electionId: string, public name: string) {}
}

@CommandHandler(UpdateElectionCommand)
export class UpdateElectionHandler implements ICommandHandler<UpdateElectionCommand> {
  constructor(
    private readonly prisma: PrismaService
  ) {}

  async execute({ electionId, name }: UpdateElectionCommand) {
    console.log({ electionId, name  })

    const existedElection = await this.prisma.election.findFirst({ where: { id: electionId } });

    if (!existedElection) {
      throw new BadRequestException('electionId is invalid.');
    }

    await this.prisma.election.update({
      where: { id: electionId },
      data: { name }
    });

    return true;
  }
}