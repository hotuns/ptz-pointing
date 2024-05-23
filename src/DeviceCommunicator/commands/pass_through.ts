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

/**设定温度
 * @param temperature 温度值,℃
 */
export function set_temperature(temperature: number): Buffer {
  // 设定温度值（假设设定20℃，20*100，2000=07D0）
  // 最后两位为校验位crc，高字节在前，低字节在后
  // Tx：02 10 00 29 00 02 04 00 00 07 D0 3D 35

  const target = temperature * 100;
  const payload = Buffer.alloc(11);
  payload[0] = 0x02; // 设备地址
  payload[1] = 0x10; // 功能码，表示预置多个寄存器
  payload[2] = 0x00; // 寄存器起始地址高字节
  payload[3] = 0x29; // 寄存器起始地址低字节
  payload[4] = 0x00; // 寄存器数量高字节
  payload[5] = 0x02; // 寄存器数量低字节
  payload[6] = 0x04; // 字节计数
  payload[7] = (target >> 8) & 0xff; // 温度值高字节
  payload[8] = target & 0xff; // 温度值低字节

  // 计算CRC校验码
  const crc = crc16(payload);
  const crcBuffer = Buffer.alloc(2);
  crcBuffer.writeUInt16LE(crc, 0);

  // 组装完整命令
  const command = Buffer.alloc(1 + payload.length + crcBuffer.length + 1);
  command[0] = 0x03; // 设备类型固定为3
  payload.copy(command, 1); // 拷贝payload
  crcBuffer.copy(command, 1 + payload.length); // 拷贝CRC校验码
  command[command.length - 1] = 0x01; // 计数器固定为1

  return command;
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
