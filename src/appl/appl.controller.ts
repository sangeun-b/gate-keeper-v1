import { Controller, Get, Param, Post } from '@nestjs/common';
import { ApplService } from './appl.service';

@Controller('appl')
export class ApplController {
  constructor(private ApplService: ApplService) {}

  @Get(':id')
  findAll(@Param('id') id: number) {
    return this.ApplService.findAll(id);
  }
}
