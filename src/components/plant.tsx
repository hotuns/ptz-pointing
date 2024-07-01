import {
  Box,
  Card,
  Image,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
} from "@chakra-ui/react";
import PlantImg from "@/assets/p.png";
import PTZIcon from "@/assets/ptz.svg";

export function PlantCom(props: {
  controlCurrentAttitude: IControlAttitude;
  ptzCurrentAttitude: IPtzAttitude;
  ptzExpectAttitude: IPtzExpectlAttitude;
  devicePosition: Iposition;
  deviceStatus: IDeviceStatus;
}) {
  const {
    controlCurrentAttitude,
    ptzCurrentAttitude,
    ptzExpectAttitude,
    devicePosition,
    deviceStatus,
  } = props;

  const computedPtzAttitude = (plant: number, ptz: number) => {
    // ptz图标回正，所以需要加上45度
    const ptzA = ptz + 45;
    // ptz云台的是相对于飞控的角度，左偏为负数，右边为正数

    return plant + ptzA;
  };

  //   Bit[15:8]	Bit 15	Bit 14	Bit 13	Bit 12	Bit 11	Bit 10	Bit 9	Bit 8
  // IO状态	input ch2	input ch1	output ch6	output ch5	output ch4	output ch3	output ch2	output ch1
  // 解析电源IO状态, 返回的是八个bit位的状态
  // 可以用八个指示灯来表示，如果解析对应位为1, 则点亮灯即可
  const power_io_status_array = [
    "output ch1",
    "output ch2",
    "output ch3",
    "output ch4",
    "output ch5",
    "output ch6",
    "input ch1",
    "input ch2",
  ];
  const power_io_status_array_fill_result: any = power_io_status_array
    .map((item, index) => {
      return (deviceStatus.power_io_status & (1 << index)) > 0 ? 1 : 0;
    })
    .join("");

  return (
    <div className="w-full h-full flex flex-col">
      <Card className="w-full">
        <Box position={"relative"} className="">
          <Image
            id="plant"
            src={PlantImg}
            style={{
              transform: `rotate(${controlCurrentAttitude.yaw}deg)`,
            }}
          />
          <Image
            id="ptz"
            src={PTZIcon}
            style={{
              transform: `rotate(${computedPtzAttitude(
                controlCurrentAttitude.yaw,
                ptzCurrentAttitude.yaw
              )}deg)`,
            }}
          />
        </Box>
      </Card>

      <Card className="w-full">
        <Box className="flex w-full">
          <Box className="w-full text-center">
            <Text fontSize="md">飞控</Text>
            <Box>
              <Text fontSize="xs">
                pitch: {controlCurrentAttitude.pitch.toFixed(2)}
              </Text>

              <Text fontSize="xs">
                roll: {controlCurrentAttitude.roll.toFixed(2)}
              </Text>

              <Text fontSize="xs">
                yaw: {controlCurrentAttitude.yaw.toFixed(2)}
              </Text>
            </Box>
          </Box>

          <Box className="w-full text-center">
            <Text fontSize="md">云台</Text>
            <Box>
              <Text fontSize="xs">
                pitch: {ptzCurrentAttitude.pitch.toFixed(2)}
              </Text>

              <Text fontSize="xs">
                roll: {ptzCurrentAttitude.roll.toFixed(2)}
              </Text>

              <Text fontSize="xs">
                yaw: {ptzCurrentAttitude.yaw.toFixed(2)}
              </Text>
            </Box>
          </Box>
        </Box>

        <div className="w-full flex flex-col">
          <Box textAlign={"center"}>{power_io_status_array_fill_result}</Box>
          <Box className="flex space-x-4" justifyContent={"space-between"}>
            <Stat textAlign={"center"}>
              <StatNumber>
                {(deviceStatus.temperature / 100).toFixed(2)}
              </StatNumber>
              <StatHelpText>温度</StatHelpText>
            </Stat>

            <Stat textAlign={"center"}>
              <StatNumber>
                {(deviceStatus.main_voltage / 100).toFixed(2)}
              </StatNumber>
              <StatHelpText>主电压</StatHelpText>
            </Stat>

            <Stat textAlign={"center"}>
              <StatNumber>
                {(deviceStatus.sys_voltage / 100).toFixed(2)}
              </StatNumber>
              <StatHelpText>系统电压</StatHelpText>
            </Stat>

            <Stat textAlign={"center"}>
              <StatNumber>
                {(deviceStatus.chip_voltage / 100).toFixed(2)}
              </StatNumber>
              <StatHelpText>芯片电压</StatHelpText>
            </Stat>
          </Box>
        </div>
      </Card>
    </div>
  );
}
