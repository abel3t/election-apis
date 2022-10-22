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
import { CloneElectionsHandler } from './hanlders/clone-election.command';
import { DeleteCandidateHandler } from './hanlders/candidate/delete-candidate.command';
import { UpdateElectionHandler } from './hanlders/update-election.comnmand';
import { S3Service } from 'shared/services/s3.service';
import { GetElectionResultHandler } from './hanlders/get-election-result.query';
import { GetElectionHandlerGetElectionHandler } from "./hanlders/get-election.query";

const QueryHandlers = [
  GetElectionsHandler,
  GetElectionHandlerGetElectionHandler,
  GetCandidatesHandler,
  GetCodesHandler,
  DownloadQrCodePdfHandler,
  GetElectionResultHandler
];
const CommandHandlers = [
  CreateElectionHandler,
  GenerateCodesHandler,
  CreateCandidateHandler,
  UpdateCodeHandler,
  CloneElectionsHandler,
  DeleteCandidateHandler,
  UpdateElectionHandler
];

@Module({
  imports: [CqrsModule],
  controllers: [ElectionController],
  providers: [ElectionResolver, S3Service, ...QueryHandlers, ...CommandHandlers]
})
export class ElectionModule {}
