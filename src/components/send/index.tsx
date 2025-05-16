import {
  Box,
  Card,
  FormControl,
  FormLabel,
  Button,
  Flex,
  useDisclosure,
  Select,
  Divider,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  NumberInput,
  NumberInputField,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
} from "@chakra-ui/react";
import { set_ptz_angles } from "@/DeviceCommunicator/commands/set_ptz_angles";
import { set_ptz_localtion } from "@/DeviceCommunicator/commands/set_ptz_localtion";
import { reboot } from "@/DeviceCommunicator/commands/reboot";

import { NavComponent } from "./nav";
import {
  start_control,
  stop_control,
  set_temperature,
  read_status,
  set_sampling_method,
} from "@/DeviceCommunicator/commands/pass_through";

export function AppSend({
  isDisabled,
  onSendCommand,
  ptz,
  ptzExpectAttitude,
  ptzCurrentAttitude,
  payloadTemperature,
  exportFile,
}: {
  isDisabled: boolean;
  onSendCommand: (command: Buffer) => void;
  exportFile: Function;
  ptz: {
    name: string;
    pitch: boolean;
    yaw: boolean;
    pitch_limit: number[];
    pitch_origin: number;
    yaw_limit: number[];
    yaw_origin: number;
  };
  ptzExpectAttitude: IPtzExpectlAttitude;
  ptzCurrentAttitude: IPtzAttitude;
  payloadTemperature: {
    switch: boolean;
    temperature1: number;
    temperature2: number;
    temperature3: number;
    method: number;
  };
}) {
  const [ptzAnglesOpt, setPtzAnglesOpt] = useState({
    pitch: ptzCurrentAttitude.pitch,
    roll: ptzCurrentAttitude.roll,
    yaw: ptzCurrentAttitude.yaw,
  });

  useEffect(() => {
    setPtzAnglesOpt({
      pitch: ptzCurrentAttitude.pitch,
      roll: ptzCurrentAttitude.roll,
      yaw: ptzCurrentAttitude.yaw,
    });
  }, [ptzCurrentAttitude]);

  const handleAnglesOptChange = (key: string, value: number | string) => {
    setPtzAnglesOpt({
      ...ptzAnglesOpt,
      [key]: parseFloat(value as string),
    });
  };
  
  const {
    isOpen: isAnglesOpen,
    onOpen: openAngles,
    onClose: closeAngles,
  } = useDisclosure();

  const [ptzLocationOpt, setPtzLocationOpt] = useState({
    latitude: 0,
    longitude: 0,
    altitude: 0,
  });
  const handleLocationOptChange = (key: string, value: number | string) => {
    setPtzLocationOpt({
      ...ptzLocationOpt,
      [key]: parseFloat(value as string),
    });
  };
  const {
    isOpen: isLocationOpen,
    onOpen: openLocation,
    onClose: closeLocation,
  } = useDisclosure();

  const [targetTemperature, setTargetTemperature] = useState(20);

  const startControl = () => {
    onSendCommand(start_control());
  };

  const methodChange = (e: any) => {
    onSendCommand(set_sampling_method(Number(e.target.value)));
  };

  const stopControl = () => {
    onSendCommand(stop_control());
  };

  const sendPtzAngles = () => {
    let pitchValue = ptzAnglesOpt.pitch;
    let yawValue = ptzAnglesOpt.yaw;
    
    onSendCommand(
      set_ptz_angles(false, {
        pitch: pitchValue,
        roll: ptzAnglesOpt.roll,
        yaw: yawValue,
      })
    );
    closeAngles();
  };

  return (
    <>
      <Flex
        className="mt-1 space-x-2 w-full relative"
        style={{
          pointerEvents: isDisabled ? "none" : "auto",
        }}
      >
        <div className="space-y-1 flex flex-col w-full h-full">
          <NavComponent
            ptzExpectAttitude={ptzExpectAttitude}
            ptzCurrentAttitude={ptzCurrentAttitude}
            ptz={ptz}
            onSendCommand={onSendCommand}
          />
          <Card className="space-y-2 p-2">
            <Button size={"sm"} onClick={openAngles}>
              设置云台角度
            </Button>

            <Button size={"sm"} onClick={openLocation}>
              设置目标位置
            </Button>

            <Button
              onClick={() => {
                onSendCommand(reboot());
              }}
            >
              重启
            </Button>
          </Card>
        </div>

        {isDisabled && (
          <Box
            bg="blackAlpha.500"
            className="absolute w-full h-full"
            style={{ margin: 0 }}
          ></Box>
        )}

        <Modal isOpen={isAnglesOpen} size="4xl" onClose={closeAngles}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>设置云台角度</ModalHeader>
            <ModalBody>
              <Text mb={3} fontSize="sm" color="gray.600">
                当前云台角度: 俯仰={ptzCurrentAttitude.pitch.toFixed(2)}°, 
                滚转={ptzCurrentAttitude.roll.toFixed(2)}°, 
                航向={ptzCurrentAttitude.yaw.toFixed(2)}°
              </Text>
              <Flex className="space-x-4 p-2">
                <FormControl display="flex" alignItems="center">
                  <Tooltip label="负值向上，正值向下，与导航控制保持一致">
                    <FormLabel htmlFor="pitch" width="4rem">俯仰角</FormLabel>
                  </Tooltip>
                  <NumberInput
                    size="md"
                    id="pitch"
                    value={ptzAnglesOpt.pitch}
                    onChange={(value) => {
                      handleAnglesOptChange("pitch", value);
                    }}
                    precision={2}
                  >
                    <NumberInputField />
                  </NumberInput>
                </FormControl>

                <FormControl display="flex" alignItems="center">
                  <FormLabel htmlFor="roll" width="4rem">滚转角</FormLabel>
                  <NumberInput
                    size="md"
                    id="roll"
                    value={ptzAnglesOpt.roll}
                    onChange={(value) => {
                      handleAnglesOptChange("roll", value);
                    }}
                    precision={2}
                  >
                    <NumberInputField />
                  </NumberInput>
                </FormControl>

                <FormControl display="flex" alignItems="center">
                  <Tooltip label="负值向左，正值向右，与导航控制保持一致">
                    <FormLabel htmlFor="yaw" width="4rem">航向角</FormLabel>
                  </Tooltip>
                  <NumberInput
                    size="md"
                    id="yaw"
                    value={ptzAnglesOpt.yaw}
                    onChange={(value) => {
                      handleAnglesOptChange("yaw", value);
                    }}
                    precision={2}
                  >
                    <NumberInputField />
                  </NumberInput>
                </FormControl>
              </Flex>
            </ModalBody>

            <ModalFooter>
              <Button mr={3} onClick={closeAngles}>
                取消
              </Button>
              <Button
                colorScheme="blue"
                onClick={sendPtzAngles}
              >
                确认设置
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <Modal isOpen={isLocationOpen} size="4xl" onClose={closeLocation}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>设置目标位置</ModalHeader>

            <ModalBody>
              <Flex className="space-x-1 p-2">
                <FormControl display="flex" alignItems="center">
                  <FormLabel htmlFor="latitude">纬度</FormLabel>
                  <NumberInput
                    size="sm"
                    id="latitude"
                    value={ptzLocationOpt.latitude}
                    onChange={(value) => {
                      handleLocationOptChange("latitude", value);
                    }}
                  >
                    <NumberInputField />
                  </NumberInput>
                </FormControl>

                <FormControl display="flex" alignItems="center">
                  <FormLabel htmlFor="longitude">经度</FormLabel>
                  <NumberInput
                    size="sm"
                    id="longitude"
                    value={ptzLocationOpt.longitude}
                    onChange={(value) => {
                      handleLocationOptChange("longitude", value);
                    }}
                  >
                    <NumberInputField />
                  </NumberInput>
                </FormControl>

                <FormControl display="flex" alignItems="center">
                  <FormLabel htmlFor="yaw" width={"2rem"}>
                    海拔
                  </FormLabel>
                  <NumberInput
                    size="sm"
                    id="yaw"
                    value={ptzLocationOpt.altitude}
                    onChange={(value) => {
                      handleLocationOptChange("altitude", value);
                    }}
                  >
                    <NumberInputField />
                  </NumberInput>
                </FormControl>
              </Flex>
            </ModalBody>

            <ModalFooter>
              <Button mr={3} onClick={closeLocation}>
                关闭
              </Button>
              <Button
                colorScheme="blue"
                onClick={() => {
                  onSendCommand(
                    set_ptz_localtion({
                      latitude: ptzLocationOpt.latitude,
                      longitude: ptzLocationOpt.longitude,
                      altitude: ptzLocationOpt.altitude,
                    })
                  );
                }}
              >
                设置目标位置
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Flex>
    </>
  );
}
