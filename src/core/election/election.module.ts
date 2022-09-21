import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateElectionHandler } from './hanlders/create-election.command';
import { ElectionResolver } from './election.resolver';
import { GetElectionsHandler } from './hanlders/get-elections.query';
import { GenerateCodesHandler } from './hanlders/code/generate-codes.command';
import { CreateCandidateHandler } from './hanlders/candidate/create-candidate.command';
import { GetCandidatesHandler } from './hanlders/candidate/get-candidates.command';
import { GetCodesHandler } from './hanlders/code/get-codes.query';
import { UpdateCodeHandler } from './hanlders/code/update-code.command';
import { ElectionController } from './election.controller';
import { DownloadQrCodePdfHandler } from './hanlders/code/download-qrcode-pdf.query';

const QueryHandlers = [GetElectionsHandler, GetCandidatesHandler, GetCodesHandler, DownloadQrCodePdfHandler];
const CommandHandlers = [CreateElectionHandler, GenerateCodesHandler, CreateCandidateHandler, UpdateCodeHandler];

@Module({
  imports: [CqrsModule],
  controllers: [ElectionController],
  providers: [ElectionResolver, ...QueryHandlers, ...CommandHandlers]
})
export class ElectionModule {}