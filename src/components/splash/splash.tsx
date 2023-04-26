import classnames from "classnames";
import type { HTMLAttributes } from "react";
import type { ReactNode } from "react";

interface SplashProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

/**
 * Component to display content centered in the middle of the screen
 */
export function Splash({ children, className, ...props }: SplashProps) {
  return (
    <div
      {...props}
      className={classnames(
        "bg-black z-20 fixed flex flex-col items-center justify-start",
        "w-full h-full top-0 left-0 right-0 overflow-y-auto text-white",
        className
      )}
    >
      <div
        className={classnames(
          "flex flex-col justify-center",
          "w-full min-h-full max-w-full p-2"
        )}
      >
        {children}
      </div>
    </div>
  );
}
