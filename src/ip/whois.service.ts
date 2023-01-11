import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import * as _ from 'lodash';

@Injectable()
export class WhoisService {
  constructor(private readonly httpService: HttpService) {}

  async lookup(ip: string) {
    const response = await this.httpService.axiosRef.get(
      `https://ipwho.is/${ip}`,
    );
    return response.data;
  }
}
