import { CommandTLVType, formatCommand } from "./tools";

/**
 * 设置云台模式
 */
export function set_ptz_mode(mode: number): Buffer {
  const buffer = Buffer.alloc(2); // 总长度为 1 字节

  // 设置指令
  buffer.writeUInt8(1, mode);

  // 计数器 0
  buffer.writeUInt8(0, 1);

  return formatCommand(buffer, CommandTLVType.设备控制模式指令);
}
