import React from "react";
import { faClockRotateLeft, faFileDownload, faCheckCircle, faGavel } from "@fortawesome/free-solid-svg-icons";
// components

import CardStats from "../../components/Cards/CardStats";

export default function HeaderStats() {
  return (
    <>
      {/* Header */}
      <div className="relative bg-black md:pt-32 pb-32 pt-12">
        <div className="px-4 md:px-10 mx-auto w-full">
          <div>
            {/* Card stats */}
            <div className="flex flex-wrap">
              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <CardStats
                  statSubtitle="Pending Document"
                  statTitle="10"
                  statArrow="up"
                  statPercent=""
                  statPercentColor="text-emerald-500"
                  statDescripiron="Since last month"
                  statIconName={faClockRotateLeft}
                  statIconColor="bg-yellow-500"
                />
              </div>
              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <CardStats
                  statSubtitle="NEW Document"
                  statTitle="2"
                  statArrow="down"
                  statPercent=""
                  statPercentColor="text-red-500"
                  statDescripiron="Since last week"
                  statIconName={faFileDownload}
                  statIconColor="bg-orange-500"
                />
              </div>
              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <CardStats
                  statSubtitle="Total Document Sign"
                  statTitle="45"
                  statArrow="down"
                  statPercent=""
                  statPercentColor="text-orange-500"
                  statDescripiron="Since yesterday"
                  statIconName={faCheckCircle}
                  statIconColor="bg-green-500"
                />
              </div>
              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <CardStats
                  statSubtitle="Document With Dispute"
                  statTitle="2"
                  statArrow="up"
                  statPercent=""
                  statPercentColor="text-emerald-500"
                  statDescripiron="Since last month"
                  statIconName={faGavel}
                  statIconColor="bg-red-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
