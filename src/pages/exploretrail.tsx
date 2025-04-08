import React, { useEffect, useState } from "react";
import TrailCardGrid from "@/components/ui/alltrailcard";
import { Trail } from "@/components/ui/filter";
import Traildata from "@/data/trails.json";

const trailsData: Trail[] = Traildata; // 將 JSON 資料賦值給 trailsData

const TrailsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900">
      <TrailCardGrid trails={trailsData} />
    </div>
  );
};

export default TrailsPage;