import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { errorStrings, successStrings } from '../constants/constants';
import { DevicesController } from './devices.controller';
import { DevicesService } from './devices.service';

describe('DevicesController', () => {
  let controller: DevicesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DevicesController],
      providers: [DevicesService]
    }).compile();

    controller = module.get<DevicesController>(DevicesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return an array of devices', async () => {
    const devices = await (controller.getDevices());
    expect(typeof devices).toBe('object');
  });

  it('post should return error when body has not device object', async () => {
    expect(await (controller.createDevice(null))).toBe(errorStrings.invalidDevice);
    expect(await (controller.createDevice(undefined))).toBe(errorStrings.invalidDevice);
  });

  it('post should return error when id is already stored', async () => {
    const proofDevice = {
      id: "11111111111111",
      location: 222,
      mac_address: "19-59-asdada",
      connected: true,
      parent_location: 17,
      updated_at: "2018-02-27T13:21:29Z",
      signal: -97
    };
    expect(await (controller.createDevice(proofDevice))).toBe(errorStrings.deviceAlreadyStored);
  });

  it('should add one device per post operation', async () => {
    const storedDevicesLengthBeforePost = (await controller.getDevices()).length;
    const proofDevice = {
      id: randomUUID({ disableEntropyCache: true }),
      location: 222,
      mac_address: "19-59-asdada",
      connected: true,
      parent_location: 17,
      updated_at: "2018-02-27T13:21:29Z",
      signal: -97
    };
    await controller.createDevice(proofDevice);
    const storedDevicesLengthAfterPost = (await controller.getDevices()).length;
    expect(storedDevicesLengthAfterPost).toBe(storedDevicesLengthBeforePost + 1);
  });

  it('should return error on delete when deviceId is empty', async () => {
    expect(await (controller.deleteDevice(''))).toBe(errorStrings.emptyDeviceId);
  });

  it('should return error on delete when deviceId doesnt match to any device stored', async () => {
    expect(await (controller.deleteDevice('4444'))).toBe(errorStrings.deviceIdNotFound);
  });

  it('should return success on delete when deviceId is stored', async () => {
    const id = randomUUID({ disableEntropyCache: true });
    const proofDevice = {
      id,
      location: 222,
      mac_address: "19-59-asdada",
      connected: true,
      parent_location: 17,
      updated_at: "2018-02-27T13:21:29Z",
      signal: -97
    };
    await controller.createDevice(proofDevice);
    expect(await (controller.deleteDevice(id))).toBe(successStrings.successDelete);
  });

  it('should return error on put when deviceId or device body is empty', async () => {
    const proofDevice = {
      location: 222,
      mac_address: "19-59-asdada",
      connected: true,
      parent_location: 17,
      updated_at: "2018-02-27T13:21:29Z",
      signal: -97
    };
    expect(await (controller.updateDevice('', null))).toBe(errorStrings.emptyDeviceId);
    expect(await (controller.updateDevice('', proofDevice))).toBe(errorStrings.emptyDeviceId);
    expect(await (controller.updateDevice('11111', null))).toBe(errorStrings.updateDeviceEmpty);
  });

  it('should return error on put when deviceId doesnt match to any device stored', async () => {
    const proofDevice = {
      location: 222,
      mac_address: "19-59-asdada",
      connected: true,
      parent_location: 17,
      updated_at: "2018-02-27T13:21:29Z",
      signal: -97
    };
    expect(await (controller.updateDevice('4444', proofDevice))).toBe(errorStrings.deviceIdNotFound);
  });

  it('should return device on put when deviceId is found', async () => {
    const id = randomUUID({ disableEntropyCache: true });
    const proofDevice = {
      id,
      location: 222,
      mac_address: "19-59-asdada",
      connected: true,
      parent_location: 17,
      updated_at: "2018-02-27T13:21:29Z",
      signal: -97
    };
    const proofUpdateDevice = {
      location: 333,
      mac_address: "19-59-32-32-32",
      connected: true,
      parent_location: 17,
      updated_at: "2018-02-27T13:21:29Z",
      signal: -97
    };
    await controller.createDevice(proofDevice);
    expect(await (controller.updateDevice(id, proofUpdateDevice))).toMatchObject({id, ...proofUpdateDevice});
  });

});
