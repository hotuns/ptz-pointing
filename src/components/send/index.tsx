import {
  Box,
  Card,
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  Button,
  IconButton,
  Flex,
  InputGroup,
  InputLeftAddon,
  useDisclosure,
  Divider,
} from "@chakra-ui/react";
import { Switch } from "@chakra-ui/react";
import { useState } from "react";
import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { set_ptz_angles } from "@/DeviceCommunicator/commands/set_ptz_angles";
import { set_ptz_localtion } from "@/DeviceCommunicator/commands/set_ptz_localtion";
import { reboot } from "@/DeviceCommunicator/commands/reboot";
import { ArrowLeftIcon, ArrowRightIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon } from "@chakra-ui/icons";

export function AppSend({
  onSendCommand: onSendCommand,
}: {
  onSendCommand: (command: Buffer) => void;
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
      <Flex className="mt-1 space-x-2 w-full">

        <Card p="4" width={'200px'}>
          <Flex className="space-y-2" flexDirection={"column"} justifyContent={'space-between'} alignItems={'center'}>
            <Box border="1px" borderRadius={'50%'} width='160px' height='160px' position={'relative'}>
              {/* top */}
              <ChevronUpIcon boxSize={'10'} position={'absolute'} top={'10px'} left={'60px'} _hover={{
                background: "white",
                color: "teal.500",
                scale: 1.2
              }}
              />
              {/* bottm */}
              <ChevronDownIcon boxSize={'10'} position={'absolute'} bottom={'10px'} left={'60px'} _hover={{
                background: "white",
                color: "teal.500",
                scale: 1.2
              }}
              />
              <ChevronLeftIcon boxSize={'10'} position={'absolute'} top={'60px'} left={'10px'} _hover={{
                background: "white",
                color: "teal.500",
                scale: 1.2
              }}
              />
              <ChevronRightIcon boxSize={'10'} position={'absolute'} top={'60px'} right={'10px'} _hover={{
                background: "white",
                color: "teal.500",
                scale: 1.2
              }}
              />
            </Box>


            <InputGroup width='150px'>
              <InputLeftAddon children='步长' />
              <NumberInput allowMouseWheel>
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
                onSendCommand(set_ptz_angles(true));
              }}
            >
              一键回中
            </Button>
          </Flex>
        </Card>

        <Card p="4" className="flex-1 space-y-2">
          <Box className="space-y-1 flex flex-col">
            <Button onClick={openAngles}>设置云台角度</Button>
            <Button onClick={openLocation}>设置目标位置</Button>
            <Button
              onClick={() => {
                onSendCommand(reboot());
              }}
            >
              重启
            </Button>
          </Box>


          <Divider />
          <Box className="space-x-1">
            <Button>开始温控</Button>
            <Button>停止温控</Button>
            <Button>设置温度</Button>
          </Box>
        </Card>



        <Modal isOpen={isAnglesOpen} onClose={closeAngles}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>设置云台角度</ModalHeader>
            <ModalBody>
              <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="pitch">俯仰角</FormLabel>
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
                  滚转角
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
                  航向角
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
                <FormLabel htmlFor="yaw" mb="0">
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
