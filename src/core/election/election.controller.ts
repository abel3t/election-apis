import {
  BadRequestException,
  Controller,
  Get,
  Header,
  Param,
  Post,
  Req,
  Res,
  UseGuards
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { DownloadQrCodePdfQuery } from './hanlders/code/download-qrcode-pdf.query';
import { S3Service } from 'shared/services/s3.service';
import { HttpAuthGuard } from '../../guards/http-auth.guard';

@Controller('election')
export class ElectionController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly s3Service: S3Service
  ) {}

  @UseGuards(HttpAuthGuard)
  @Get(':id/codes/download')
  async getPDF(@Req() req, @Res() res: any, @Param('id') electionId: string) {
    const user = req.user;

    const buffer = await this.queryBus.execute(
      new DownloadQrCodePdfQuery(user.id, electionId)
    );

    if (!buffer) {
      throw new BadRequestException('Error');
    }

    return res.send(buffer);
  }

  @UseGuards(HttpAuthGuard)
  @Header('Content-Type', 'application/json')
  @Post('uploadFile')
  async upload(@Req() req, @Res() res) {
    const data = await req.file();

    const result = await this.s3Service.uploadFile(data.file, data.filename);

    return res.send({
      link: result
    });
  }
}
