export enum CommandTLVType {
  "云台手动控制指令" = 0x50,
  "设置目标位置指令" = 0x51,
  "设备控制模式指令" = 0x52,
  "设置设备电源及IO 输出" = 0x53,
  "重启设备" = 0x54,
}

export function formatCommand(buffer: Buffer, id: CommandTLVType): Buffer {
  // 封装数据包
  const packet = Buffer.alloc(buffer.length + 2);
  packet.writeUInt8(id, 0);
  packet.writeUInt8(buffer.length, 1);
  buffer.copy(packet, 2);

  return packet;
}
