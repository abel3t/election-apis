import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaService } from 'shared/services';
import { BadRequestException } from '@nestjs/common';
import { generatePdf } from 'shared/utils/pdfkit.util';
import { AppConfig } from '../../../../shared/config';

export class DownloadQrCodePdfQuery {
  constructor(public readonly userId: string, public readonly electionId: string) {}
}

@QueryHandler(DownloadQrCodePdfQuery)
export class DownloadQrCodePdfHandler implements IQueryHandler<DownloadQrCodePdfQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute({ userId, electionId }: DownloadQrCodePdfQuery) {
    const existedElection = this.prisma.election.findFirst({ where: { id: electionId, accountId: userId } }).then(data => data);

    if (!existedElection) {
      throw new BadRequestException('Election is invalid!');
    }


    const codes = await this.prisma.code.findMany({ where: { election: { id: electionId } } });

    if (!codes.length) {
      throw new BadRequestException('You haven\'t any codes!');
    }

    this.prisma.code.updateMany(
      { where: { election: { id: electionId } }, data: { downloaded: codes[0].downloaded + 1 } });

    return generatePdf(codes.map(code => `${AppConfig.APP.WEBSITE_URL}/voting/?election=${electionId}&code=${code.id}`));
  }
}
