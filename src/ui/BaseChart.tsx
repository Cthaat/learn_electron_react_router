import React, { useRef, useEffect, useState } from "react";

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
 * @param {number} width - 图表宽度(可选，如果未提供则自适应容器)
 * @param {number} height - 图表高度(可选，默认300)
 * @param {string} barColor - 条形颜色(可选，默认蓝色)
 * @param {string} backgroundColor - 背景颜色(可选，默认白色)
 * @param {string} title - 图表标题(可选)
 */
const BaseChart: React.FC<BaseChartProps> = ({
  data,
  width,
  height = 300,
  barColor = "#4299e1",
  backgroundColor = "#ffffff",
  title,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  // 检测容器宽度变化
  useEffect(() => {
    if (!containerRef.current) return;

    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };

    // 初始化宽度
    updateWidth();

    // 创建ResizeObserver来监听容器大小变化
    const observer = new ResizeObserver(updateWidth);
    observer.observe(containerRef.current);

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  // 实际使用的图表宽度，优先使用props中提供的宽度，否则使用容器宽度
  const effectiveWidth = width || containerWidth || 400;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || data.length === 0 || effectiveWidth === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 设置canvas的实际尺寸
    canvas.width = effectiveWidth;
    canvas.height = height;

    // 清除画布
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, effectiveWidth, height);

    // 设置边距
    const margin = { top: 30, right: 20, bottom: 30, left: 40 };
    const chartWidth = effectiveWidth - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // 找出数据的最大值，用于缩放
    const maxValue = Math.max(...data, 0.1); // 防止所有值为0的情况

    // 计算每个条形的宽度
    const barWidth = Math.max(1, chartWidth / data.length - 2); // 每个条形之间有2px间隔，最小宽度为1px

    // 绘制标题（如果提供）
    if (title) {
      ctx.fillStyle = "#000000";
      ctx.font = "16px Arial";
      ctx.textAlign = "center";
      ctx.fillText(title, effectiveWidth / 2, 20);
    }

    // 绘制坐标轴
    ctx.strokeStyle = "#000000";
    ctx.beginPath();
    ctx.moveTo(margin.left, height - margin.bottom);
    ctx.lineTo(effectiveWidth - margin.right, height - margin.bottom);
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

      // 在条形下方添加索引标签（如果空间足够）
      if (barWidth > 10) {
        ctx.fillStyle = "#000000";
        ctx.font = "10px Arial";
        ctx.textAlign = "center";
        ctx.fillText(`${index}`, x + barWidth / 2, height - margin.bottom + 15);
      }

      // 在条形上方添加值标签（如果空间足够）
      if (barWidth > 20) {
        ctx.fillText(
          `${value.toFixed(2)}`,
          x + barWidth / 2,
          height - margin.bottom - barHeight - 5
        );
      }
    });
  }, [data, effectiveWidth, height, barColor, backgroundColor, title]);

  return (
    <div
      className="base-chart-container"
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          objectFit: "contain",
        }}
      />
    </div>
  );
};

export default BaseChart;
