import { useStatistics } from "../useStatistics";
import { useMemo } from "react";
import { Chart } from "../Chart";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const statistics = useStatistics(10);
  const navigate = useNavigate();

  const cpuUsages = useMemo(
    () => statistics.map((stat) => stat.cpuUsage * 100),
    [statistics]
  );

  const ramUsage = useMemo(
    () => statistics.map((stat) => stat.ramUsage * 100),
    [statistics]
  );

  const storageUsage = useMemo(
    () => statistics.map((stat) => stat.storageUsage * 100),
    [statistics]
  );

  return (
    <div className="dashboard">
      <h1>系统资源监控仪表盘</h1>

      <div className="dashboard-grid">
        <div className="dashboard-card" onClick={() => navigate("/cpu")}>
          <h2>CPU 使用率</h2>
          <div>
            <Chart data={cpuUsages} />
          </div>
        </div>

        <div className="dashboard-card" onClick={() => navigate("/ram")}>
          <h2>内存使用率</h2>
          <div>
            <Chart data={ramUsage} />
          </div>
        </div>

        <div className="dashboard-card" onClick={() => navigate("/storage")}>
          <h2>存储使用率</h2>
          <div>
            <Chart data={storageUsage} />
          </div>
        </div>
      </div>
    </div>
  );
}
