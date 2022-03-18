import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CamService } from './cam.service';
import { Cam } from './entity/cam.entity';

@Controller('cam')
export class CamController {
  constructor(private camService: CamService) {}

  @Post()
  save(@Body() cam: Cam) {
    return this.camService.create(cam);
  }
  // mac address로 검색가능하게 만들기

  @Get('macAddr')
  findByMacAddr(@Body() macAddr: Cam) {
    return this.camService.findByMacAddr(macAddr);
  }

  @Get()
  findAll() {
    return this.camService.findAll();
  }

  @Delete('id')
  remove(@Param('id') id: number) {
    this.camService.remove(id);
    return `cam #${id} deleted!`;
  }

  // @Get('addr')
  // findByAddr(@Body() addr: Cam) {
  //   return this.camService.findByAddr(addr);
  // }
}
