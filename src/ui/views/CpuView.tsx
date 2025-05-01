import { useStatistics } from "../useStatistics";
import { useMemo } from "react";
import { Chart } from "../Chart";
import { useLoaderData } from "react-router-dom";

// 为loader函数返回的数据定义类型
export interface CpuLoaderData {
  cpuModel: string;
}

// 添加loader函数
export async function loader() {
  try {
    const data = await window.electron.getStaticData();
    return {
      cpuModel: data.cpuModel,
    };
  } catch (error) {
    console.error("获取CPU信息失败", error);
    return { cpuModel: "未知" };
  }
}

export default function CpuView() {
  const statistics = useStatistics(20); // 显示更多数据点
  // 使用useLoaderData替代useState和useEffect
  const { cpuModel } = useLoaderData() as CpuLoaderData;

  const cpuUsages = useMemo(
    () => statistics.map((stat) => stat.cpuUsage * 100),
    [statistics]
  );

  const currentCpuUsage =
    cpuUsages.length > 0 ? cpuUsages[cpuUsages.length - 1] : 0;

  return (
    <div className="cpu-view">
      <h1>CPU 监控</h1>

      <div className="cpu-info">
        <div className="cpu-model">
          <h3>CPU型号</h3>
          <p>{cpuModel || "加载中..."}</p>
        </div>

        <div className="cpu-usage">
          <h3>当前使用率</h3>
          <div className="usage-indicator">
            <div
              className="usage-bar"
              style={{
                width: `${currentCpuUsage}%`,
                backgroundColor: currentCpuUsage > 80 ? "red" : "#61dafb",
              }}
            />
            <span>{currentCpuUsage.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* 将图表包装在固定高度的容器中 */}
      <div className="cpu-chart">
        <div className="data-visualization-title">CPU 使用率历史</div>
        <div className="chart-container">
          <Chart data={cpuUsages} title="" height={250} />
        </div>
      </div>
    </div>
  );
}
