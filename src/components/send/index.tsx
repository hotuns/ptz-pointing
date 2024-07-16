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
    pitch: 0,
    roll: 0,
    yaw: 0,
  });
  const handleAnglesOptChange = (key: string, value: number | string) => {
    setPtzAnglesOpt({
      ...ptzAnglesOpt,
      [key]: value,
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
      [key]: value,
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

        {/* 以下为弹出层 */}
        <Modal isOpen={isAnglesOpen} size="4xl" onClose={closeAngles}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>设置云台角度</ModalHeader>
            <Flex className="space-x-1 p-2">
              <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="pitch">俯仰</FormLabel>

                <NumberInput
                  size="sm"
                  id="pitch"
                  value={ptzAnglesOpt.pitch}
                  onChange={(value) => {
                    handleAnglesOptChange("pitch", value);
                  }}
                >
                  <NumberInputField />
                </NumberInput>
              </FormControl>

              <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="roll" mb="0">
                  滚转
                </FormLabel>
                <NumberInput
                  size="sm"
                  id="roll"
                  value={ptzAnglesOpt.roll}
                  onChange={(value) => {
                    handleAnglesOptChange("roll", value);
                  }}
                >
                  <NumberInputField />
                </NumberInput>
              </FormControl>

              <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="yaw" mb="0">
                  航向
                </FormLabel>
                <NumberInput
                  size="sm"
                  id="yaw"
                  value={ptzAnglesOpt.yaw}
                  onChange={(value) => {
                    handleAnglesOptChange("yaw", value);
                  }}
                >
                  <NumberInputField />
                </NumberInput>
              </FormControl>
            </Flex>
            <ModalBody></ModalBody>

            <ModalFooter>
              <Button mr={3} onClick={closeAngles}>
                关闭
              </Button>
              <Button
                colorScheme="blue"
                onClick={() => {
                  onSendCommand(
                    set_ptz_angles(false, {
                      pitch: ptzAnglesOpt.pitch,
                      roll: ptzAnglesOpt.roll,
                      yaw: ptzAnglesOpt.yaw,
                    })
                  );
                }}
              >
                设置云台角度
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
