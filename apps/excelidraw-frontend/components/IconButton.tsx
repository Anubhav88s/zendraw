import { ReactNode } from "react";

export function IconButton({
  icon,
  onClick,
  activated,
  shortcut,
}: {
  icon: ReactNode;
  onClick: () => void;
  activated: boolean;
  shortcut?: string;
}) {
  return (
    <div
      className={`
            relative
            cursor-pointer 
            rounded-md 
            p-1.5 
            transition-all 
            duration-200 
            ease-in-out
            backdrop-blur-sm
            border 
            ${
              activated
                ? "bg-violet-500/20 border-violet-400 text-violet-300 shadow-lg shadow-violet-500/20"
                : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white hover:border-white/20"
            }
            active:scale-95
         `}
      onClick={onClick}
    >
      {icon}
      {shortcut && (
        <span className="absolute bottom-[2px] right-[2px] text-[7px] font-mono text-zinc-500 font-bold">
          {shortcut}
        </span>
      )}
    </div>
  );
}
