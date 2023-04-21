import type { ReactNode } from "react";
import { CopyWithCheckmark } from "../copy-with-check";

export const CodeWindow = ({
  content,
  text,
}: {
  content: ReactNode;
  text: string;
}) => {
  return (
    <div
      data-testid="code-window"
      className="mt-3 whitespace-pre max-h-60 text-xl flex border-dark-200 border border-2 p-5 rounded-md w-full"
    >
      <code
        data-testid="code-window-content"
        className="text-left overflow-y-scroll overflow-x-scroll w-full scrollbar-hide"
      >
        {content}
      </code>
      <CopyWithCheckmark text={text} />
    </div>
  );
};
