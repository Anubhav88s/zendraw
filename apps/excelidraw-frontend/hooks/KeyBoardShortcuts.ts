
import { useEffect } from "react";
import { Tool } from "@/draw/tools";
import { Game } from "@/draw/Game";

export function KeyBoardShortcuts(setSelectedTool: (tool: Tool) => void, game?: Game) {
    useEffect(() => {
        function onKeyDown(e: KeyboardEvent) {
            // Zoom shortcuts (Ctrl + key)
            if (e.ctrlKey || e.metaKey) {
                if (e.key === "=" || e.key === "+") {
                    e.preventDefault();
                    game?.zoomIn();
                    return;
                } else if (e.key === "-") {
                    e.preventDefault();
                    game?.zoomOut();
                    return;
                } else if (e.key === "0") {
                    e.preventDefault();
                    game?.resetZoom();
                    return;
                }
            }

            // Tool shortcuts (no modifier keys)
            switch (e.key) {
                case "1":
                    setSelectedTool("selection");
                    break;
                case "2":
                    setSelectedTool("rect");
                    break;
                case "3":
                    setSelectedTool("diamond");
                    break;
                case "4":
                    setSelectedTool("circle");
                    break;
                case "5":
                    setSelectedTool("arrow");
                    break;
                case "6":
                    setSelectedTool("line");
                    break;
                case "7":
                    setSelectedTool("pencil");
                    break;
                 case "8":
                    setSelectedTool("text");
                    break;
                case "9":
                    setSelectedTool("eraser");
                    break;
                case "0":
                    setSelectedTool("pan");
                    break;
            }
        }
        window.addEventListener("keydown", onKeyDown);
        return () => {
            window.removeEventListener("keydown", onKeyDown);
        }
    }, [setSelectedTool, game]);
}
