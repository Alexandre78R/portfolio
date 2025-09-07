type DashboardCardProps = {
  key ?: number | string;
  title: string;
  value: number;
  icon?: React.ReactNode;
  color?: string;
};

export default function DashboardCard({
  title,
  value,
  icon,
  color = "from-blue-500 to-blue-400",
}: DashboardCardProps) {
  return (
    <div
      className={`
        flex flex-col items-start gap-3 rounded-2xl p-6 shadow-md
        bg-body border border-gray-200 border-gray-700
        transition-transform hover:scale-105 hover:shadow-xl duration-200
      `}
    >
      <div
        className={`
          p-3 rounded-xl bg-gradient-to-tr ${color} text-white shadow
          flex items-center justify-center
        `}
      >
        {icon}
      </div>
      <div className="flex flex-col gap-1 mt-2">
        <h4 className="text-xs uppercase tracking-wide text-gray-500 text-gray-400 font-semibold">{title}</h4>
        <span className="
          text-3xl font-extrabold text-text animate-pulse
        ">
          {value}
        </span>
      </div>
    </div>
  );
}