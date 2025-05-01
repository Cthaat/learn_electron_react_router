import { useStatistics } from "../useStatistics";
import { useMemo, useEffect, useState } from "react";
import { Chart } from "../Chart";

export default function RamView() {
  const statistics = useStatistics(20); // 显示更多数据点
  const [totalMemory, setTotalMemory] = useState<number>(0);

  // 获取内存静态信息
  useEffect(() => {
    async function fetchStaticData() {
      try {
        const data = await window.electron.getStaticData();
        setTotalMemory(data.totalMemoryGB);
      } catch (error) {
        console.error("获取内存信息失败", error);
      }
    }

    fetchStaticData();
  }, []);

  const ramUsages = useMemo(
    () => statistics.map((stat) => stat.ramUsage),
    [statistics]
  );

  const currentRamUsage =
    ramUsages.length > 0 ? ramUsages[ramUsages.length - 1] : 0;

  return (
    <div className="ram-view">
      <h1>内存监控</h1>

      <div className="ram-info">
        <div className="ram-total">
          <h3>总内存</h3>
          <p>{totalMemory.toFixed(2)} GB</p>
        </div>

        <div className="ram-usage">
          <h3>当前使用率</h3>
          <div className="usage-indicator">
            <div
              className="usage-bar"
              style={{
                width: `${currentRamUsage}%`,
                backgroundColor:
                  currentRamUsage > 85
                    ? "red"
                    : currentRamUsage > 70
                    ? "orange"
                    : "#61dafb",
              }}
            />
            <span>{currentRamUsage.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* 将图表包装在固定高度的容器中 */}
      <div className="ram-chart">
        <div className="data-visualization-title">内存使用率历史</div>
        <div className="chart-container">
          <Chart data={ramUsages} title="" height={250} />
        </div>
      </div>
    </div>
  );
}
