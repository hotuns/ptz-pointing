import React, { useState, useCallback } from 'react';
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon } from '@chakra-ui/icons';
import {
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    Card,
    Flex,
    Box,
    InputGroup,
    InputLeftAddon,
    Button,
} from '@chakra-ui/react';
import { set_ptz_angles } from '@/DeviceCommunicator/commands/set_ptz_angles';
// import { set_ptz_angles } from '@/DeviceCommunicator/commands/set_ptz_angles'; // 根据您的实际路径导入

const debounce = (func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return function executedFunction(...args: any[]) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

export function NavComponent(props: {
    onSendCommand: (command: Buffer) => void;
    ptz: { name: string, pitch: boolean, yaw: boolean, pitch_limit: number[], yaw_limit: number[] },
    ptzCurrentAttitude: IPtzAttitude
}) {
    const { ptz = {
        name: '',
        pitch: true,
        pitch_limit: [0, 0],
        yaw: true,
        yaw_limit: [0, 0],
    }, onSendCommand, ptzCurrentAttitude } = props;
    const [step, setStep] = useState(5);
    const [pitch, setPitch] = useState(ptzCurrentAttitude.pitch);
    const [yaw, setYaw] = useState(ptzCurrentAttitude.yaw);

    const updateAngle = useCallback(debounce((direction: string) => {
        console.log(direction);
        let target = 0;
        switch (direction) {
            case 'up':
                if (!ptz.pitch) break;
                // 判断limit，超过limit 则等于limit
                target = pitch + step
                target = Math.max(target, ptz.pitch_limit[0])
                target = Math.min(target, ptz.pitch_limit[1])
                setPitch(target)
                break;
            case 'down':
                if (!ptz.pitch) break;
                target = pitch - step
                target = Math.max(target, ptz.pitch_limit[0])
                target = Math.min(target, ptz.pitch_limit[1])
                setPitch(target)
                break;
            case 'left':
                if (!ptz.yaw) break;
                target = yaw - step
                target = Math.max(target, ptz.yaw_limit[0])
                target = Math.min(target, ptz.yaw_limit[1])
                setYaw(target)
                break;
            case 'right':
                if (!ptz.yaw) break;
                target = yaw + step
                target = Math.max(target, ptz.yaw_limit[0])
                target = Math.min(target, ptz.yaw_limit[1])
                setYaw(target)
                break;
            default:
                break;
        }

        // 发送指令
        if (ptz.pitch && ptz.yaw) {
            onSendCommand(set_ptz_angles(false, {
                pitch,
                roll: ptzCurrentAttitude.roll,
                yaw
            }));
        } else if (!ptz.pitch && ptz.yaw) {
            onSendCommand(set_ptz_angles(false, {
                pitch: ptzCurrentAttitude.pitch,
                roll: ptzCurrentAttitude.roll,
                yaw
            }));
        }

    }, 200), [step, yaw, pitch]);

    return (
        <Card p="4" width={'200px'}>
            <Flex flexDirection={"column"} justifyContent={'space-between'} alignItems={'center'}>
                <Box border="1px" borderRadius={'50%'} width='160px' height='160px' position={'relative'}>
                    <ChevronUpIcon
                        boxSize={'10'}
                        position={'absolute'}
                        top={'10px'}
                        left={'60px'}
                        onClick={() => updateAngle('up')}
                        _hover={
                            ptz.pitch ? {
                                background: "white",
                                color: "teal.500",
                                scale: 1.2
                            } : {
                                cursor: 'not-allowed',
                            }
                        }
                    />
                    <ChevronDownIcon
                        boxSize={'10'}
                        position={'absolute'}
                        bottom={'10px'}
                        left={'60px'}
                        onClick={() => updateAngle('down')}
                        _hover={
                            ptz.pitch ? {
                                background: "white",
                                color: "teal.500",
                                scale: 1.2
                            } : {
                                cursor: 'not-allowed',

                            }
                        }
                    />
                    <ChevronLeftIcon
                        boxSize={'10'}
                        position={'absolute'}
                        top={'60px'}
                        left={'10px'}
                        onClick={() => updateAngle('left')}
                        _hover={
                            ptz.yaw ? {
                                background: "white",
                                color: "teal.500",
                                scale: 1.2
                            } : {
                                cursor: 'not-allowed',

                            }
                        }
                    />
                    <ChevronRightIcon
                        boxSize={'10'}
                        position={'absolute'}
                        top={'60px'}
                        right={'10px'}
                        onClick={() => updateAngle('right')}
                        _hover={
                            ptz.yaw ? {
                                background: "white",
                                color: "teal.500",
                                scale: 1.2
                            } : {
                                cursor: 'not-allowed',

                            }
                        }
                    />
                </Box>

                <InputGroup width='150px'>
                    <InputLeftAddon children='步长' />
                    <NumberInput
                        value={step}
                        onChange={(valueString) => setStep(parseFloat(valueString))}
                        allowMouseWheel
                    >
                        <NumberInputField />
                        <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>
                </InputGroup>

                <Button
                    colorScheme="blue"
                    width={'150px'}
                    onClick={() => {
                        setPitch(0);
                        setYaw(0);
                        // 可以在这里添加一键回中的逻辑
                        // onSendCommand(set_ptz_angles(reset));
                    }}
                >
                    一键回中
                </Button>

                {/* 显示Pitch和Yaw的当前值 */}
                <Box>
                    <p>Pitch: {pitch.toFixed(1)}</p>
                    <p>Yaw: {yaw.toFixed(1)}</p>
                </Box>
            </Flex>
        </Card>
    );
}
