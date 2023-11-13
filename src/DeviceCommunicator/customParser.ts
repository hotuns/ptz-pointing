import { Transform } from "stream";
import crc16 from "crc/crc16xmodem";

export class CustomParser extends Transform {
  private buffer: Buffer = Buffer.alloc(0);
  private expectedLength: number | null = null;

  _transform(chunk: Buffer, encoding: string, cb: Function) {
    this.buffer = Buffer.concat([this.buffer, chunk]);

    // Check for frame header
    while (
      this.buffer.length >= 3 &&
      this.buffer[0] === 0xaa &&
      this.buffer[1] === 0x90
    ) {
      // Extract packet length
      const packetLength = this.buffer[2];

      // Check if we have the full packet in buffer
      if (this.buffer.length >= packetLength) {
        const frame = this.buffer.slice(0, packetLength + 3);

        // Extract CRC from the frame
        const receivedCRC = frame.readUInt16LE(frame.length - 2);
        const frameWithoutCRC = frame.slice(0, frame.length - 2);
        const calculatedCRC = crc16(frameWithoutCRC);

        // If CRC matches, push the frame for further processing
        if (receivedCRC === calculatedCRC) {
          this.push(frameWithoutCRC.slice(3));
        } else {
          console.warn("CRC mismatch. Frame dropped.", frameWithoutCRC);
          // Skip the problematic frame
          this.buffer = this.buffer.slice(packetLength + 3);
        }

        // Remove processed frame from buffer
        this.buffer = this.buffer.slice(packetLength + 3);
      } else {
        // If not, break and wait for more data
        break;
      }
    }

    cb();
  }
}
