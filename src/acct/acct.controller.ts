import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AcctService } from './acct.service';
import { Acct } from './entity/acct.entity';

@Controller('accts')
export class AcctController {
  constructor(private acctsService: AcctService) {}

  @Get()
  findAll(): Promise<Acct[]> {
    return this.acctsService.findAll();
  }
  @Get(':id')
  findOne(@Param('id') id: number): Promise<Acct> {
    return this.acctsService.findOne(id);
  }
  //   @Post()
  //   create(@Body() acct: Acct) {
  //     return this.acctsService.create(acct);
  //   }
  @Delete(':id')
  remove(@Param('id') id: number) {
    this.acctsService.remove(id);
    return `Deleted a #${id} acct`;
  }
  @Put(':id')
  update(@Param('id') id: number, @Body() acct: Acct) {
    this.acctsService.update(id, acct);
    return `Updated a #${id} acct`;
  }
}
