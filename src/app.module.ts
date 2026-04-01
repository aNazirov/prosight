import { Module } from '@nestjs/common';
import { AuthModule } from './business/auth/auth.module';
import { CommonModule } from './common/common.module';
import { LocusModule } from './business/locus/locus.module';

@Module({
  imports: [CommonModule, AuthModule, LocusModule],
})
export class AppModule {}
