import type { ReactNode } from "react";
import { useState, useEffect } from "react";
// @ts-ignore
import CopyToClipboard from "react-copy-to-clipboard";

import { Copy } from "../icons/copy";
import { Tick } from "../icons/tick";

interface CopyWithCheckmarkProps {
  children?: ReactNode;
  text: string;
}

export function CopyWithCheckmark({ text, children }: CopyWithCheckmarkProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined;
    if (copied) {
      timeout = setTimeout(() => {
        setCopied(false);
      }, 800);
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [copied]);

  return (
    <CopyToClipboard text={text} onCopy={() => setCopied(true)}>
      <span className="cursor-pointer">
        {children}
        {copied ? (
          <Tick className="w-4 ml-3 text-vega-green-550" />
        ) : (
          <Copy className="w-4 ml-3" />
        )}
      </span>
    </CopyToClipboard>
  );
}
