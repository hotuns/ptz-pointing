import { SerialPort } from "serialport";
import { SerialPortStream } from "@serialport/stream";
import { MockBinding, MockBindingInterface } from "@serialport/binding-mock";
import { CustomParser } from "./customParser";
import crc16 from "crc/crc16xmodem";
import log from "electron-log/renderer";
import dgram  from 'dgram';
const server = dgram.createSocket('udp4');
const FORWARD_PORT = 54321;
const FORWARD_HOST = '255.255.255.255';
server.bind(54320);

export enum TLVType {
  "飞控当前姿态角" = 0x01,
  "设备经纬高" = 0x02,
  "云台当前姿态角" = 0x11,
  "云台期望姿态角" = 0x21,
  "目标位置的设置值" = 0x31,
  "设备状态" = 0x32,
  "协议透传接收" = 0x71,
}

export interface TLVPacket {
  id: TLVType;
  name: string;
  length: number;
  data: Buffer;
}

export class DeviceCommunicator {
  private port: SerialPortStream<MockBindingInterface> | SerialPort;
  private parser: any;
  receiveCount: number;
  sendCount: number;
  isOpen: boolean = false;

  constructor(
    portPath: string,
    onDataReceived: (data: any) => void,
    mock: boolean = false
  ) {
    if (mock) {
      MockBinding.createPort("/dev/ROBOT", { echo: true, record: true });

      this.port = new SerialPortStream({
        binding: MockBinding,
        path: "/dev/ROBOT",
        baudRate: 115200,
        dataBits: 8,
        parity: "none",
        stopBits: 1,
      });

      this.startMockData();
    } else {
      this.port = new SerialPort({
        path: portPath,
        baudRate: 115200,
        dataBits: 8,
        parity: "none",
        stopBits: 1,
        autoOpen: false,
      });
    }

    this.receiveCount = 0;
    this.sendCount = 0;

    this.parser = this.port.pipe(new CustomParser());

    this.parser.on("data", (data: Buffer) => {
      log.info("Receive:", data.toString("hex"));

      let TLV_list = this.parseTLV(data);
      let parsed_TLV_list = TLV_list.map((packet) => {
        return this.handleTLV(packet)
      });

      let result = parsed_TLV_list.filter((x) => x !== undefined);
      onDataReceived(result);
    });
  }

  static list() {
    return SerialPort.list();
  }

