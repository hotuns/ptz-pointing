import {
    Box, Card, Image, Text, Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
} from "@chakra-ui/react";
import PlantImg from "@/assets/plant.png";
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

    return (
        <Card>
            <Box padding={'10px'} position={"relative"}>
                <Box position={'absolute'} left={'5'}  >
                    <Text fontSize='md'>飞控</Text>
                    <Box>
                        <Text fontSize='xs'>
                            pitch: {controlCurrentAttitude.pitch.toFixed(2)}
                        </Text>

                        <Text fontSize='xs'>
                            roll: {controlCurrentAttitude.roll.toFixed(2)}
                        </Text>

                        <Text fontSize='xs'>
                            yaw: {controlCurrentAttitude.yaw.toFixed(2)}
                        </Text>
                    </Box>
                </Box>

                <Box position={'absolute'} right={'5'} >
                    <Text fontSize='md'>云台</Text>
                    <Box>
                        <Text fontSize='xs'>
                            pitch: {ptzCurrentAttitude.pitch.toFixed(2)}
                        </Text>

                        <Text fontSize='xs'>
                            roll: {ptzCurrentAttitude.roll.toFixed(2)}
                        </Text>

                        <Text fontSize='xs'>
                            yaw: {ptzCurrentAttitude.yaw.toFixed(2)}
                        </Text>
                    </Box>
                </Box>


                <Image id="plant" src={PlantImg}
                    style={{
                        transform: `rotate(${controlCurrentAttitude.yaw}deg)`,
                    }} />
                <Image id='ptz' src={PTZIcon}
                    style={{
                        transform: `rotate(${45 + ptzCurrentAttitude.yaw}deg)`,
                    }}
                />
            </Box>

            <Box className="flex space-x-4" justifyContent={'space-between'}>
                <Stat textAlign={'center'}>

                    <StatNumber>{deviceStatus.temperature.toFixed(2)}</StatNumber>
                    <StatHelpText>温度</StatHelpText>
                </Stat>

                <Stat textAlign={'center'}>

                    <StatNumber>{deviceStatus.main_voltage.toFixed(2)}</StatNumber>
                    <StatHelpText>主电压</StatHelpText>
                </Stat>

                <Stat textAlign={'center'}>

                    <StatNumber>{deviceStatus.sys_voltage.toFixed(2)}</StatNumber>
                    <StatHelpText>系统电压</StatHelpText>
                </Stat>

                <Stat textAlign={'center'}>
                    <StatNumber>{deviceStatus.chip_voltage.toFixed(2)}</StatNumber>
                    <StatHelpText>芯片电压</StatHelpText>
                </Stat>

                <Stat textAlign={'center'}>

                    <StatNumber>{deviceStatus.power_io_status.toFixed(2)}</StatNumber>
                    <StatHelpText>电源IO状态</StatHelpText>
                </Stat>
            </Box>
        </Card>
    )
}
