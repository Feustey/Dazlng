import { useTranslations } from "next-intl";
import { formatSats } from "@/app/utils/format";

interface NetworkChannel {
  channelId: string;
  capacity: number;
  status: "active" | "inactive" | "closed";
  lastUpdate: Date;
}

interface RecentChannelsProps {
  channels: NetworkChannel[];
}

export default function RecentChannels({ channels }: RecentChannelsProps) {
  const t = useTranslations("Network");

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3 px-4">{t("channelId")}</th>
            <th className="text-left py-3 px-4">{t("capacity")}</th>
            <th className="text-left py-3 px-4">{t("status")}</th>
            <th className="text-left py-3 px-4">{t("lastUpdate")}</th>
          </tr>
        </thead>
        <tbody>
          {channels.map((channel) => (
            <tr key={channel.channelId} className="border-b">
              <td className="py-3 px-4">
                <span className="font-mono text-sm">
                  {channel.channelId.substring(0, 8)}...
                </span>
              </td>
              <td className="py-3 px-4">{formatSats(channel.capacity)}</td>
              <td className="py-3 px-4">
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs ${
                    channel.status === "active"
                      ? "bg-green-500/10 text-green-500"
                      : channel.status === "inactive"
                      ? "bg-orange-500/10 text-orange-500"
                      : "bg-red-500/10 text-red-500"
                  }`}
                >
                  {channel.status}
                </span>
              </td>
              <td className="py-3 px-4">
                {new Date(channel.lastUpdate).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
