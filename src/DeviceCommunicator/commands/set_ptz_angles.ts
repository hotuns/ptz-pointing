import { CommandTLVType, formatCommand } from "./tools";

enum ControlCommand {
  SetTiltAngle = 1,
  ResetToCenter = 2,
}

interface TiltAngles {
  pitch: number;
  roll: number;
  yaw: number;
}

/**
 * 控制云台角度
 * @param resetToCenter 是否重置云台到中心位置
 * @param angles 云台期望角度
 * @param counter 计数器
 */
export function set_ptz_angles(
  resetToCenter: Boolean,
  angles?: TiltAngles,
  counter?: number
): Buffer {
  const buffer = Buffer.alloc(14); // 总长度为 14 字节

  // 设置指令
  buffer.writeUInt8(
    resetToCenter ? ControlCommand.ResetToCenter : ControlCommand.SetTiltAngle,
    0
  );

  if (!resetToCenter && angles) {
    buffer.writeFloatLE(angles.pitch, 1);
    buffer.writeFloatLE(angles.roll, 5);
    buffer.writeFloatLE(angles.yaw, 9);
  }

  // 如果提供了计数器，则设置计数器的值，否则使用默认值 0
  buffer.writeUInt8(counter || 0, 13);

  return formatCommand(buffer, CommandTLVType.云台手动控制指令);
}
