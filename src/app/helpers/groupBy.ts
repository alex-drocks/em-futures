import {IDailyData} from "../components/futures/futures.definitions";
import * as dayjs from "dayjs";
import * as isoWeek from "dayjs/plugin/isoWeek";

dayjs.extend(isoWeek);

export function groupByYear(data: IDailyData[]): Record<string, IDailyData[]> {
  return data.reduce((acc, currentData) => {
    const year = dayjs(currentData.date).isoWeekYear();

    if (!acc[year]) {
      acc[year] = [];
    }

    acc[year].push(currentData);

    return acc;
  }, {} as Record<string, IDailyData[]>);
}

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

export function groupByWeek(data: IDailyData[]): Record<string, IDailyData[]> {
  return data.reduce((acc, currentData) => {
    const year = dayjs(currentData.date).isoWeekYear();
    const week = dayjs(currentData.date).isoWeek();

    const weekYearKey = `${year}-W${week.toString().padStart(2, '0')}`;

    if (!acc[weekYearKey]) {
      acc[weekYearKey] = [];
    }

    acc[weekYearKey].push(currentData);

    return acc;
  }, {} as Record<string, IDailyData[]>);
}
