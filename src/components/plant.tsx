import {
  Box,
  Card,
  Image,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Flex,
  Grid,
  GridItem,
  Heading,
  Divider,
  Badge,
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

  // 计算云台相对于飞控的旋转角度
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

  // 格式化数值的通用函数
  const formatValue = (value: number) => value.toFixed(2);

  return (
    <Flex direction="column" w="full" h="full" gap={4}>
      {/* 飞控和云台状态可视化 */}
      <Card p={4} borderRadius="lg">
        <Flex direction="column" align="center">
          <Heading size="sm" mb={3}>飞控与云台方向指示器</Heading>
          <Box position="relative" h="180px" w="180px">
            {/* 指示器背景圆 */}
            <Box
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              w="160px"
              h="160px"
              borderRadius="full"
              border="1px dashed"
              borderColor="gray.300"
              zIndex={1}
            />
            
            {/* 方位标记 */}
            {['N', 'E', 'S', 'W'].map((direction, index) => (
              <Text
                key={direction}
                position="absolute"
                top={index === 0 ? "5px" : index === 2 ? "calc(100% - 20px)" : "calc(50% - 10px)"}
                left={index === 1 ? "calc(100% - 20px)" : index === 3 ? "5px" : "calc(50% - 5px)"}
                fontSize="sm"
                fontWeight="bold"
                color="gray.600"
                zIndex={1}
              >
                {direction}
              </Text>
            ))}
            
            {/* 飞控图标 - 底层 */}
            <Image
              id="plant"
              src={PlantImg}
              position="absolute"
             
              top="50%"
              left="50%"
              transform={`translate(-50%, -50%) rotate(${controlCurrentAttitude.yaw}deg)`}
              transition="transform 0.5s ease"
              maxH="120px"
              zIndex={2}
            />
            
            {/* 云台图标 - 顶层 */}
            <Image
              id="ptz"
              src={PTZIcon}
              position="absolute"
              top="50%"
              left="50%"
              transform={`translate(-50%, -50%) rotate(${computedPtzAttitude(
                controlCurrentAttitude.yaw,
                ptzCurrentAttitude.yaw
              )}deg)`}
              transition="transform 0.5s ease"
              maxH="60px"
              zIndex={3}
            />
          </Box>
          
          <Flex mt={4} gap={6}>
            <Badge colorScheme="blue" p={2}>
              <Flex direction="column" align="center">
                <Text fontWeight="bold">飞控偏航角</Text>
                <Text>{formatValue(controlCurrentAttitude.yaw)}°</Text>
              </Flex>
            </Badge>
            
            <Badge colorScheme="green" p={2}>
              <Flex direction="column" align="center">
                <Text fontWeight="bold">云台偏航角</Text>
                <Text>{formatValue(ptzCurrentAttitude.yaw)}°</Text>
              </Flex>
            </Badge>
            
            <Badge colorScheme="purple" p={2}>
              <Flex direction="column" align="center">
                <Text fontWeight="bold">相对角度</Text>
                <Text>{formatValue(ptzCurrentAttitude.yaw)}°</Text>
              </Flex>
            </Badge>
          </Flex>
        </Flex>
      </Card>

      {/* 姿态和位置信息 */}
      <Card p={4}  borderRadius="lg">
        <Grid templateColumns="repeat(3, 1fr)" gap={4}>
          {/* 飞控姿态 */}
          <GridItem>
            <Flex direction="column" align="center">
              <Heading size="sm" mb={2}>飞控姿态</Heading>
              <Divider mb={2} />
              <Flex direction="column" gap={1}>
                <Badge colorScheme="blue" p={1} borderRadius="md">
                  <Flex justify="space-between" w="full" px={2}>
                    <Text>Pitch:</Text>
                    <Text>{formatValue(controlCurrentAttitude.pitch)}</Text>
                  </Flex>
                </Badge>
                <Badge colorScheme="green" p={1} borderRadius="md">
                  <Flex justify="space-between" w="full" px={2}>
                    <Text>Roll:</Text>
                    <Text>{formatValue(controlCurrentAttitude.roll)}</Text>
                  </Flex>
                </Badge>
                <Badge colorScheme="purple" p={1} borderRadius="md">
                  <Flex justify="space-between" w="full" px={2}>
                    <Text>Yaw:</Text>
                    <Text>{formatValue(controlCurrentAttitude.yaw)}</Text>
                  </Flex>
                </Badge>
              </Flex>
            </Flex>
          </GridItem>

          {/* 云台姿态 */}
          <GridItem>
            <Flex direction="column" align="center">
              <Heading size="sm" mb={2}>云台姿态</Heading>
              <Divider mb={2} />
              <Flex direction="column" gap={1}>
                <Badge colorScheme="blue" p={1} borderRadius="md">
                  <Flex justify="space-between" w="full" px={2}>
                    <Text>Pitch:</Text>
                    <Text>{formatValue(ptzCurrentAttitude.pitch)}</Text>
                  </Flex>
                </Badge>
                <Badge colorScheme="green" p={1} borderRadius="md">
                  <Flex justify="space-between" w="full" px={2}>
                    <Text>Roll:</Text>
                    <Text>{formatValue(ptzCurrentAttitude.roll)}</Text>
                  </Flex>
                </Badge>
                <Badge colorScheme="purple" p={1} borderRadius="md">
                  <Flex justify="space-between" w="full" px={2}>
                    <Text>Yaw:</Text>
                    <Text>{formatValue(ptzCurrentAttitude.yaw)}</Text>
                  </Flex>
                </Badge>
              </Flex>
            </Flex>
          </GridItem>

          {/* 位置信息 */}
          <GridItem>
            <Flex direction="column" align="center">
              <Heading size="sm" mb={2}>位置信息</Heading>
              <Divider mb={2} />
              <Flex direction="column" gap={1}>
                <Badge colorScheme="orange" p={1} borderRadius="md">
                  <Flex justify="space-between" w="full" px={2}>
                    <Text>经度:</Text>
                    <Text>{formatValue(devicePosition.lng)}</Text>
                  </Flex>
                </Badge>
                <Badge colorScheme="yellow" p={1} borderRadius="md">
                  <Flex justify="space-between" w="full" px={2}>
                    <Text>纬度:</Text>
                    <Text>{formatValue(devicePosition.lat)}</Text>
                  </Flex>
                </Badge>
                <Badge colorScheme="cyan" p={1} borderRadius="md">
                  <Flex justify="space-between" w="full" px={2}>
                    <Text>高度:</Text>
                    <Text>{formatValue(devicePosition.alt)}</Text>
                  </Flex>
                </Badge>
              </Flex>
            </Flex>
          </GridItem>
        </Grid>

        {/* 电压和温度信息 */}
        <Divider my={4} />
        <Box mt={2}>
          <Heading size="sm" mb={2} textAlign="center">系统状态</Heading>
          <Flex justify="space-between" w="full" mt={2}>
            <Stat textAlign="center" bg="gray.50" p={2} borderRadius="md">
              <StatNumber color="red.500">
                {(deviceStatus.temperature / 100).toFixed(2)}°C
              </StatNumber>
              <StatHelpText mb={0}>温度</StatHelpText>
            </Stat>

            <Stat textAlign="center" bg="gray.50" p={2} borderRadius="md">
              <StatNumber color="blue.500">
                {(deviceStatus.main_voltage / 100).toFixed(2)}V
              </StatNumber>
              <StatHelpText mb={0}>主电压</StatHelpText>
            </Stat>

            <Stat textAlign="center" bg="gray.50" p={2} borderRadius="md">
              <StatNumber color="green.500">
                {(deviceStatus.sys_voltage / 100).toFixed(2)}V
              </StatNumber>
              <StatHelpText mb={0}>系统电压</StatHelpText>
            </Stat>

            <Stat textAlign="center" bg="gray.50" p={2} borderRadius="md">
              <StatNumber color="purple.500">
                {(deviceStatus.chip_voltage / 100).toFixed(2)}V
              </StatNumber>
              <StatHelpText mb={0}>芯片电压</StatHelpText>
            </Stat>
          </Flex>
        </Box>
      </Card>
    </Flex>
  );
}
