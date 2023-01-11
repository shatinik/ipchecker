import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { IP } from './entities/ip.entity';
import { WhoisService } from './whois.service';

@Injectable()
export class IPService {
  constructor(
    private whoisService: WhoisService,
    @InjectRepository(IP) private readonly ipRepo: Repository<IP>,
  ) {}

  async lookup(ip: string) {
    const cached = await this.ipRepo.findOne({ ip });
    if (cached) return JSON.parse(cached.metadata);
    const metadata = await this.whoisService.lookup(ip);
    const model = new IP();
    model.ip = ip;
    model.metadata = JSON.stringify(metadata);
    await this.ipRepo.upsert(model, { conflictPaths: ['ip'] });
    return metadata;
  }

  async clearCache(ip: string) {
    await this.ipRepo.delete({ ip });
  }
}
