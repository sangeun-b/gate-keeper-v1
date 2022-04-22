import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AcctService } from './acct.service';
import { Acct } from './entity/acct.entity';

@Controller('accts')
@ApiTags('Acct API')
export class AcctController {
  constructor(private acctsService: AcctService) {}

  @Get()
  @ApiOperation({
    summary: '모든 Acct 조회',
    description: '모든 Acct 정보 조회',
  })
  @ApiCreatedResponse({ description: '모든 Acct 정보 조회', type: Acct })
  findAll(): Promise<Acct[]> {
    return this.acctsService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Acct 조회',
    description: 'id(pk)로 Acct 정보 조회',
  })
  @ApiCreatedResponse({ description: 'id(pk)로 Acct 정보 조회', type: Acct })
  findOne(@Param('id') id: number): Promise<Acct> {
    return this.acctsService.findOne(id);
  }

  @Get('/acctId/:aid')
  findOneById(@Param('aid') aid: string): Promise<Acct> {
    return this.acctsService.findOneById(aid);
  }

  @Delete(':email')
  @ApiOperation({
    summary: 'Acct 삭제',
    description: 'email 로 Acct 삭제',
  })
  remove(@Param('email') email: string) {
    this.acctsService.remove(email);
    return `Deleted a #${email} acct`;
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Acct 수정',
    description:
      'id(pk)로 Acct로 검색해서 json으로 전화번호만 입력한 후 검색한 Acct의 전화번호 수정',
  })
  update(@Param('id') id: number, @Body() acct: Acct) {
    this.acctsService.update(id, acct);
    return `Updated a #${id} acct`;
  }
}
