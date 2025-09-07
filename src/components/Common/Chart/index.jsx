import {
  AreaChart,
  Area,
  CartesianGrid,
  //   ReferenceLine,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import "./styles.css";

import { ResponsiveContainer } from "recharts";

const EngagementChart = () => {
  const data = [
    {
      name: "Mon",
      students: 1000,
    },
    {
      name: "Tue",
      students: 900,
    },
    {
      name: "Wed",
      students: 1500,
    },
    {
      name: "Thur",
      students: 2000,
    },
    {
      name: "Fri",
      students: 2,
    },
    {
      name: "Sat",
      students: 980,
    },
    {
      name: "Sun",
      students: 700,
    },
  ];

  return (
    <ResponsiveContainer width={700} height="90%">
      <AreaChart
        data={data}
        margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
      >
        <XAxis dataKey="name" />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        {/* <ReferenceLine x="Page C" stroke="green" label="Min" />
        <ReferenceLine
          y={4000}
          label="Max"
          stroke="red"
          strokeDasharray="3 3"
        /> */}
        <Area
          type="monotone"
          dataKey="students"
          stroke="#0c7a50"
          fill="#ddf1e9"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default EngagementChart;
