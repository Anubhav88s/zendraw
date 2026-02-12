import { useRef, useEffect, useState } from "react";
import { Game } from "@/draw/Game";
import { Tool } from "@/draw/tools";
import { KeyBoardShortcuts } from "@/hooks/KeyBoardShortcuts";
import { TopBar } from "./TopBar";
import { LeftSidebar } from "./LeftSidebar";

export default function Canvas({
  roomId,
  socket,
}: {
  roomId: string;
  socket: WebSocket;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [game, setGame] = useState<Game>();
  const [selectedTool, setSelectedTool] = useState<Tool>("selection");
  const [bgColor, setBgColor] = useState("#121212");
  const [strokeColor, setStrokeColor] = useState("#ffffff");
  const [lineWidth, setLineWidth] = useState(2);

  useEffect(() => {
    game?.setTool(selectedTool);
  }, [selectedTool, game]);

  useEffect(() => {
    game?.setBgColor(bgColor);
  }, [bgColor, game]);

  useEffect(() => {
    game?.setStrokeColor(strokeColor);
  }, [strokeColor, game]);

  useEffect(() => {
    game?.setLineWidth(lineWidth);
  }, [lineWidth, game]);

  useEffect(() => {
    if (canvasRef.current) {
      const g = new Game(canvasRef.current, roomId, socket);
      setGame(g);

      return () => {
        g.destroy();
      };
    }
  }, [canvasRef]);

  KeyBoardShortcuts(setSelectedTool);

  return (
    <div className="w-full h-full overflow-hidden">
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
      />
      <TopBar selectedTool={selectedTool} setSelectedTool={setSelectedTool} />
      <LeftSidebar
        bgColor={bgColor}
        setBgColor={setBgColor}
        strokeColor={strokeColor}
        setStrokeColor={setStrokeColor}
        lineWidth={lineWidth}
        setLineWidth={setLineWidth}
        canvasRef={canvasRef}
      />
    </div>
  );
}
