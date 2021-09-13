import { Injectable } from '@nestjs/common';
import fs from 'fs';
import { errorStrings, successStrings } from '../constants/constants';

@Injectable()
export class DevicesService {
  async getDevices(): Promise<IDevice[]> {
    return await this.readDevicesFile();
  }


  async createDevice(device: IDevice): Promise<string> {
    if (!device || !device.id) return errorStrings.invalidDevice;
    const storedDevices = await this.readDevicesFile();
    if (storedDevices.findIndex(deviceStored => deviceStored.id === device.id) !== -1) return errorStrings.deviceAlreadyStored;
    storedDevices.push(device);
    await this.writeOnDevicesFile(storedDevices);
    return successStrings.successCreation;
  }

  async updateDevice(deviceId: string, updatedData: IUpdateDevice): Promise<IDevice | string> {
    if (!deviceId.length) return errorStrings.emptyDeviceId;
    if (!updatedData || !Object.values(updatedData)) return errorStrings.updateDeviceEmpty;
    const storedDevices = await this.readDevicesFile();
    const deviceToUpdateIndex = storedDevices.findIndex(device => device.id === deviceId);
    if (deviceToUpdateIndex === -1) return errorStrings.deviceIdNotFound;
    storedDevices[deviceToUpdateIndex] = { ...storedDevices[deviceToUpdateIndex], ...updatedData };
    await this.writeOnDevicesFile(storedDevices);
    return storedDevices[deviceToUpdateIndex];
  }

  async deleteDevice(deviceId: string): Promise<string> {
    if (!deviceId.length) return errorStrings.emptyDeviceId;
    const storedDevices = await this.readDevicesFile();
    const deviceToDeleteIndex = storedDevices.findIndex(device => device.id === deviceId);
    if (deviceToDeleteIndex === -1) return errorStrings.deviceIdNotFound;
    storedDevices.splice(deviceToDeleteIndex, 1);
    await this.writeOnDevicesFile(storedDevices);
    return successStrings.successDelete;
  }

  async readDevicesFile(): Promise<IDevice[]> {
    return await new Promise((resolve, reject) => {
      fs.readFile('./data/devices.json', 'utf-8', (err, jsonSting) => {
        if (err) {
          reject(err);
        }
        try {
          const devices = JSON.parse(jsonSting);
          resolve(devices);
        } catch (err) {
          reject(err);
        }
      })
    });
  }

  async writeOnDevicesFile(data: IDevice[]): Promise<boolean> {
    return new Promise((resolve, reject) =>
      fs.writeFile('./data/devices.json', JSON.stringify(data), err => {
        if (err) {
          reject(err)
        } else {
          resolve(true)
        }
      })
    )
  }

}
