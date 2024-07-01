import crc16 from "crc/crc16xmodem";
import { CommandTLVType, formatCommand } from "./tools";

const PassThroughCommandMap = {
  开始温控: "02 10 00 28 00 01 02 00 66 34 A2",
  停止温控: "02 10 00 28 00 01 02 00 00 B4 88",
  读取状态: "02 03 00 28 00 0A 45 F6",
};

/**
 * 协议透传
 * 分成三个部分，1，设备类型(1字节)，2, payload(n字节), 3, 计数器(1字节)
 */

/**开始温控 */
export function start_control(): Buffer {
  // 首先创建buffer，长度为1+plyload.length+1
  const buffer = Buffer.alloc(1 + 11 + 1); // 总长度为 13 字节

  // 设置指令
  // 类型可选 1,2,3 1:飞控 2:云台 3:杂项
  buffer.writeUInt8(3, 0); // 写死为3

  // payload
  const payload = Buffer.from(
    PassThroughCommandMap["开始温控"].split(" ").map((v) => parseInt(v, 16))
  );
  payload.copy(buffer, 1);

  // 计数器 1
  buffer.writeUInt8(1, 12);

  return formatCommand(buffer, CommandTLVType.协议透传);
}

/**停止温控 */
export function stop_control(): Buffer {
  // 首先创建buffer，长度为1+plyload.length+1
  const buffer = Buffer.alloc(1 + 11 + 1); // 总长度为 13 字节

  // 设置指令
  // 类型可选 1,2,3 1:飞控 2:云台 3:杂项
  buffer.writeUInt8(3, 0); // 写死为3

  // payload
  const payload = Buffer.from(
    PassThroughCommandMap["停止温控"].split(" ").map((v) => parseInt(v, 16))
  );
  payload.copy(buffer, 1);

  // 计数器 1
  buffer.writeUInt8(1, 12);

  return formatCommand(buffer, CommandTLVType.协议透传);
}

export const modbusCrc16 = (buffer: any) => {
  let crc = 0xFFFF;
  let odd;

  for (let i = 0; i < buffer.length; i++) {
      crc = crc ^ buffer[i];

      for (let j = 0; j < 8; j++) {
          odd = crc & 0x0001;
          crc = crc >> 1;
          if (odd) {
              crc = crc ^ 0xA001;
          }
      }
  }

  return crc;
};

/**设定温度
 * @param temperature 温度值,℃
 */
export function set_temperature(temperature: number): Buffer {
  // 设定温度值（假设设定20℃，20*100，2000=07D0）
  // 最后两位为校验位crc，高字节在前，低字节在后
  // Tx：02 10 00 29 00 02 04 00 00 07 D0 3D 35
 
  const target = temperature * 100;
  // const payload = Buffer.alloc(11);
  // payload[0] = 0x02; // 设备地址
  // payload[1] = 0x10; // 功能码，表示预置多个寄存器
  // payload[2] = 0x00; // 寄存器起始地址高字节
  // payload[3] = 0x29; // 寄存器起始地址低字节
  // payload[4] = 0x00; // 寄存器数量高字节
  // payload[5] = 0x02; // 寄存器数量低字节
  // payload[6] = 0x04; // 字节计数
  // payload[7] = 0x00; // 温度值高字节
  // payload[8] = 0x00; // 温度值低字节
  // payload[9] = (target >> 8) & 0xff; // 温度值高字节
  // payload[10] = target & 0xff; // 温度值低字节
  const bufferPositive = Buffer.alloc(4); // Allocates 4 bytes (32 bits)
  bufferPositive.writeInt32BE(target, 0);

  const payload = Buffer.concat([Buffer.from([0x02, 0x10, 0x00, 0x29, 0x00, 0x02, 0x04]), bufferPositive]);
  // 计算CRC校验码
  const crc = modbusCrc16(payload);
  const crcBuffer = Buffer.alloc(2);
  crcBuffer.writeUInt16LE(crc, 0);

  // 组装完整命令
  const command = Buffer.alloc(1 + payload.length + crcBuffer.length + 1);
  command[0] = 0x03; // 设备类型固定为3
  payload.copy(command, 1); // 拷贝payload
  crcBuffer.copy(command, 1 + payload.length); // 拷贝CRC校验码
  command[command.length - 1] = 0x01; // 计数器固定为1
 

  
  // const _crc = modbusCrc16(_);
  // const _crcBuffer = Buffer.alloc(2);
  // _crcBuffer.writeUInt16LE(_crc, 0);

  // console.log("发送温度 = ", Buffer.concat([_, _crcBuffer]).toString('hex'));
  

  return formatCommand(command, CommandTLVType.协议透传);
}



export function set_sampling_method(value: number): Buffer{
  const buffer = Buffer.from([0x02, 0x10,0x00, 0x31, 0x00, 0x01,0x02, 0x00, parseInt(`0x0${value}`, 16)]);

  const crc = modbusCrc16(buffer);
  const crcBuffer = Buffer.alloc(2);
  crcBuffer.writeUInt16LE(crc, 0);
  
  return formatCommand(Buffer.concat([Buffer.from([0x03]),buffer, crcBuffer, Buffer.from([0x01])]), CommandTLVType.协议透传);
}

/**
 * 开始读取状态
 */
export function read_status(): Buffer {
  // 首先创建buffer，长度为1+plyload.length+1
  const buffer = Buffer.alloc(1 + 7 + 1); // 总长度为 9 字节

  // 设置指令
  // 类型可选 1,2,3 1:飞控 2:云台 3:杂项
  buffer.writeUInt8(3, 0); // 写死为3

  // payload
  const payload = Buffer.from(
    PassThroughCommandMap["读取状态"].split(" ").map((v) => parseInt(v, 16))
  );
  payload.copy(buffer, 1);

  // 计数器 1
  buffer.writeUInt8(1, 8);

  return formatCommand(buffer, CommandTLVType.协议透传);
}


