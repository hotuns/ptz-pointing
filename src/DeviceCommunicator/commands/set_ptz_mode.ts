import { CommandTLVType, formatCommand } from "./tools";

/**
 * 设置云台模式
 */
export function set_ptz_mode(mode: number): Buffer {
  console.log("[set_ptz_mode]", mode);
  // 总长度为 2 字节
  const buffer = Buffer.alloc(2);

  // 设置指令
  buffer.writeUInt8(mode, 0);

  // 计数器 0
  buffer.writeUInt8(0, 1);

  return formatCommand(buffer, CommandTLVType.设备控制模式指令);
}