  public startMockData() {
    
    const mocklist = [
      // `AA 90 1E 71 1A 03 02 03 14 00 00 00 00 13 88 00 02 00 00 0D 76 00 00 0D 82 00 00 0C 1B D3 C8 97 51 F2`,
      // `AA 90 1E 71 1A 03 02 03 14 00 00 00 00 13 88 00 01 00 00 0D 76 00 00 0D 82 00 00 0C 1B D3 C8 97 51 F2`,
      // `AA 90 1E 71 1A 03 02 03 14 00 00 00 00 13 88 00 03 00 00 0D 76 00 00 0D 82 00 00 0C 1B D3 C8 97 51 F2`
      "AA 90 32 01 0D 66 66 E6 BF CD CC 4C BE 66 66 64 43 F1 02 0E 02 10 80 71 0F 00 0D AC 3B F8 3E 1E 00 F1 21 0F 84 C9 62 42 00 00 00 00 30 B2 F6 41 03 00 F1 52 2C",
      "AA 90 32 01 0D 00 00 00 00 00 00 00 00 00 00 00 00 40 02 0E 00 00 00 00 00 00 00 00 00 00 00 00 00 40 21 0F 00 00 00 00 00 00 00 00 00 00 00 00 03 00 40 5C 0C AA 90 32 01 0D 00 00 00 00 00 00 00 00 00 00 00 00 41 02 0E 00 00 00 00 00 00 00 00 00 00 00 00 00 41 21 0F 00 00 00 00 00 00 00 00 00 00 00 00 03 00 41 69 70 AA 90 32 01 0D 00 00 00 00 00 00 00 00 00 00 00 00 42 02 0E 00 00 00 00 00 00 00 00 00 00 00 00 00 42 21 0F 00 00 00 00 00 00 00 00 00 00 00 00 03 00 42 36 F4 AA 90 32 01 0D 00 00 00 00 00 00 00 00 00 00 00 00 43 02 0E 00 00 00 00 00 00 00 00 00 00 00 00 00 43 21 0F 00 00 00 00 00 00 00 00 00 00 00 00 03 00 43 03 88 AA 90 32 01 0D 00 00 00 00 00 00 00 00 00 00 00 00 44 02 0E 00 00 00 00 00 00 00 00 00 00 00 00 00 44 21 0F 00 00 00 00 00 00 00 00 00 00 00 00 03 00 44 A9 EC AA 90 32 01 0D 00 00 00 00 00 00 00 00 00 00 00 00 45 02 0E 00 00 00 00 00 00 00 00 00 00 00 00 00 45 21 0F 00 00 00 00 00 00 00 00 00 00 00 00 03 00 45 9C 90 AA 90 32 01 0D 00 00 00 00 00 00 00 00 00 00 00 00 46 02 0E 00 00 00 00 00 00 00 00 00 00 00 00 00 46 21 0F 00 00 00 00 00 00 00 00 00 00 00 00 03 00 46 C3 14 AA 90 32 01 0D 00 00 00 00 00 00 00 00 00 00 00 00 47 02 0E 00 00 00 00 00 00 00 00 00 00 00 00 00 47 21 0F 00 00 00 00 00 00 00 00 00 00 00 00 03 00 47 F6 68 AA 90 1E 31 0D A0 2A 71 0F 42 19 AA 3B 00 00 00 00 A7 32 0B 95 01 56 12 F4 01 4A 01 00 C0 A7 AD 86 AA 90 32 01 0D 00 00 00 00 00 00 00 00 00 00 00 00 48 02 0E 00 00 00 00 00 00 00 00 00 00 00 00 00 48 21 0F 00 00 00 00 00 00 00 00 00 00 00 00 03 00 48 97 DD AA 90 32 01 0D 00 00 00 00 00 00 00 00 00 00 00 00 49 02 0E 00 00 00 00 00 00 00 00 00 00 00 00 00 49 21 0F 00 00 00 00 00 00 00 00 00 00 00 00 03 00 49 A2 A1 AA 90 32 01 0D 00 00 00 00 00 00 00 00 00 00 00 00 4A 02 0E 00 00 00 00 00 00 00 00 00 00 00 00 00 4A 21 0F 00 00 00 00 00 00 00 00 00 00 00 00 03 00 4A FD 25 AA 90 32 01 0D 00 00 00 00 00 00 00 00 00 00 00 00 4B 02 0E 00 00 00 00 00 00 00 00 00 00 00 00 00 4B 21 0F 00 00 00 00 00 00 00 00 00 00 00 00 03 00 4B C8 59 AA 90 32 01 0D 00 00 00 00 00 00 00 00 00",
      "AA 90 1D 71 19 03 02 03 14 00 00 00 00 01 23 00 03 FF FE F7 B9 FF FE DC 93 FF FE 9E 0F 65 B2 57 FC",
      "AA 90 1D 71 19 03 02 03 14 00 00 00 00 13 88 00 01 00 00 0A E7 00 00 0A 98 00 00 0B 06 59 C8 57 FC",
    ];

    setInterval(() => {
      const index = Math.floor(Math.random() * mocklist.length);
      console.log("Send:", mocklist[index], `count: ${this.sendCount++}`);
      const data = mocklist[index].split(" ").map((x) => parseInt(x, 16));
      // console.log("发送mock数据 = ", data);
      server.setBroadcast(true); 
      server.send(Buffer.from(data), FORWARD_PORT, FORWARD_HOST, (err) => {
        
        if (err) {
          console.error(err);
        }
      });
      // @ts-ignore
      this.port.port?.emitData(Buffer.from(data));
    }, 1000);
  }

