import {IDailyData} from "../app.definitions";
import * as dayjs from "dayjs";

export function groupByMonth(data: IDailyData[]): Record<string, IDailyData[]> {
  return data.reduce((acc, currentData) => {
    const monthYear = dayjs(currentData.date).format('YYYY-MM');

    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }

    acc[monthYear].push(currentData);

    return acc;
  }, {} as Record<string, IDailyData[]>);
}
