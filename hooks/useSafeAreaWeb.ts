import { useEffect, useState } from "react";
import { Platform } from "react-native";

/**
 * Hook that returns an estimated bottom inset (in px) for web environments.
 * It uses window.visualViewport where available to detect overlays (virtual
 * keyboards, OS taskbars in some browser/hosted modes) which reduce the
 * visible viewport. Returns { bottom } where bottom is 0 when no inset
 * detected.
 */
export default function useSafeAreaWeb() {
  const [bottom, setBottom] = useState<number>(0);

  useEffect(() => {
    if (Platform.OS !== "web") return;

    const calcInset = () => {
      try {
        let inset = 0;
        const vv: any = (window as any).visualViewport;
        if (vv && typeof vv.height === "number") {
          // innerHeight is the layout viewport height; visualViewport.height is
          // the visual portion available (excludes overlays). The difference is
          // a good approximation of bottom inset when overlays sit on top.
          const innerH = window.innerHeight || document.documentElement.clientHeight;
          inset = Math.max(0, innerH - vv.height - (vv.offsetTop || 0));
        } else {
          // fallback: difference between innerHeight and clientHeight
          const docH = document.documentElement.clientHeight;
          inset = Math.max(0, window.innerHeight - docH);
        }

        // ignore tiny differences
        if (inset < 4) inset = 0;
        setBottom(inset);
      } catch (e) {
        setBottom(0);
      }
    };

    calcInset();

    const vv: any = (window as any).visualViewport;
    if (vv) {
      vv.addEventListener("resize", calcInset);
      vv.addEventListener("scroll", calcInset);
    }
    window.addEventListener("resize", calcInset);

    return () => {
      if (vv) {
        vv.removeEventListener("resize", calcInset);
        vv.removeEventListener("scroll", calcInset);
      }
      window.removeEventListener("resize", calcInset);
    };
  }, []);

  return { bottom };
}
