import { useMemo } from "react";
import BaseChart from "./BaseChart";

export type ChartProps = {
  data: number[];
  title?: string;
  width?: number;
  height?: number;
};

export function Chart(props: ChartProps) {
  // 确保我们有数据可以显示
  const validData = useMemo(() => {
    // 过滤出所有有效的数字
    return props.data.filter((num) => typeof num === "number" && !isNaN(num));
  }, [props.data]);

  return (
    <BaseChart
      data={validData}
      title={props.title || "数据可视化图表"}
      width={props.width}
      height={props.height}
      barColor="#3182ce"
    />
  );
}
