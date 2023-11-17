import { Transform } from "stream";
import crc16 from "crc/crc16xmodem";

export class CustomParser extends Transform {
  private buffer: Buffer = Buffer.alloc(0);

  _transform(chunk: Buffer, encoding: string, cb: Function) {
    // 将新的数据块追加到现有缓冲区
    this.buffer = Buffer.concat([this.buffer, chunk]);

    // 持续处理缓冲区中的所有完整帧
    while (this.buffer.length >= 3) {
      // 检查帧头
      if (this.buffer[0] !== 0xaa || this.buffer[1] !== 0x90) {
        console.warn("Invalid frame header. Frame dropped.");
        this.buffer = this.buffer.slice(1); // 舍弃无效的字节
        continue;
      }

      // 提取数据包长度
      const packetLength = this.buffer[2];

      // 检查缓冲区长度是否足以包含完整的帧
      if (this.buffer.length < packetLength + 3) {
        // 缓冲区中没有足够的数据，等待更多数据
        break;
      }

      // 提取完整的帧
      const frame = this.buffer.slice(0, packetLength + 3);

      // 计算并验证CRC
      const receivedCRC = frame.readUInt16LE(frame.length - 2);
      const frameWithoutCRC = frame.slice(0, frame.length - 2);
      const calculatedCRC = crc16(frameWithoutCRC);

      // CRC校验
      if (receivedCRC === calculatedCRC) {
        // CRC匹配，将数据（去除帧头和CRC）发送到下一个流
        this.push(frameWithoutCRC.slice(3));
      } else {
        // CRC不匹配，记录警告
        console.warn("CRC mismatch. Frame dropped.", frameWithoutCRC);
      }

      // 从缓冲区中移除已处理的帧
      this.buffer = this.buffer.slice(packetLength + 3);
    }

    cb();
  }
}
