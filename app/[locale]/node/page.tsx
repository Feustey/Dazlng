"use client";

import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

export default function NodePage() {
  const t = useTranslations("Node");

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>{t("lightning")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 border rounded">
              <h2 className="text-lg font-semibold">{t("spendingBalance")}</h2>
              <p className="text-xl">13 873 756 sats</p>
              <p className="text-sm text-muted">€10,636.59</p>
            </div>
            <div className="p-4 border rounded">
              <h2 className="text-lg font-semibold">{t("receiveLimit")}</h2>
              <p className="text-xl">4 516 639 sats</p>
              <p className="text-sm text-muted">€3,462.77</p>
            </div>
            <div className="p-4 border rounded">
              <h2 className="text-lg font-semibold">{t("onChainBalance")}</h2>
              <p className="text-xl">956 603 sats</p>
              <p className="text-sm text-muted">€733.40</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>{t("channels")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("peer")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("type")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("status")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("capacity")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("reserve")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("spending")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("receiving")}
                  </th>
                  <th className="relative px-6 py-3">
                    <span className="sr-only">{t("actions")}</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">Bitrefill</td>
                  <td className="px-6 py-4 whitespace-nowrap">Public</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Online
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">3.0M sats</td>
                  <td className="px-6 py-4 whitespace-nowrap">30.0k sats</td>
                  <td className="px-6 py-4 whitespace-nowrap">2.8M sats</td>
                  <td className="px-6 py-4 whitespace-nowrap">126.8k sats</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <a
                            href="https://mempool.space/tx/d85776127e760129bedb87fd17874e3349ec2aa357f1557e89962bcd817fde1c#flow=&vout=1"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {t("viewFundingTransaction")}
                          </a>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <a
                            href="https://amboss.space/node/03d607f3e69fd032524a867b288216bfab263b6eaee4e07783799a6fe69bb84fac"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {t("viewNodeOnAmboss")}
                          </a>
                        </DropdownMenuItem>
                        <DropdownMenuItem disabled>
                          {t("closeChannel")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
                {/* Ajoutez d'autres lignes de canaux ici */}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
