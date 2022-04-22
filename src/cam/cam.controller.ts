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

  @Get('macAddr/:macAddr')
  @ApiOperation({ summary: 'Cam 조회', description: 'macAddr로 Cam 조회' })
  @ApiCreatedResponse({ description: 'macAddr로 Cam 조회', type: Cam })
  findByMacAddr(@Param('macAddr') macAddr: string) {
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

  @Get('addr/:addr')
  findByAddr(@Param('addr') addr: string) {
    const cam = new Cam();
    cam.addr = addr;
    return this.camService.findByAddr(cam);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Cam 삭제', description: 'id(pk)로 Cam 삭제' })
  remove(@Param('id') id: number) {
    this.camService.remove(id);
    return `cam #${id} deleted!`;
  }
}
