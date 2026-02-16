"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import RoomCanvas from "@/components/RoomCanvas";

export default function CanvasPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [pwd, setPwd] = useState<string | undefined>(undefined);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const storedPwd = sessionStorage.getItem("room_pwd");
    if (storedPwd) {
      setPwd(storedPwd);
      sessionStorage.removeItem("room_pwd");
    }
    setReady(true);
  }, []);

  if (!ready) return null;

  return (
    <div>
      <RoomCanvas slug={slug} initialPassword={pwd} />
    </div>
  );
}
