import { useRef, useEffect, useState } from "react";
import { Game } from "@/draw/Game";
import { Tool } from "@/draw/tools";
import { KeyBoardShortcuts } from "@/hooks/KeyBoardShortcuts";
import { TopBar } from "./TopBar";
import { LeftSidebar } from "./LeftSidebar";
import { ZoomControls } from "./ZoomControls";

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
  const [scale, setScale] = useState(1);

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
      g.setScaleChangeCallback(setScale);
      setGame(g);

      return () => {
        g.destroy();
      };
    }
  }, [canvasRef]);

  //for responsive canvas on window resize specially on mobile and tablet
  useEffect(() => {
  const handleResize = () => {
    if (canvasRef.current) {
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;
      game?.clearCanvas();
    }
  };
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, [game]);

  KeyBoardShortcuts(setSelectedTool, game);

  return (
    <div className="w-full h-full overflow-hidden" style={{ touchAction: 'none' }}> {/* prevent the default touch actions like zoom and scroll on mobile and tablet*/}
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
      <ZoomControls game={game} scale={scale} />
    </div>
  );
}