  public open(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.port.open((err) => {
        if (err) {
          reject(err);
        } else {
          this.isOpen = true;
          resolve();
        }
      });
    });
  }

  public close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.port.close((err) => {
        if (err) {
          reject(err);
        } else {
          this.isOpen = false;
          resolve();
        }
      });
    });
  }

  public send(data: Buffer): Promise<void> {
    // 加工帧
    const frame = Buffer.alloc(3 + data.length + 2); // 总长度为 3 + data.length + 2 字节
    frame.writeUInt8(0xaa, 0); // 帧头
    frame.writeUInt8(0x90, 1); // 帧头
    frame.writeUInt8(data.length + 2, 2); // 数据长度
    data.copy(frame, 3); // 数据内容

    // CRC 校验
    const crc = crc16(frame.slice(0, frame.length - 2));

    frame.writeUInt16LE(crc, frame.length - 2); // CRC 校验

    log.info("Send", frame.toString("hex"));

    return new Promise((resolve, reject) => {
      this.port.write(frame, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  // 工具函数
  public parseTLV(frame: Buffer): TLVPacket[] {
    let offset = 0;
    const packets: TLVPacket[] = [];

    while (offset < frame.length) {
      const id = frame[offset];
      const length = frame[offset + 1];
      const data = frame.slice(offset + 2, offset + 2 + length);

      const name: string = TLVType[id] || "未知";

      packets.push({ id, name, length, data });

      offset += 2 + length;
    }

    return packets;
  }

  public handleTLV(packet: TLVPacket) {
    const data = packet.data;
    server.setBroadcast(true); 
   
   console.log('接收 = ', data);
   
    let _json = null;
    let _jsonString = "";
    const id = packet.id;
    switch (id) {
      case TLVType.飞控当前姿态角:
        let contorlAttitude: IControlAttitude = {
          pitch: data.readFloatLE(0), // 从第0个字节开始读取4个字节为俯仰角
          roll: data.readFloatLE(4), // 从第4个字节开始读取4个字节为滚转角
          yaw: data.readFloatLE(8), // 从第8个字节开始读取4个字节为航向角
          count: data.readUInt8(12), // 从第12个字节开始读取1个字节为计数器
        };
        _json = {
          id: TLVType.飞控当前姿态角,
          string: "飞控当前姿态角",
          value: contorlAttitude,
        };
        _jsonString = `{"id": "${TLVType.飞控当前姿态角}", "string": "飞控当前姿态角", "value": {"pitch": ${contorlAttitude.pitch}, "roll": ${contorlAttitude.roll}, "yaw": ${contorlAttitude.yaw}, "count": ${contorlAttitude.count}}}`;
        break;
      case TLVType.云台当前姿态角:
        let ptzAttitude: IPtzAttitude = {
          pitch: data.readFloatLE(0), // 从第0个字节开始读取4个字节为俯仰角
          roll: data.readFloatLE(4), // 从第4个字节开始读取4个字节为滚转角
          yaw: data.readFloatLE(8), // 从第8个字节开始读取4个字节为航向角
          count: data.readUInt8(12), // 从第12个字节开始读取1个字节为计数器
        };
        _json = {
          id: TLVType.云台当前姿态角,
          string: "云台当前姿态角",
          value: ptzAttitude,
        };
        _jsonString = `{"id": "${TLVType.云台当前姿态角}", "string": "云台当前姿态角", "value": "${ptzAttitude}"}`;
        break;
      case TLVType.云台期望姿态角:
        let PtzExpectlAttitude: IPtzExpectlAttitude = {
          pitch: data.readFloatLE(0), // 从第0个字节开始读取4个字节为俯仰角
          roll: data.readFloatLE(4), // 从第4个字节开始读取4个字节为滚转角
          yaw: data.readFloatLE(8), // 从第8个字节开始读取4个字节为航向角
          mode: data.readUInt8(12), // 从第12个字节开始读取1个字节为设备运行模式
          status: data.readUInt8(13), // 从第13个字节开始读取1个字节为设备运行状态
          count: data.readUInt8(14), // 从第14个字节开始读取1个字节为计数器
        };

        _json = {
          id: TLVType.云台期望姿态角,
          string: "云台期望姿态角",
          value: PtzExpectlAttitude,
        };
        _jsonString = `{"id": "${TLVType.云台期望姿态角}", "string": "云台期望姿态角", "value": "${PtzExpectlAttitude}"}`;
        break;
      case TLVType.设备经纬高:
        let devPosition: Iposition = {
          mode: data.readUInt8(0), // 从第0个字节开始读取1个字节为定位模式
          lng: data.readInt32LE(1) / 1e7, // 从第1个字节开始读取4个字节为经度，/ 1e7
          lat: data.readInt32LE(5) / 1e7, // 从第5个字节开始读取4个字节为纬度
          alt: data.readInt32LE(9) / 1e3, // 从第9个字节开始读取4个字节为高度
          count: data.readUInt8(13), // 从第13个字节开始读取1个字节为计数器
        };

        _json = {
          id: TLVType.设备经纬高,
          string: "设备经纬高",
          value: devPosition,
        };
        _jsonString = `{"id": "${TLVType.设备经纬高}", "string": "设备经纬高", "value": "${devPosition}"}`;
        break;
      case TLVType.目标位置的设置值:
        let targetPosition = {
          lng: data.readInt32LE(0) / 1e7, // 从第1个字节开始读取4个字节为经度，/ 1e7
          lat: data.readInt32LE(4) / 1e7, // 从第5个字节开始读取4个字节为纬度
          alt: data.readInt32LE(8) / 1e3, // 从第9个字节开始读取4个字节为高度
          count: data.readUInt8(12), // 从第13个字节开始读取1个字节为计数器
        };

        _json = {
          id: TLVType.目标位置的设置值,
          string: "目标位置的设置值",
          value: targetPosition,
        };
        _jsonString = `{"id": "${TLVType.目标位置的设置值}", "string": "目标位置的设置值", "value": "${targetPosition}"}`;
        break;
      case TLVType.设备状态:
        let devStatus: IDeviceStatus = {
          temperature: data.readInt16LE(0), // 从第0个字节开始读取2个字节为温度
          main_voltage: data.readUInt16LE(2), // 从第2个字节开始读取2个字节为主电压
          sys_voltage: data.readUInt16LE(4), // 从第4个字节开始读取2个字节为系统电压
          chip_voltage: data.readUInt16LE(6), // 从第6个字节开始读取2个字节为芯片电压
          power_io_status: data.readUInt16LE(8), // 从第8个字节开始读取2个字节为电源及IO状态
          count: data.readUInt8(10), // 从第10个字节开始读取1个字节为计数器
        };
        _json = {
          id: TLVType.设备状态,
          string: "设备状态",
          value: devStatus,
        };
        _jsonString = `{"id": "${TLVType.设备状态}", "string": "设备状态", "value": "${devStatus}"}`;
        break;
      case TLVType.协议透传接收:
        // 第1个字节为类型，1:飞控 2:云台 3:杂项
        // 第2位到结束为payload
        let type = data.readUInt8(0);
        let payload = data.slice(1);

        let payloadData = {
          // 温控开关
          switch: false,
          // 温度1
          temperature1: 0,
          // 温度2
          temperature2: 0,
          // 温度3
          temperature3: 0,
          // 采样方式
          method: 0,
        };
        // 解析payload
        // 读寄存器
        // 0028 温控开关
        // 0029-0030 设定温度
        // 0031 设定采样方式
        // 0032-0033 温度1   0034-0035 温度2   0036-0037 温度3
        // ex：02 03 14 00 00 00 00 01 23 00 03 FF FE F7 B9 FF FE DC 93 FF FE 9E 0F 65 B2
        // （0066温控开00 00温控关；0x0123当前设定值为291/100=2.91℃  ；
        // 0x00 03 采样方式为3； 0xFFFF FF12 =-238,-2.38℃ 0x0000 0C49=3145，温度为31.45）

        // 校验payload是否完整
        // 第三位是字节数
        if (payload.length !== 3 + payload.readUInt8(2) + 2) {
          console.warn("Payload length error");

          let passThrough: IPassThrough = {
            type,
            data: payloadData,
          };

          _json = {
            id: TLVType.协议透传接收,
            string: "协议透传接收",
            value: passThrough,
          };
          _jsonString = `{"id": "${TLVType.协议透传接收}", "string": "协议透传接收", "value": "${passThrough}"}`;
          break;
        }
        
        let payload_payload = payload.slice(3, payload.length - 2);
        
        // 温控开关
        if (payload_payload.readUInt16LE(0) === 0x0066) {
          payloadData.switch = true;
        }

        // 设定温度

        payloadData.temperature1 = payload_payload.readUInt32BE(8) / 100;
        payloadData.temperature2 = payload_payload.readUInt32BE(12) / 100;
        payloadData.temperature3 = payload_payload.readUInt32BE(16) / 100;

        // 采样方式
        payloadData.method = payload_payload.readUInt16BE(6);
        
        let passThrough: IPassThrough = {
          type,
          data: payloadData,
        };

        _json = {
          id: TLVType.协议透传接收,
          string: "协议透传接收",
          value: passThrough,
        };
        _jsonString = `{"id": "${TLVType.协议透传接收}", "string": "协议透传接收", "value": "${passThrough}"}`;
        break
      default:
        console.warn(`Unknown TLV ID: ${packet.id}`);
        return undefined;
    }
    server.send(JSON.stringify(_json), FORWARD_PORT, FORWARD_HOST, (err) => {
      if (err) {
        console.error(err);
      }
    });
    return _json;
  }
}
