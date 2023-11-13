import { CommandTLVType, formatCommand } from "./tools";

/**
 * 重启设备
 */
export function reboot(): Buffer {
  const buffer = Buffer.alloc(2); // 总长度为 1 字节

  // 设置指令
  buffer.writeUInt8(1, 0);

  // 计数器 0
  buffer.writeUInt8(0, 1);

  return formatCommand(buffer, CommandTLVType.重启设备);
}
