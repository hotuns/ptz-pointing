import { useEffect, useRef, useState } from "react";
import "./App.css";
import { DeviceCommunicator, TLVType } from "./DeviceCommunicator";
import { AppStatus } from "./components/status";
import { AppSend } from "./components/send";
import { Box, Card, Flex, Select, Image, Button } from "@chakra-ui/react";
import { PlantCom } from "./components/plant";
import log from "electron-log/renderer";
import { read_status } from "./DeviceCommunicator/commands/pass_through";
import EchartTemperature from "./components/echarts/EchartTemperature";
import dayjs from "dayjs";
import { useExportCsv } from "./hooks/export-csv-hook";
import { useExportTxtLog } from "./hooks/export-txt-hook";

let isMock = false;
let communicator: DeviceCommunicator | null = null;

const ptzlist = [
  {
    name: "翔拓二轴云台",
    pitch: true,
    pitch_limit: [-30, 30],
    yaw: true,
    yaw_limit: [-30, 30],
  },
  {
    name: "钜钺重载云台",
    pitch: false,
    yaw: true,
    yaw_limit: [-180, 180],
  },
];

function App() {
  const [currentPtz, set_currentPtz] = useState<any>();
  const handlePtzChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const index = e.target.value;
    set_currentPtz(ptzlist[parseInt(index)]);
  };

  const { handleDownloadCsv } = useExportCsv();
  const { handleDownloadTxt } = useExportTxtLog();

  const [echart, setEchart] = useState<any[]>([]);

  const [serialport_list, set_serialport_list] = useState<any[]>([]);
  const [currentPort, set_currentPort] = useState<any>();

  const [isBtnDisabled, set_isBtnDisabled] = useState<boolean>(true);

  const exportFile = (value: string) => {
    switch (value) {
      case "csv":
        const fields = [
          {
            label: "时间", // 中文表头
            value: "time", // 对应的 JSON 属性
          },
          {
            label: "温度",
            value: "temperature",
          },
          {
            label: "采样方式",
            value: "method",
          },
        ];
        const data = echart.map((item) => ({
          time: item[0], // "时间" 对应 "time"
          temperature: item[1], // "温度" 对应 "temperature"
          method: item[2], // "采样方式" 对应 "method"
        }));
        handleDownloadCsv(fields, data);
        return;
      case "txt":
        const txts = echart
          .map((item) => `${item[0]} ${item[1]} ${item[2]}`)
          .join("\n");
        handleDownloadTxt(txts);
        return;
    }
  };

  function reloadPortList() {
    DeviceCommunicator.list()
      .then((list) => {
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
    set_isBtnDisabled(false);
    communicator = new DeviceCommunicator(currentPort, onDataReceived, isMock);
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

  // 透传接受的数据
  // 载荷温度
  const [payloadTemperature, setPayloadTemperature] = useState({
    // 温控开关
    switch: false,
    // 温度1
    temperature1: 0,
    // 温度2
    temperature2: 0,
    // 温度3
    temperature3: 0,
    // 采样方式
    method: 0,
  });

  function onDataReceived(list: { id: TLVType; string: string; value: any }[]) {
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
        case TLVType.协议透传接收:
          let value = data.value;
          const payload =
            value.data.method === 1
              ? value.data.temperature1
              : value.data.method === 2
              ? value.data.temperature2
              : value.data.temperature3;
          // 开始解析payload
          setPayloadTemperature(value.data);
          log.info("温度:", `${value.data.method} ${payload} ℃`);
          const formattedNow = dayjs().format("YYYY-MM-DD HH:mm:ss.SSS");
          setEchart((prevNumbers) => [
            ...prevNumbers,
            [formattedNow, payload, value.data.method],
          ]);
          break;
        default:
          // log.info(data.string, JSON.stringify(data.value));
          break;
      }
    });
  }

  function onSendCommand(command: Buffer) {
    console.log("发送 = ", command.toString("hex"));

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
    <Card className="p-2 w-full h-full select-none " bg="gray.100">
      <div className="w-full h-full flex space-x-2">
        <Card className="w-[550px]">
          <PlantCom
            controlCurrentAttitude={controlCurrentAttitude}
            ptzCurrentAttitude={ptzCurrentAttitude}
            ptzExpectAttitude={ptzExpectAttitude}
            devicePosition={devicePosition}
            deviceStatus={deviceStatus}
          />
        </Card>

        <Card className="w-full">
          {/* 连接 */}
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

              {isBtnDisabled ? (
                <Button
                  isDisabled={
                    currentPtz === undefined || currentPort === undefined
                  }
                  colorScheme="green"
                  onClick={handlePortStart}
                >
                  连接
                </Button>
              ) : (
                <Button colorScheme="red" onClick={handlePortClose}>
                  断开
                </Button>
              )}
            </Flex>
          </Card>

          {JSON.stringify(currentPtz)}
          <AppSend
            isDisabled={isBtnDisabled}
            ptz={currentPtz}
            onSendCommand={onSendCommand}
            ptzCurrentAttitude={ptzCurrentAttitude}
            ptzExpectAttitude={ptzExpectAttitude}
            payloadTemperature={payloadTemperature}
            exportFile={exportFile}
          />

          <div className={`${isBtnDisabled ? "none" : "black"} w-full h-full`}>
            <EchartTemperature
              echart={echart}
              method={payloadTemperature.method}
            />
          </div>
        </Card>
      </div>
    </Card>
  );
}

export default App;
