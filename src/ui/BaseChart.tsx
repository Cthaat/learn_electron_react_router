import React, { useRef, useEffect } from "react";

interface BaseChartProps {
  data: number[];
  width?: number;
  height?: number;
  barColor?: string;
  backgroundColor?: string;
  title?: string;
}

/**
 * BaseChart 组件 - 接受数字数组并渲染简单的条形图
 *
 * @param {number[]} data - 要可视化的数字数组
 * @param {number} width - 图表宽度(可选，默认400)
 * @param {number} height - 图表高度(可选，默认300)
 * @param {string} barColor - 条形颜色(可选，默认蓝色)
 * @param {string} backgroundColor - 背景颜色(可选，默认白色)
 * @param {string} title - 图表标题(可选)
 */
const BaseChart: React.FC<BaseChartProps> = ({
  data,
  width = 400,
  height = 300,
  barColor = "#4299e1",
  backgroundColor = "#ffffff",
  title,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || data.length === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 清除画布
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    // 设置边距
    const margin = { top: 30, right: 20, bottom: 30, left: 40 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // 找出数据的最大值，用于缩放
    const maxValue = Math.max(...data);

    // 计算每个条形的宽度
    const barWidth = chartWidth / data.length - 2; // 每个条形之间有2px间隔

    // 绘制标题（如果提供）
    if (title) {
      ctx.fillStyle = "#000000";
      ctx.font = "16px Arial";
      ctx.textAlign = "center";
      ctx.fillText(title, width / 2, 20);
    }

    // 绘制坐标轴
    ctx.strokeStyle = "#000000";
    ctx.beginPath();
    ctx.moveTo(margin.left, height - margin.bottom);
    ctx.lineTo(width - margin.right, height - margin.bottom);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(margin.left, height - margin.bottom);
    ctx.stroke();

    // 绘制每个条形
    data.forEach((value, index) => {
      // 计算条形高度（按比例缩放到图表高度）
      const barHeight = (value / maxValue) * chartHeight;

      // 计算条形的x坐标
      const x = margin.left + index * (barWidth + 2);

      // 画条形
      ctx.fillStyle = barColor;
      ctx.fillRect(x, height - margin.bottom - barHeight, barWidth, barHeight);

      // 在条形下方添加索引标签
      ctx.fillStyle = "#000000";
      ctx.font = "10px Arial";
      ctx.textAlign = "center";
      ctx.fillText(`${index}`, x + barWidth / 2, height - margin.bottom + 15);

      // 在条形上方添加值标签
      ctx.fillText(
        `${value}`,
        x + barWidth / 2,
        height - margin.bottom - barHeight - 5
      );
    });
  }, [data, width, height, barColor, backgroundColor, title]);

  return (
    <div className="base-chart-container" style={{ margin: "20px 0" }}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{ border: "1px solid #e2e8f0" }}
      />
    </div>
  );
};

export default BaseChart;
