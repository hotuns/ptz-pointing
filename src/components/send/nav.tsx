import React, { useState, useRef } from 'react';
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
// import { set_ptz_angles } from '@/DeviceCommunicator/commands/set_ptz_angles'; // 根据您的实际路径导入

export function NavComponent(props: {
    onSendCommand: (command: Buffer) => void;
    ptz: { name: string, pitch: boolean, yaw: boolean }
}) {
    const { ptz = {
        name: '',
        pitch: true,
        yaw: true,
    }, onSendCommand } = props;
    const [step, setStep] = useState(0.1);
    const [pitch, setPitch] = useState(0);
    const [yaw, setYaw] = useState(0);
    const longPressTimerRef = useRef<NodeJS.Timeout>();
    const isLongPressRef = useRef(false);

    const adjustValue = (direction: string) => {
        switch (direction) {
            case 'up':
                setPitch(prev => prev + step);
                break;
            case 'down':
                setPitch(prev => prev - step);
                break;
            case 'left':
                setYaw(prev => prev - step);
                break;
            case 'right':
                setYaw(prev => prev + step);
                break;
            default:
                break;
        }
    };

    const handleButtonDown = (direction: string) => {
        isLongPressRef.current = false;
        longPressTimerRef.current = setTimeout(() => {
            isLongPressRef.current = true;
            startLongPressAction(direction);
        }, 500);
    };

    const handleButtonUp = (direction: string) => {
        clearTimeout(longPressTimerRef.current);
        if (!isLongPressRef.current) {
            adjustValue(direction);
        }
        stopLongPressAction();
    };

    const startLongPressAction = (direction: string) => {
        longPressTimerRef.current = setInterval(() => adjustValue(direction), 100);
    };

    const stopLongPressAction = () => {
        clearInterval(longPressTimerRef.current);
    };

    return (
        <Card p="4" width={'200px'} className='select-none'>
            <Flex flexDirection={"column"} justifyContent={'space-between'} alignItems={'center'}>
                <Box border="1px" borderRadius={'50%'} width='160px' height='160px' position={'relative'}>
                    <ChevronUpIcon
                        boxSize={'10'}
                        position={'absolute'}
                        top={'10px'}
                        left={'60px'}
                        onMouseDown={() => handleButtonDown('up')}
                        onMouseUp={() => handleButtonUp('up')}
                        onMouseLeave={() => handleButtonUp('up')}
                        _hover={
                            ptz.pitch ? {
                                background: "white",
                                color: "teal.500",
                                scale: 1.2
                            } : {
                                cursor: 'not-allowed',
                                pointerEvents: 'none'
                            }
                        }
                    />
                    <ChevronDownIcon
                        boxSize={'10'}
                        position={'absolute'}
                        bottom={'10px'}
                        left={'60px'}
                        onMouseDown={() => handleButtonDown('down')}
                        onMouseUp={() => handleButtonUp('down')}
                        onMouseLeave={() => handleButtonUp('down')}
                        _hover={
                            ptz.pitch ? {
                                background: "white",
                                color: "teal.500",
                                scale: 1.2
                            } : {
                                cursor: 'not-allowed',
                                pointerEvents: 'none'
                            }
                        }
                    />
                    <ChevronLeftIcon
                        boxSize={'10'}
                        position={'absolute'}
                        top={'60px'}
                        left={'10px'}
                        onMouseDown={() => handleButtonDown('left')}
                        onMouseUp={() => handleButtonUp('left')}
                        onMouseLeave={() => handleButtonUp('left')}
                        _hover={
                            ptz.yaw ? {
                                background: "white",
                                color: "teal.500",
                                scale: 1.2
                            } : {
                                cursor: 'not-allowed',
                                pointerEvents: 'none'
                            }
                        }
                    />
                    <ChevronRightIcon
                        boxSize={'10'}
                        position={'absolute'}
                        top={'60px'}
                        right={'10px'}
                        onMouseDown={() => handleButtonDown('right')}
                        onMouseUp={() => handleButtonUp('right')}
                        onMouseLeave={() => handleButtonUp('right')}
                        _hover={
                            ptz.yaw ? {
                                background: "white",
                                color: "teal.500",
                                scale: 1.2
                            } : {
                                cursor: 'not-allowed',
                                pointerEvents: 'none'
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
