import {
  Controller,
  Get,
  Param,
  BadRequestException,
  Delete,
} from '@nestjs/common';
import { isIPAddress } from 'ip-address-validator';

import { IPService } from './ip.service';

@Controller('ip')
export class IpController {
  constructor(private readonly ipService: IPService) {}

  @Get('/:ip')
  async lookup(@Param('ip') ip: string) {
    if (!isIPAddress(ip))
      throw new BadRequestException('ip must be a valid IP address');
    const data = await this.ipService.lookup(ip);
    return data;
  }

  @Delete('/:ip')
  async clear(@Param('ip') ip: string) {
    if (!isIPAddress(ip))
      throw new BadRequestException('ip must be a valid IP address');
    await this.ipService.clearCache(ip);
  }
}
