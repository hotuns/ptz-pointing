import {
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatGroup,
  Box,
  Flex,
  Card,
} from "@chakra-ui/react";
import { Text } from "@chakra-ui/react";
import {
  position_mode_map,
  ptz_run_mode_map,
  ptz_status_map,
} from "../../utils";

export const AppStatus = (props: {
  controlCurrentAttitude: IControlAttitude;
  ptzCurrentAttitude: IPtzAttitude;
  ptzExpectAttitude: IPtzExpectlAttitude;
  devicePosition: Iposition;
  deviceStatus: IDeviceStatus;
}) => {
  const {
    controlCurrentAttitude,
    ptzCurrentAttitude,
    ptzExpectAttitude,
    devicePosition,
    deviceStatus,
  } = props;
  return (
    <Flex flexDirection={'column'} className="w-full space-y-2 ">
      <Card p='2'>
        <Box>
          <Text>飞控当前姿态角</Text>
        </Box>
        <Box className="flex space-x-4">
          <Stat>
            <StatLabel>pitch</StatLabel>
            <StatNumber>{controlCurrentAttitude.pitch.toFixed(2)}</StatNumber>
            <StatHelpText>俯仰角</StatHelpText>
          </Stat>

          <Stat>
            <StatLabel>roll</StatLabel>
            <StatNumber>{controlCurrentAttitude.roll.toFixed(2)}</StatNumber>
            <StatHelpText>滚转角</StatHelpText>
          </Stat>

          <Stat>
            <StatLabel>yaw</StatLabel>
            <StatNumber>{controlCurrentAttitude.yaw.toFixed(2)}</StatNumber>
            <StatHelpText>航向角</StatHelpText>
          </Stat>

          <Stat>
            <StatLabel>count</StatLabel>
            <StatNumber>{controlCurrentAttitude.count}</StatNumber>
            <StatHelpText>计数器</StatHelpText>
          </Stat>
        </Box>
      </Card>

      <Card p='2'>
        <Box>
          <Text>云台当前姿态角</Text>
        </Box>
        <Box className="flex space-x-4">
          <Stat>
            <StatLabel>pitch</StatLabel>
            <StatNumber>{ptzCurrentAttitude.pitch.toFixed(2)}</StatNumber>
            <StatHelpText>俯仰角</StatHelpText>
          </Stat>

          <Stat>
            <StatLabel>roll</StatLabel>
            <StatNumber>{ptzCurrentAttitude.roll.toFixed(2)}</StatNumber>
            <StatHelpText>滚转角</StatHelpText>
          </Stat>

          <Stat>
            <StatLabel>yaw</StatLabel>
            <StatNumber>{ptzCurrentAttitude.yaw.toFixed(2)}</StatNumber>
            <StatHelpText>航向角</StatHelpText>
          </Stat>

          <Stat>
            <StatLabel>count</StatLabel>
            <StatNumber>{controlCurrentAttitude.count}</StatNumber>
            <StatHelpText>计数器</StatHelpText>
          </Stat>
        </Box>
      </Card>

      <Card p='2'>
        <Box>
          <Text>云台期望姿态角</Text>
        </Box>
        <Box className="flex space-x-4">
          <Stat>
            <StatLabel>pitch</StatLabel>
            <StatNumber>{ptzExpectAttitude.pitch.toFixed(2)}</StatNumber>
            <StatHelpText>俯仰角</StatHelpText>
          </Stat>

          <Stat>
            <StatLabel>roll</StatLabel>
            <StatNumber>{ptzExpectAttitude.roll.toFixed(2)}</StatNumber>
            <StatHelpText>滚转角</StatHelpText>
          </Stat>

          <Stat>
            <StatLabel>yaw</StatLabel>
            <StatNumber>{ptzExpectAttitude.yaw.toFixed(2)}</StatNumber>
            <StatHelpText>航向角</StatHelpText>
          </Stat>

          <Stat>
            <StatLabel>mode</StatLabel>
            <StatNumber lineHeight="36px" fontSize="md">
              {ptz_run_mode_map[ptzExpectAttitude.mode]}
            </StatNumber>
            <StatHelpText>运行模式</StatHelpText>
          </Stat>

          <Stat>
            <StatLabel>status</StatLabel>
            <StatNumber lineHeight="36px" fontSize="md">
              {ptz_status_map[ptzExpectAttitude.status]}
            </StatNumber>
            <StatHelpText>运行状态</StatHelpText>
          </Stat>

          <Stat>
            <StatLabel>count</StatLabel>
            <StatNumber>{controlCurrentAttitude.count}</StatNumber>
            <StatHelpText>计数器</StatHelpText>
          </Stat>
        </Box>
      </Card>

      <Card p='2'>
        <Box>
          <Text>设备经纬高</Text>
        </Box>
        <Box className="flex space-x-4">
          <Stat>
            <StatLabel>lng</StatLabel>
            <StatNumber>{devicePosition.lng.toFixed(4)}</StatNumber>
            <StatHelpText>经度</StatHelpText>
          </Stat>

          <Stat>
            <StatLabel>lat</StatLabel>
            <StatNumber>{devicePosition.lat.toFixed(4)}</StatNumber>
            <StatHelpText>纬度</StatHelpText>
          </Stat>

          <Stat>
            <StatLabel>alt</StatLabel>
            <StatNumber>{devicePosition.alt.toFixed(2)}</StatNumber>
            <StatHelpText>高度</StatHelpText>
          </Stat>

          <Stat>
            <StatLabel>mode</StatLabel>
            <StatNumber lineHeight="36px" fontSize="md">
              {position_mode_map[devicePosition.mode & 0x7f]}|
              {(devicePosition.mode >> 7) & 0x01
                ? "高质量定位"
                : "一般精度定位"}
            </StatNumber>
            <StatHelpText>定位模式</StatHelpText>
          </Stat>

          <Stat>
            <StatLabel>count</StatLabel>
            <StatNumber>{devicePosition.count}</StatNumber>
            <StatHelpText>计数器</StatHelpText>
          </Stat>
        </Box>
      </Card>

      <Card p='2'>
        <Box>
          <Text>设备状态</Text>
        </Box>
        <Box className="flex space-x-4">
          <Stat>
            <StatLabel>temperature</StatLabel>
            <StatNumber>{deviceStatus.temperature.toFixed(2)}</StatNumber>
            <StatHelpText>温度</StatHelpText>
          </Stat>

          <Stat>
            <StatLabel>main_voltage</StatLabel>
            <StatNumber>{deviceStatus.main_voltage.toFixed(2)}</StatNumber>
            <StatHelpText>主电压</StatHelpText>
          </Stat>

          <Stat>
            <StatLabel>sys_voltage</StatLabel>
            <StatNumber>{deviceStatus.sys_voltage.toFixed(2)}</StatNumber>
            <StatHelpText>系统电压</StatHelpText>
          </Stat>

          <Stat>
            <StatLabel>chip_voltage</StatLabel>
            <StatNumber>{deviceStatus.chip_voltage.toFixed(2)}</StatNumber>
            <StatHelpText>芯片电压</StatHelpText>
          </Stat>

          <Stat>
            <StatLabel>power_io_status</StatLabel>
            <StatNumber>{deviceStatus.power_io_status.toFixed(2)}</StatNumber>
            <StatHelpText>电源IO状态</StatHelpText>
          </Stat>

          <Stat>
            <StatLabel>count</StatLabel>
            <StatNumber>{deviceStatus.count.toFixed(2)}</StatNumber>
            <StatHelpText>计数器</StatHelpText>
          </Stat>
        </Box>
      </Card>
    </Flex>
  );
};
