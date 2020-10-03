import { Module } from '@nestjs/common';
import { CommonHelpers } from './common.helpers';

@Module({
  providers: [CommonHelpers],
})
export class CommonModule {}
