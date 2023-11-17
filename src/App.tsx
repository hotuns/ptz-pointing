import { useEffect, useRef, useState } from "react";
import "./App.css";
import { DeviceCommunicator, TLVType } from "./DeviceCommunicator";
import { AppStatus } from "./components/status";
import { AppSend } from "./components/send";
import { Box, Card, Flex, Select, Image, Button } from "@chakra-ui/react";
import { PlantCom } from "./components/plant";

let mock = false;
let communicator: DeviceCommunicator | null = null;

const ptzlist = [
  {
    name: '翔拓二轴云台',
    pitch: true,
    pitch_limit: [-30, 30],
    yaw: true,
    yaw_limit: [-30, 30],
  },
  {
    name: '钜钺重载云台',
    pitch: false,
    yaw: true,
    yaw_limit: [-180, 180],
  }
]

function App() {
  const [currentPtz, set_currentPtz] = useState<any>(ptzlist[0]);
  const handlePtzChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const index = e.target.value;
    set_currentPtz(ptzlist[parseInt(index)]);
  }

  const [serialport_list, set_serialport_list] = useState<any[]>([]);
  const [currentPort, set_currentPort] = useState<any>();

  const [isBtnDisabled, set_isBtnDisabled] = useState<boolean>(true);

  function reloadPortList() {
    DeviceCommunicator.list()
      .then((list) => {
        console.log("[App.tsx]", "list", list);
        set_serialport_list(list);
      })
      .catch((err) => {
        console.log("[App.tsx]", "list error", err);
      });
  }

  async function handlePortChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const port = e.target.value;
    set_currentPort(port);
  }

  function handlePortStart() {
    communicator = new DeviceCommunicator(currentPort, false, onDataReceived);
    communicator!.open().then(() => {
      set_isBtnDisabled(false);
    });
  }


  function handlePortClose() {
    console.log("[App.tsx]", "handlePortClose");
    if (communicator) {
      communicator.close();
      set_isBtnDisabled(true);
      set_serialport_list([]);
      set_currentPort(undefined);
    }
  }

  // 飞控当前姿态角
  const [controlCurrentAttitude, setControlCurrentAttitude] =
    useState<IControlAttitude>({
      roll: 0,
      pitch: 0,
      yaw: 0,
      count: 0,
    });

  // 云台当前姿态角
  const [ptzCurrentAttitude, setPtzCurrentAttitude] = useState<IPtzAttitude>({
    roll: 0,
    pitch: 0,
    yaw: 0,
    count: 0,
  });
  // 云台期望姿态角
  const [ptzExpectAttitude, setPtzExpectAttitude] =
    useState<IPtzExpectlAttitude>({
      roll: 0,
      pitch: 0,
      yaw: 0,
      mode: 0,
      status: 0,
      count: 0,
    });

  // 设备经纬高
  const [devicePosition, setDevicePosition] = useState<Iposition>({
    mode: 0,
    lng: 0,
    lat: 0,
    alt: 0,
    count: 0,
  });

  // 设备状态
  const [deviceStatus, setDeviceStatus] = useState<IDeviceStatus>({
    temperature: 0,
    main_voltage: 0,
    sys_voltage: 0,
    chip_voltage: 0,
    power_io_status: 0,
    count: 0,
  });

  function onDataReceived(list: { id: TLVType; string: string; value: any }[]) {
    // console.log("[App.tsx]", "onDataReceived", list);
    list.forEach((data) => {
      switch (data.id) {
        case TLVType.飞控当前姿态角:
          setControlCurrentAttitude(data.value);
          break;
        case TLVType.云台当前姿态角:
          setPtzCurrentAttitude(data.value);
          break;
        case TLVType.云台期望姿态角:
          setPtzExpectAttitude(data.value);
          break;
        case TLVType.设备经纬高:
          setDevicePosition(data.value);
          break;
        case TLVType.设备状态:
          setDeviceStatus(data.value);
          break;
        default:
          break;
      }
    });
  }

  function onSendCommand(command: Buffer) {
    communicator!
      .send(command)
      .then(() => {
        console.log("[App.tsx]", "onSendCommand");
      })
      .catch((err) => {
        console.log("[App.tsx]", "onSendCommand error ", err);
      });
  }

  return (
    <Card className="p-2 w-full h-full select-none" bg="gray.100">
      <Flex width={'100%'} >
        <Flex className="space-y-2" flexDirection={'column'} p="1">

          <PlantCom
            controlCurrentAttitude={controlCurrentAttitude}
            ptzCurrentAttitude={ptzCurrentAttitude}
            ptzExpectAttitude={ptzExpectAttitude}
            devicePosition={devicePosition}
            deviceStatus={deviceStatus}
          />

          <Card>
            <Flex>
              <Select
                placeholder="云台"
                onChange={handlePtzChange}
                isDisabled={!isBtnDisabled}
              >
                {ptzlist.map((ptz, index) => {
                  return (
                    <option key={ptz.name} value={index}>
                      {ptz.name}
                    </option>
                  );
                })}
              </Select>


              <Select
                placeholder="端口"
                onClick={reloadPortList}
                onChange={handlePortChange}
                isDisabled={!isBtnDisabled}
              >
                {serialport_list.map((port) => {
                  return (
                    <option key={port.path} value={port.path}>
                      {port.path}
                    </option>
                  );
                })}
              </Select>


              {
                isBtnDisabled ?
                  <Button
                    isDisabled={currentPtz === undefined || currentPort === undefined}
                    colorScheme="green"
                    onClick={handlePortStart}
                  >连接</Button>
                  :
                  <Button
                    colorScheme="red"
                    onClick={handlePortClose}
                  >断开</Button>
              }



            </Flex>
          </Card>


          <AppSend isDisabled={isBtnDisabled} ptz={currentPtz} onSendCommand={onSendCommand} ptzCurrentAttitude={ptzCurrentAttitude} />

        </Flex>
      </Flex>
    </Card>
  );
}

export default App;
