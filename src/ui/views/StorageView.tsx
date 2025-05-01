import { useStatistics } from "../useStatistics";
import { useMemo, useEffect, useState } from "react";
import { Chart } from "../Chart";

export default function StorageView() {
  const statistics = useStatistics(20); // 显示更多数据点
  const [totalStorage, setTotalStorage] = useState<number>(0);

  // 获取存储静态信息
  useEffect(() => {
    async function fetchStaticData() {
      try {
        const data = await window.electron.getStaticData();
        setTotalStorage(data.totalStorage);
      } catch (error) {
        console.error("获取存储信息失败", error);
      }
    }

    fetchStaticData();
  }, []);

  const storageUsages = useMemo(
    () => statistics.map((stat) => stat.storageUsage),
    [statistics]
  );

  const currentStorageUsage =
    storageUsages.length > 0 ? storageUsages[storageUsages.length - 1] : 0;

  // 计算已使用的存储空间（GB）
  const usedStorage = totalStorage * (currentStorageUsage / 100);

  return (
    <div className="storage-view">
      <h1>存储监控</h1>

      <div className="storage-info">
        <div className="storage-stats">
          <div className="storage-stat-item">
            <h3>总存储空间</h3>
            <p>{totalStorage.toFixed(2)} GB</p>
          </div>

          <div className="storage-stat-item">
            <h3>已使用</h3>
            <p>{usedStorage.toFixed(2)} GB</p>
          </div>

          <div className="storage-stat-item">
            <h3>可用</h3>
            <p>{(totalStorage - usedStorage).toFixed(2)} GB</p>
          </div>
        </div>

        <div className="storage-usage">
          <h3>当前使用率</h3>
          <div className="usage-indicator">
            <div
              className="usage-bar"
              style={{
                width: `${currentStorageUsage}%`,
                backgroundColor:
                  currentStorageUsage > 90
                    ? "red"
                    : currentStorageUsage > 75
                    ? "orange"
                    : "#61dafb",
              }}
            />
            <span>{currentStorageUsage.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* 将图表包装在固定高度的容器中 */}
      <div className="storage-chart">
        <div className="data-visualization-title">存储使用率历史</div>
        <div className="chart-container">
          <Chart data={storageUsages} title="" height={250} />
        </div>
      </div>
    </div>
  );
}
