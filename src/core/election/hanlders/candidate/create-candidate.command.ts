import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Field, InputType } from '@nestjs/graphql';
import { PrismaService } from 'shared/services';

@InputType()
export class CreateCandidateInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  electionId: string;

  @Field(() => String)
  imageUrl: string;
}

interface ICreateCandidateCommand {
  name: string;
  userId: string;
  electionId: string;
  imageUrl: string;
}

export class CreateCandidateCommand {
  constructor(params: ICreateCandidateCommand) {
    Object.assign(this, params);
  }

  public readonly name: string;
  public readonly imageUrl: string;
  public readonly userId: string;
  public readonly electionId: string;
}

@CommandHandler(CreateCandidateCommand)
export class CreateCandidateHandler
  implements ICommandHandler<CreateCandidateCommand>
{
  constructor(private readonly prisma: PrismaService) {}

  async execute({ name, imageUrl, electionId }: CreateCandidateCommand) {
    return this.prisma.candidate.create({
      data: { name, imageUrl, election: { connect: { id: electionId } } }
    });
  }
}
