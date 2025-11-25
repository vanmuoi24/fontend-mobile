import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getChartById } from "../../service/ChartAPI";

const CustomTooltip = React.memo(({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div
      style={{
        background: "#222",
        color: "#fff",
        padding: 10,
        borderRadius: 6,
        boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
        fontSize: 13,
      }}
    >
      <div>📅 {label}</div>
      {payload.map((p) => (
        <div key={p.dataKey}>
          {p.name}: <b>{p.value}</b>
        </div>
      ))}
    </div>
  );
});

const DynamicChart = () => {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [xKey, setXKey] = useState("date");
  const [yKeys, setYKeys] = useState([]);
  const [chartName, setChartName] = useState("Biểu đồ dữ liệu");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getChartById(id);
        if (!res) return;

        // ✅ Giả sử API trả về có dạng:
        // { id: 1, name: "Stress chart", data: "[{...}, {...}]" }
        const chartData = Array.isArray(res.data)
          ? res.data
          : JSON.parse(res.data);

        if (chartData.length > 0) {
          // Tìm key cho trục X (ưu tiên "date", "time", "day"…)
          const keys = Object.keys(chartData[0]);
          const possibleX = keys.find((k) =>
            ["date", "time", "day", "label"].includes(k.toLowerCase())
          );
          const xKeyDetected = possibleX || keys[0];

          // Các key còn lại là trục Y
          const yKeysDetected = keys.filter((k) => k !== xKeyDetected);

          setXKey(xKeyDetected);
          setYKeys(yKeysDetected);
          setData(chartData);
          setChartName(res.name || "Biểu đồ dữ liệu");
        }
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
      }
    };

    fetchData();
  }, [id]);

  const colors = useMemo(
    () => [
      "#8884d8",
      "#82ca9d",
      "#ffc658",
      "#ff7300",
      "#0088FE",
      "#00C49F",
      "#FFBB28",
      "#FF8042",
      "#d62728",
      "#9467bd",
    ],
    []
  );

  const chart = useMemo(() => {
    if (data.length === 0) return <p>Đang tải dữ liệu...</p>;

    return (
      <ResponsiveContainer width="100%" height={420}>
        <LineChart
          data={data}
          margin={{ top: 20, right: 50, left: 10, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="4 4" />
          <XAxis dataKey={xKey} tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="top" align="left" height={36} />

          {yKeys.map((key, index) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              name={key}
              stroke={colors[index % colors.length]}
              strokeWidth={2}
              dot={false}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    );
  }, [data, xKey, yKeys, colors]);

  return (
    <div style={{ width: "100%", padding: 16, position: "relative" }}>
      <h3>{chartName}</h3>
      {chart}
    </div>
  );
};

export default DynamicChart;
