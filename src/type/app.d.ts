/**飞控当前姿态角 */
interface IControlAttitude {
  /**俯仰角 F32 deg */
  pitch: number;
  /**滚转角 F32 deg */
  roll: number;
  /**航向角 F32 deg */
  yaw: number;
  /**计数器 U8 每次发送数据+1 */
  count: number;
}

/**云台当前姿态角
 * 云台的姿态角与设备经纬高及飞控当前姿态角中频率最慢的一致
 */
interface IPtzAttitude {
  /**俯仰角 F32 deg */
  pitch: number;
  /**滚转角 F32 deg */
  roll: number;
  /**航向角 F32 deg */
  yaw: number;
  /**计数器 U8 每次发送数据+1 */
  count: number;
}

/**设备经纬高 */
interface Iposition {
  /**定位模式
   * bit6~bit0:表示定位模式:
    number:未定位、
    2:2D 定位;
    3:3D 定位;
    4:伪距差分定位;
    5:RTK
    6:RTK 高精度

    bit7:表示定位质量
    1 高质量定位;
    number 一般精度定位
   */
  mode: number;
  /**经度 S32 1e-7deg */
  lng: number;
  /**纬度 S32 1e-7deg */
  lat: number;
  /**高度 S32 mm */
  alt: number;
  /**计数器 U8 每次发送数据+1 */
  count: number;
}

/**云台期望姿态角（云台坐标系）及设备运行模式及状态 */
interface IPtzExpectlAttitude {
  /**俯仰角 F32 deg */
  pitch: number;
  /**滚转角 F32 deg */
  roll: number;
  /**航向角 F32 deg */
  yaw: number;

  /**运行模式 U8 */
  mode: number;
  /**运行状态 U8
   * 0：设备状态正常;
   * 1：GPS未定位(详细信息请解析设备经纬高所在帧)
   * 2：解姿态错误
   * 3：目标经纬度未设置；
   * 4：未收到G3数据；
   * 5：计算出的云台俯仰角过大；
   * 6：计算出的云台偏航角过大；
   * 7：计算出的云台俯仰角和偏航角均过大；
   *
   * 云台期望姿态角及设备运行模式及状态与设备经纬高及飞控当前姿态角中频率最慢的一致
   */
  status: number;
  /**计数器 U8 每次发送数据+1 */
  count: number;
}

/**设备状态 */
interface IDeviceStatus {
  /**温度 S16 number.01° */
  temperature: number;
  /**主电压 U16 mV */
  main_voltage: number;
  /**系统电压 U16 mV */
  sys_voltage: number;
  /**芯片电压 U16 mV */
  chip_voltage: number;
  /**电源及IO状态 U16 */
  power_io_status: number;
  /**计数器 U8 每次发送数据+1 */
  count: number;
}

/**协议透传接收 */
interface IPassThrough {
  /**类型 */
  type: number;
  /**数据 */
  data: any;
  /**计数器 U8 每次发送数据+1 */
  count?: number;
}
