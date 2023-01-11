import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { IP } from './entities/ip.entity';
import { IpController } from './ip.controller';
import { IPService } from './ip.service';
import { WhoisService } from './whois.service';

@Module({
  controllers: [IpController],
  imports: [TypeOrmModule.forFeature([IP]), HttpModule],
  providers: [IPService, WhoisService],
})
export class IPModule {}
