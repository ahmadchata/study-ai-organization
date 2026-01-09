import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import "./styles.css";
import { useQuery } from "@tanstack/react-query";
import { DashboardAPI } from "../../../api/DashboardAPI";

import { ResponsiveContainer } from "recharts";
import LoadingTracker from "../Loading";

const EngagementChart = () => {
  const { data: engagements, isFetching } = useQuery({
    queryKey: ["engagements"],
    refetchOnMount: false,
    queryFn: () => DashboardAPI.getEngagements(true),
  });

  // const data = [
  //   {
  //     name: "Mon",
  //     students: 1000,
  //   },
  //   {
  //     name: "Tue",
  //     students: 900,
  //   },
  //   {
  //     name: "Wed",
  //     students: 1500,
  //   },
  //   {
  //     name: "Thur",
  //     students: 2000,
  //   },
  //   {
  //     name: "Fri",
  //     students: 2,
  //   },
  //   {
  //     name: "Sat",
  //     students: 980,
  //   },
  //   {
  //     name: "Sun",
  //     students: 700,
  //   },
  // ];

  if (isFetching) {
    return <LoadingTracker />;
  }

  console.log(engagements?.data?.engagement_data);

  return (
    <ResponsiveContainer width={700} height="90%">
      <AreaChart
        data={engagements?.data?.engagement_data}
        margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
      >
        <XAxis dataKey="day" />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="students_count"
          stroke="#0c7a50"
          fill="#ddf1e9"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default EngagementChart;
