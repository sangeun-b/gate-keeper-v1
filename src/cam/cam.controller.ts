import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CamService } from './cam.service';
import { Cam } from './entity/cam.entity';

@Controller('cam')
@ApiTags('Cam API')
export class CamController {
  constructor(private camService: CamService) {}

  @Post()
  @ApiOperation({
    summary: 'Cam 등록',
    description: 'Cam 등록',
  })
  @ApiCreatedResponse({ description: 'Cam 등록', type: Cam })
  save(@Body() cam: Cam) {
    return this.camService.create(cam);
  }
  // mac address로 검색가능하게 만들기

  @Get('macAddr')
  @ApiOperation({ summary: 'Cam 조회', description: 'macAddr로 Cam 조회' })
  @ApiCreatedResponse({ description: 'macAddr로 Cam 조회', type: Cam })
  findByMacAddr(@Body() macAddr: Cam) {
    return this.camService.findByMacAddr(macAddr);
  }

  @Get()
  @ApiOperation({ summary: '모든 Cam 조회', description: '모든 Cam 조회' })
  @ApiCreatedResponse({ description: '모든 Cam 조회', type: Cam })
  findAll() {
    const curr = new Date();
    console.log(curr);
    return this.camService.findAll();
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Cam 삭제', description: 'id(pk)로 Cam 삭제' })
  remove(@Param('id') id: number) {
    this.camService.remove(id);
    return `cam #${id} deleted!`;
  }

  // @Get('addr')
  // findByAddr(@Body() addr: Cam) {
  //   return this.camService.findByAddr(addr);
  // }
}
