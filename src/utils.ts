type PtzModeMap = {
  [key: number]: string;
};
export const ptz_status_map: PtzModeMap = {
  0: "设备状态正常",
  1: "GPS未定位",
  2: "解姿态错误",
  3: "目标经纬度未设置",
  4: "未收到G3数据",
  5: "计算出的云台俯仰角过大",
  6: "计算出的云台偏航角过大",
  7: "计算出的云台俯仰角和偏航角均过大",
};

// bit6~bit0:表示定位模式:
// 0:未定位、
// 2:2D 定位;
// 3:3D 定位;
// 4:伪距差分定位;
// 5:RTK
// 6:RTK 高精度
// bit7:表示定位质量
// 1 高质量定位;
// 0 一般精度定位
export const position_mode_map: PtzModeMap = {
  0: "未定位",
  2: "2D 定位",
  3: "3D 定位",
  4: "伪距差分定位",
  5: "RTK",
  6: "RTK 高精度",
};

export const ptz_run_mode_map: PtzModeMap = {
  1: "自动锁定目标",
  2: "自动保持回中",
  3: "手动",
};

interface IPtzOption {
  type: "set" | "center";
  attitude?: {
    roll: number;
    pitch: number;
    yaw: number;
  };
}

interface Iposition {
  lat: number;
  lng: number;
}

/**获取指令 */
export const getCommand = {
  /**云台手动控制 */
  setPtz: (opt: IPtzOption) => {
    if ((opt.type = "center")) {
    } else {
    }
  },

  /**设置目标位置 */
  setTargetPosition: (opt: Iposition) => {},

  /**设备控制模式 */
  setDeviceMode: (opt: {
    mode: "自动锁定" | "自动保持回中" | "手动控制";
    count: number;
  }) => {},
};
