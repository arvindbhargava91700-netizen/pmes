import React from "react";
import {
  Building2,
  CheckCircle,
  Clock,
  AlertTriangle,
  IndianRupee,
  TrendingUp,
  FileText,
  MessageSquare,
} from "lucide-react";
import { IconTrendingUp, IconTrendingDown } from "@tabler/icons-react";
import QuickActions from "@/components/Admin/dashboard/QuickActions";
import RecentProject from "@/components/Admin/dashboard/RecentProjects";
import PerformanceScorecard from "@/components/Admin/dashboard/PerformanceScorecard";

export default function Dashboard() {
  const cardData = [
    {
      title: "Total Projects",
      value: "127",
      subtext: "Across all zones",
      trend: "8%",
      trendColor: "text-green-600",
      icon: Building2,
      themeColor: "blue",
    },
    {
      title: "Completed",
      value: "48",
      subtext: "38% completion rate",
      trend: "12%",
      trendColor: "text-green-600",
      icon: CheckCircle,
      themeColor: "green",
    },
    {
      title: "Delayed Projects",
      value: "18",
      subtext: "Requiring attention",
      trend: "3%",
      trendColor: "text-red-500",
      icon: Clock,
      themeColor: "yellow",
    },
    {
      title: "Critical",
      value: "5",
      subtext: ">30 days overdue",
      trend: "2%",
      trendColor: "text-red-500",
      icon: AlertTriangle,
      themeColor: "red",
    },
    {
      title: "Total Budget",
      value: "₹248 Cr",
      subtext: "FY 2024-25",
      icon: IndianRupee,
      themeColor: "blue",
    },
    {
      title: "Amount Released",
      value: "₹156 Cr",
      subtext: "63% utilized",
      icon: TrendingUp,
      themeColor: "green",
    },
    {
      title: "Pending Bills",
      value: "23",
      subtext: "Worth ₹12.4 Cr",
      icon: FileText,
      themeColor: "yellow",
    },
    {
      title: "Open Grievances",
      value: "14",
      subtext: "3 SLA breached",
      icon: MessageSquare,
      themeColor: "red",
    },
  ];

  const getThemeClasses = (color) => {
    const themes = {
      blue: {
        border: "border-blue-500",
        iconBg: "bg-blue-600/10",
        iconText: "text-blue-600",
        circle: "bg-blue-200",
      },
      green: {
        border: "border-green-500",
        iconBg: "bg-green-600/10",
        iconText: "text-green-600",
        circle: "bg-green-200",
      },
      yellow: {
        border: "border-yellow-500",
        iconBg: "bg-yellow-600/10",
        iconText: "text-yellow-600",
        circle: "bg-yellow-200",
      },
      red: {
        border: "border-red-500",
        iconBg: "bg-red-600/10",
        iconText: "text-red-600",
        circle: "bg-red-200",
      },
    };
    return themes[color] || themes.blue;
  };

  return (
    <div className="bg-gray-50 p-6 pt-20 ">
      {/* cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cardData.map((item, index) => {
          const theme = getThemeClasses(item.themeColor);
          const IconComponent = item.icon;

          return (
            <div
              key={index}
              className={`bg-white rounded-xl p-5 hover:shadow-xl border-l-4 ${theme.border} shadow-sm flex justify-between relative overflow-hidden transition-all duration-300 group cursor-pointer`}
            >
              <div className="relative z-10">
                <p className="text-sm text-gray-500 font-medium">
                  {item.title}
                </p>
                <h2 className="text-3xl font-bold mt-1 text-gray-900">
                  {item.value}
                </h2>
                <p className="text-xs text-gray-400 mt-1">{item.subtext}</p>

                {item.trend && (
                  <p className="text-sm text-zinc-500 mt-2 font-medium flex items-center gap-1">
                    <span
                      className={`flex items-center gap-1 ${item.trendColor}`}
                    >
                      {item.trendColor.includes("green") ? (
                        <IconTrendingUp className="w-4 h-4" />
                      ) : (
                        <IconTrendingDown className="w-4 h-4" />
                      )}
                      {item.trend}
                    </span>
                    vs last month
                  </p>
                )}
              </div>

              <div
                className={`h-12 w-12 p-2.5 rounded-xl flex justify-center items-center z-10 ${theme.iconBg} ${theme.iconText}`}
              >
                <IconComponent size={24} />
              </div>

              <div
                className={`h-32 w-32 ${theme.circle} absolute -top-16 -right-16 rounded-full opacity-40`}
              ></div>
            </div>
          );
        })}
      </div>

      <QuickActions />

      <RecentProject />

      <PerformanceScorecard />
    </div>
  );
}
