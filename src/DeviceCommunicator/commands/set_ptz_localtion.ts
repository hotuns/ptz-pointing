import { CommandTLVType, formatCommand } from "./tools";

interface TargetLocation {
  latitude: number; // in 1e-7 degrees
  longitude: number; // in 1e-7 degrees
  altitude: number; // in mm
}

/**
 * 设置目标位置
 * @param location 目标位置
 * @param counter 计数器
 */
export function set_ptz_localtion(
  location: TargetLocation,
  counter?: number
): Buffer {
  const buffer = Buffer.alloc(13); // 总长度为 13 字节

  // 经纬度都乘以 1e7，海拔高度单位为 mm
  location.longitude *= 1e7;
  location.latitude *= 1e7;
  location.altitude *= 1000;

  // 设置纬度、经度和海拔高度
  buffer.writeInt32LE(location.latitude, 0);
  buffer.writeInt32LE(location.longitude, 4);
  buffer.writeInt32LE(location.altitude, 8);

  // 如果提供了计数器，则设置计数器的值，否则使用默认值 0
  buffer.writeUInt8(counter || 0, 12);

  return formatCommand(buffer, CommandTLVType.设置目标位置指令);
}
