import { expect } from '@jest/globals';
import { INestApplication } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { isIPAddress } from 'ip-address-validator';
import * as _ from 'lodash';
import * as request from 'supertest';
import { Connection, Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';

import { IP } from '../src/ip/entities/ip.entity';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let ipRepo: Repository<IP>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    ipRepo = app.get(getRepositoryToken(IP));
  });

  it('/ip (GET) validation error', async () => {
    await request(app.getHttpServer())
      .get(`/ip/non-walid-ip-address`)
      .expect(400);
  });

  it('/ip (DELETE) validation error', async () => {
    await request(app.getHttpServer())
      .delete(`/ip/non-walid-ip-address`)
      .expect(400);
  });

  it('/ip (GET) existing IP', async () => {
    const ip = '127.0.0.1';
    const metadata = { ip, customField: 'data' };

    await ipRepo.delete({ ip });
    await ipRepo.insert({ id: uuid(), ip, metadata: JSON.stringify(metadata) });

    const response = await request(app.getHttpServer())
      .get(`/ip/${ip}`)
      .expect(200);

    expect(response.body).toEqual(metadata);

    await ipRepo.delete({ ip });
  });

  it('/ip (GET) getting IP', async () => {
    const ip = '127.0.0.2';
    const metadata = { ip, message: 'Reserved range', success: false };

    await ipRepo.delete({ ip });
    const response = await request(app.getHttpServer())
      .get(`/ip/${ip}`)
      .expect(200);

    expect(response.body).toMatchObject(metadata);

    await ipRepo.delete({ ip });
  });

  it('/ip (GET) getting and caching IP', async () => {
    const ip = '127.0.0.3';
    await ipRepo.delete({ ip });
    const response1 = await request(app.getHttpServer())
      .get(`/ip/${ip}`)
      .expect(200);

    expect(response1.body.ip).not.toBe(undefined);
    expect(isIPAddress(response1.body.ip)).toBe(true);

    const { id } = await ipRepo.findOne({ ip });

    const response2 = await request(app.getHttpServer())
      .get(`/ip/${ip}`)
      .expect(200);

    const duplicates = await ipRepo.find({ id });
    expect(duplicates.length).toBe(1);
    expect(duplicates[0].id).toBe(id);
    expect(response1.body).toMatchObject(response2.body);

    await ipRepo.delete({ ip });
  });

  it('/ip (DELETE) remove cached IP', async () => {
    const ip = '127.0.0.4';
    const metadata = { ip, customField: 'data' };
    const data = { id: uuid(), ip, metadata: JSON.stringify(metadata) };
    await ipRepo.delete({ ip });
    await ipRepo.insert(data);

    await request(app.getHttpServer()).delete(`/ip/${ip}`).expect(200);

    const result = await ipRepo.findOne({ ip });
    expect(result).toBe(undefined);

    await ipRepo.delete({ ip });
  });

  afterAll(async () => {
    app.get(Connection).close();
  });
});
