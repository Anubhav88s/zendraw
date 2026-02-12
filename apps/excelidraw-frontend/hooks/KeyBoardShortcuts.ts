
import { useEffect } from "react";
import { Tool } from "@/draw/tools";

export function KeyBoardShortcuts(setSelectedTool: (tool: Tool) => void) {
    useEffect(() => {
        function onKeyDown(e: KeyboardEvent) {
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
            }
        }
        window.addEventListener("keydown", onKeyDown);
        return () => {
            window.removeEventListener("keydown", onKeyDown);
        }
    }, [setSelectedTool]);
}
