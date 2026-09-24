"use client";

import { useEffect, useState, type ComponentPropsWithRef } from "react";
import { setQueryParams } from "@/utils/queryParams";

type QueryParamIframeProps = ComponentPropsWithRef<"iframe">;

/** Adds the current page query parameters to an iframe URL after mount. */
export default function QueryParamIframe({ src, ...props }: QueryParamIframeProps) {
  const source = typeof src === "string" ? src : "";
  const [iframeSrc, setIframeSrc] = useState(source);

  useEffect(() => {
    setIframeSrc(setQueryParams(source));
    const handleLocationChange = () => {
      setIframeSrc(setQueryParams(source));
    };
    window.addEventListener("popstate", handleLocationChange);
    return () => window.removeEventListener("popstate", handleLocationChange);
  }, [source]);

  return <iframe {...props} src={iframeSrc} />;
}
