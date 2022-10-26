import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Field, InputType } from '@nestjs/graphql';
import { CognitoService, PrismaService } from 'shared/services';
import { Role } from '../constant';
import { AppConfig } from 'shared/config';

@InputType()
export class CreateAdminAccountInput {
  @Field(() => String)
  email: string;

  @Field(() => String)
  firstName: string;

  @Field(() => String)
  lastName: string;

  @Field(() => String)
  password: string;

  @Field(() => String)
  secretKey: string;
}

interface ICreateAdminAccountCommand {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  secretKey: string;
}

export class CreateAdminAccountCommand {
  constructor(params: ICreateAdminAccountCommand) {
    Object.assign(this, params);
  }

  public readonly email: string;
  public readonly password: string;
  public readonly firstName: string;
  public readonly lastName: string;
  public readonly secretKey: string;
}

@CommandHandler(CreateAdminAccountCommand)
export class CreateAdminAccountHandler
  implements ICommandHandler<CreateAdminAccountCommand>
{
  constructor(
    private readonly prisma: PrismaService,
    private readonly cognitoService: CognitoService
  ) {}

  async execute({
    email,
    password,
    firstName,
    lastName,
    secretKey
  }: CreateAdminAccountCommand) {
    if (secretKey !== AppConfig.APP.CREATE_ACCOUNT_SECRET_KEY) {
      throw new ForbiddenException('Forbidden!');
    }

    if (!email) {
      throw new BadRequestException('Email is invalid!');
    }

    const existedUser = await this.prisma.account.findUnique({
      where: { email: email.toLowerCase() },
      select: { id: true }
    });

    if (existedUser) {
      throw new BadRequestException('User is already exists!');
    }

    return this.cognitoService
      .signUp({
        email: email.toLowerCase(),
        password,
        role: Role.Admin
      })
      .then(async () => {
        const user = await this.prisma.account.create({
          data: {
            email: email.toLowerCase(),
            firstName,
            lastName,
            role: Role.Admin
          }
        });
        await this.cognitoService.updateUserCognitoAttributes(email.toLowerCase(), [
          {
            Name: 'custom:id',
            Value: `${user.id}`
          },
          {
            Name: 'custom:role',
            Value: `${Role.Admin}`
          }
        ]);
        return user;
      })
      .catch((error) => {
        console.log(error);
        throw new BadRequestException(error?.message);
      });
  }
}
