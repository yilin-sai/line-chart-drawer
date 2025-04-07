import { useEffect } from "react";
import debounce from "lodash.debounce";
import { Property } from "csstype";

/**
 * A React hook to draw connecting lines between DOM elements, typically for creating a line chart.
 *
 * @param {string} elementIdPrefix - The prefix for the IDs of the elements to connect. Each element should have an id of the format {elementIdPrefix}_{index}, where index is the index of the element when connecting.
 * @param {string} chartContainerId - The ID of the container element where the lines will be drawn.
 * @param {Object} config - Configuration object for line drawing:
 * @param {Property.Color} config.color - The color of the line.
 * @param {number} [config.strokeWidth=2] - The width of the line (default is 2).
 * @param {boolean} [config.dashed=false] - Whether the line should be dashed (default is false).
 *
 * @returns {Object} An object containing methods to manage line drawing:
 * - `redrawLine`: A function to redraw the connecting lines.
 *
 * @example
 * // Usage example:
 * const { redrawLine } = useLineDrawer("data-point", "chart-container", { color: "#00AEEF" });
 * useEffect(() => { redrawLine() }); // redraw the lines on every rerender.
 *
 */
export function useLineDrawer(
  elementIdPrefix: string,
  chartContainerId: string,
  config: {
    color: Property.Color,
    strokeWidth?: number,
    dashed?: boolean,
  }
) {
  const drawConnectingLines = () => {
    const svgNS = "http://www.w3.org/2000/svg";
    const container = document.getElementById(chartContainerId);
    const elements = document.querySelectorAll(`[id^="${elementIdPrefix}_"]`);

    if (elements.length === 0) {
      return;
    }

    const containerRect = container!.getBoundingClientRect();

    // const existingSvg = document.getElementById(dotElementKey);
    // if (existingSvg) console.warn("line-chart-drawer", "line already exists!");

    const svg = document.createElementNS(svgNS, "svg");
    svg.id = elementIdPrefix;
    svg.style.position = "absolute";
    svg.style.top = "0";
    svg.style.left = "0";
    svg.style.width = containerRect.width + "px";
    svg.style.height = "100%";
    svg.style.pointerEvents = "none";
    container!.appendChild(svg);

    elements.forEach((el, index) => {
      if (index < elements.length - 1) {
        const nextEl = elements[index + 1];
        const line = document.createElementNS(svgNS, "line");
        const rect1 = el.getBoundingClientRect();
        const rect2 = nextEl.getBoundingClientRect();
        const x1 = rect1.left + rect1.width / 2 - containerRect.left;
        const y1 = rect1.top + rect1.height / 2 - containerRect.top;
        const x2 = rect2.left + rect2.width / 2 - containerRect.left;
        const y2 = rect2.top + rect2.height / 2 - containerRect.top;
        line.setAttribute("x1", String(x1));
        line.setAttribute("y1", String(y1));
        line.setAttribute("x2", String(x2));
        line.setAttribute("y2", String(y2));

        line.setAttribute("stroke", config.color);
        line.setAttribute("stroke-width", String(config.strokeWidth ?? 2));
        if (config.dashed === true) line.setAttribute("stroke-dasharray", "4 2");

        svg.appendChild(line);
      }
    });
  };

  const redrawLine = () => {
    const svg = document.getElementById(elementIdPrefix);
    if (svg) svg.remove();
    drawConnectingLines();
  };

  useEffect(() => {
    drawConnectingLines();

    const handleResize = debounce(() => {
      drawConnectingLines();
    }, 200);

    const onResizeStart = () => {
      const svg = document.getElementById(elementIdPrefix);
      if (svg) svg.remove();
    };

    window.addEventListener("resize", onResizeStart);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", onResizeStart);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return { redrawLine };
}
