import { Injectable } from '@nestjs/common';
import fs from 'fs';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello cima!';
  }
}
