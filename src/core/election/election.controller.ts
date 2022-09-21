import { Controller, Get, Header, Param, Res } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { DownloadQrCodePdfQuery } from './hanlders/code/download-qrcode-pdf.query';

@Controller('election')
export class ElectionController {
  constructor(
    private readonly queryBus: QueryBus
  ) {}

  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'attachment; filename=qr-codes.pdf')
  @Get(':id/codes/download')
  async getPDF(
    @Res() res: any,
    @Param('id') electionId: string
  ) {
    const buffer = await this.queryBus.execute(new DownloadQrCodePdfQuery(electionId));

    return res.send(buffer);
  }
}