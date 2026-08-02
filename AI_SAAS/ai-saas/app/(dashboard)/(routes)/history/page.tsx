"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { History } from "lucide-react";

import { Heading } from "@/components/heading";
import { Card, CardContent } from "@/components/ui/card";
import { Empty } from "@/components/ui/empty";
import { cn } from "@/lib/utils";

const TOOL_COLORS: Record<string, string> = {
  conversation: "text-violet-500",
  code: "text-green-700",
  image: "text-pink-700",
  music: "text-emerald-500",
  video: "text-orange-700",
};

const TOOL_LABELS: Record<string, string> = {
  conversation: "Conversation",
  code: "Code",
  image: "Image",
  music: "Music",
  video: "Video",
};

export default function HistoryPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get("/api/history");
        setHistory(response.data);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div>
      <Heading
        title="Generation History"
        description="Your recent AI generations."
        icon={History}
        iconColor="text-yellow-500"
        bgColor="bg-yellow-500/10"
      />
      <div className="px-4 lg:px-8">
        {loading && (
          <div className="space-y-4 mt-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        )}
        {!loading && history.length === 0 && (
          <Empty label="No generation history yet." />
        )}
        <div className="space-y-3 mt-4">
          {history.map((item) => (
            <Card key={item.id} className="rounded-lg">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {item.prompt}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {TOOL_LABELS[item.toolType] || item.toolType}
                    </p>
                  </div>
                  <span className={cn("text-xs", TOOL_COLORS[item.toolType])}>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
