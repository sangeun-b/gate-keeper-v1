import { Injectable } from '@nestjs/common';

@Injectable()
export class ApplService {
  findAll(id): string {
    return 'return appl list';
  }
}
