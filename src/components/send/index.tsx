import {
  Box,
  Card,
  FormControl,
  FormLabel,
  Button,
  Flex,
  useDisclosure,
  Divider,
} from "@chakra-ui/react";
import { useState } from "react";
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

export function AppSend({
  isDisabled,
  onSendCommand,
  ptz,
  ptzCurrentAttitude,
}: {
  isDisabled: boolean;
  onSendCommand: (command: Buffer) => void;
  ptz: { name: string, pitch: boolean, yaw: boolean, pitch_limit: number[], yaw_limit: number[] },
  ptzCurrentAttitude: IPtzAttitude
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
  const { isOpen: isAnglesOpen, onOpen: openAngles, onClose: closeAngles } = useDisclosure()


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
  const { isOpen: isLocationOpen, onOpen: openLocation, onClose: closeLocation } = useDisclosure()

  return (
    <>
      <Flex className="mt-1 space-x-2 w-full relative" style={{
        pointerEvents: isDisabled ? 'none' : 'auto'
      }}>
        <NavComponent ptzCurrentAttitude={ptzCurrentAttitude} ptz={ptz} onSendCommand={onSendCommand} />
        <Box p="4" className="flex-1 space-y-2">
          <Box className="space-y-1 flex flex-col">

            <Card p='2'>
              <Flex className="space-x-1">
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
              <Button size={"sm"} onClick={openAngles}>设置云台角度</Button>
            </Card>

            <Card p='2'>
              <Flex className="space-x-1">
                <FormControl display="flex" alignItems="center">
                  <FormLabel htmlFor="latitude">经度</FormLabel>
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
                  <FormLabel htmlFor="longitude" mb="0">
                    纬度
                  </FormLabel>
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
                  <FormLabel htmlFor="yaw" mb="0" width={"2rem"}>
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

              <Button size={"sm"} onClick={openLocation}>设置目标位置</Button>
            </Card>


            <Card p='2'>
              <Button
                onClick={() => {
                  onSendCommand(reboot());
                }}
              >
                重启
              </Button>
            </Card>
          </Box>


          <Divider />
          <Box className="space-x-1">
            <Button>开始温控</Button>
            <Button>停止温控</Button>
            <Button>设置温度</Button>
          </Box>
        </Box>


        {/* 遮罩层，挡住操作 */}
        {isDisabled && <Box bg="blackAlpha.500" className="absolute w-full h-full" style={{ margin: 0 }}>
        </Box>}

        <Modal isOpen={isAnglesOpen} onClose={closeAngles}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>设置云台角度</ModalHeader>
            <ModalBody>

            </ModalBody>

            <ModalFooter>
              <Button mr={3} onClick={closeAngles}>
                关闭
              </Button>
              <Button
                colorScheme='blue'
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

        <Modal isOpen={isLocationOpen} onClose={closeLocation}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>设置目标位置</ModalHeader>
            <ModalBody>

            </ModalBody>

            <ModalFooter>
              <Button mr={3} onClick={closeLocation}>
                关闭
              </Button>
              <Button
                colorScheme='blue'
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
