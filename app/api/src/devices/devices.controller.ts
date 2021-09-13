import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { DevicesService } from './devices.service';

@Controller('devices')
export class DevicesController {

    constructor(private readonly devicesService: DevicesService) { }

    @Get()
    async getDevices(): Promise<IDevice[]> {
        return await this.devicesService.getDevices();
    }

    @Post()
    async createDevice(@Body() device: IDevice): Promise<string> {
        return await this.devicesService.createDevice(device);
    }

    @Delete(':id')
    async deleteDevice(@Param('id') deviceId: string): Promise<string> {
        return await this.devicesService.deleteDevice(deviceId);
    }

    @Put(':id')
    async updateDevice(
        @Param('id') deviceId: string,
        @Body() device: IUpdateDevice): Promise<IDevice | string> {
        return await this.devicesService.updateDevice(deviceId, device);
    }

}
