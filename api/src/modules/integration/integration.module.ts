import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IntegrationService } from './integration.service';
import { ApiToken } from './models/apiToken.model';

@Module({
  imports: [TypeOrmModule.forFeature([ApiToken])],
  providers: [IntegrationService],
  exports: [IntegrationService],
})
export class IntegrationModule {}
