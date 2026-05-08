import { WeeklyInsight, GOAL_STATUS_LABELS } from "@/constants/insight.constants";
import { formatWeekRange } from "./weekUtils";

/**
 * Builds a self-contained HTML string that looks great when rendered to PDF.
 * We generate the HTML ourselves (instead of capturing a DOM element) so the
 * export is theme-independent, works server-side-safe, and produces a
 * predictable, high-quality layout.
 */
function buildInsightHtml(insight: WeeklyInsight): string {
  const weekRange = formatWeekRange(insight.weekStart, insight.weekEnd);
  const generated = new Date(insight.generatedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const reflectionItems = insight.reflection
    .map(
      (point) =>
        `<li style="margin-bottom:10px;padding-left:14px;position:relative;color:#374151;font-size:13px;line-height:1.7;">
          <span style="position:absolute;left:0;top:8px;width:6px;height:6px;border-radius:50%;background:#6366f1;display:inline-block;"></span>
          ${point}
        </li>`,
    )
    .join("");

  const goalStatusColors: Record<string, string> = {
    aligned: "#16a34a",
    partially_aligned: "#ca8a04",
    needs_adjustment: "#dc2626",
  };
  const goalStatusBg: Record<string, string> = {
    aligned: "#f0fdf4",
    partially_aligned: "#fefce8",
    needs_adjustment: "#fef2f2",
  };

  const goalCards = insight.goalSummaries
    .map(
      (g) => `
    <div style="border:1px solid #e5e7eb;border-radius:10px;padding:14px 16px;background:#fff;margin-bottom:12px;">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px;">
        <span style="font-weight:600;font-size:13px;color:#111827;flex:1;margin-right:12px;">${g.goalTitle}</span>
        <span style="font-size:10px;font-weight:700;padding:3px 10px;border-radius:999px;background:${goalStatusBg[g.status]};color:${goalStatusColors[g.status]};white-space:nowrap;">${GOAL_STATUS_LABELS[g.status]}</span>
      </div>
      <p style="font-size:12px;color:#6b7280;margin:0;line-height:1.6;">${g.explanation}</p>
    </div>`,
    )
    .join("");

  const challengeCards = (insight.challengesFaced ?? [])
    .map(
      (c) => `
    <div style="border:1px solid #e5e7eb;border-radius:10px;padding:14px 16px;background:#fff;margin-bottom:14px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
        <span style="font-weight:600;font-size:13px;color:#111827;">${c.title}</span>
        <span style="font-size:10px;font-weight:600;padding:2px 8px;border-radius:999px;background:#f3f4f6;color:#374151;text-transform:uppercase;letter-spacing:0.05em;">${c.challengeType.replace("_", " ")}</span>
      </div>
      <p style="font-size:12px;color:#374151;margin:0 0 6px;"><strong>Evidence:</strong> ${c.evidence}</p>
      <p style="font-size:12px;color:#374151;margin:0 0 8px;"><strong>Why this happens:</strong> ${c.generalizedWhy}</p>
      ${c.solutions.length > 0
          ? `<div>
          <p style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#9ca3af;margin:0 0 4px;">Practical Solutions</p>
          <ul style="margin:0;padding-left:16px;">
            ${c.solutions.map((s) => `<li style="font-size:12px;color:#374151;line-height:1.6;margin-bottom:3px;">${s}</li>`).join("")}
          </ul>
        </div>`
          : ""
        }
    </div>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #fff; color: #111827; }
    .page { width: 794px; padding: 48px 52px; }
    h2 { font-size: 18px; font-weight: 700; color: #111827; margin-bottom: 14px; }
    h3 { font-size: 13px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px; }
    .section { margin-bottom: 28px; }
    .divider { border: none; border-top: 1px solid #e5e7eb; margin: 24px 0; }
    ul { list-style: none; padding: 0; margin: 0; }
  </style>
</head>
<body>
<div class="page">

  <!-- Header -->
  <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:32px;">
    <div>
      <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;color:#6366f1;margin-bottom:6px;">AI Journal · Weekly Insight Report</div>
      <h1 style="font-size:26px;font-weight:800;color:#111827;letter-spacing:-0.02em;">${weekRange}</h1>
      <p style="font-size:12px;color:#9ca3af;margin-top:4px;">${insight.journalCount} journal entr${insight.journalCount === 1 ? "y" : "ies"} analyzed · Generated ${generated}</p>
    </div>
    <div style="text-align:right;">
      <div style="width:52px;height:52px;border-radius:14px;background:linear-gradient(135deg,#6366f1,#8b5cf6);display:flex;align-items:center;justify-content:center;margin-left:auto;">
        <span style="font-size:22px;">✦</span>
      </div>
    </div>
  </div>

  <hr class="divider" />

  <!-- Weekly Reflection -->
  <div class="section">
    <h3>Weekly Reflection</h3>
    <ul style="padding-left:4px;">
      ${reflectionItems}
    </ul>
  </div>

  ${insight.suggestion
      ? `<div class="section" style="background:linear-gradient(135deg,#eef2ff,#f5f3ff);border-radius:12px;padding:18px 20px;">
    <h3 style="color:#6366f1;">AI Guidance</h3>
    <p style="font-size:13px;color:#374151;line-height:1.7;">${insight.suggestion}</p>
  </div>`
      : ""
    }

  ${insight.goalSummaries.length > 0
      ? `<div class="section">
    <h3>Goal Alignment</h3>
    ${goalCards}
  </div>`
      : ""
    }

  ${(insight.challengesFaced ?? []).length > 0
      ? `<div class="section">
    <h3>Challenges Faced</h3>
    ${challengeCards}
  </div>`
      : ""
    }

  <!-- Footer -->
  <hr class="divider" />
  <p style="font-size:10px;color:#d1d5db;text-align:center;">AI Journal · aigoalreflect.online · Exported on ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>

</div>
</body>
</html>`;
}

export async function exportInsightAsPdf(insight: WeeklyInsight): Promise<void> {
  // Dynamic imports keep these heavy libs out of the initial bundle
  const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
    import("jspdf"),
    import("html2canvas"),
  ]);

  const html = buildInsightHtml(insight);

  // Mount a hidden iframe to render the HTML at a fixed width
  const iframe = document.createElement("iframe");
  iframe.style.cssText =
    "position:fixed;top:-9999px;left:-9999px;width:794px;height:1px;border:none;visibility:hidden;";
  document.body.appendChild(iframe);

  const iframeDoc = iframe.contentDocument ?? iframe.contentWindow?.document;
  if (!iframeDoc) {
    document.body.removeChild(iframe);
    throw new Error("Failed to create export frame");
  }

  iframeDoc.open();
  iframeDoc.write(html);
  iframeDoc.close();

  // Wait for fonts / images
  await new Promise<void>((resolve) => {
    if (iframeDoc.readyState === "complete") {
      resolve();
    } else {
      iframe.addEventListener("load", () => resolve(), { once: true });
      setTimeout(resolve, 800); // Fallback
    }
  });

  const pageEl = iframeDoc.querySelector(".page") as HTMLElement;
  if (!pageEl) {
    document.body.removeChild(iframe);
    throw new Error("Export layout not found");
  }

  // Make the iframe tall enough to show all content before capturing
  iframe.style.height = `${pageEl.scrollHeight + 20}px`;

  const canvas = await html2canvas(pageEl, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false,
    windowWidth: 794,
  });

  document.body.removeChild(iframe);

  const A4_WIDTH_MM = 210;
  const A4_HEIGHT_MM = 297;
  const imgWidthMM = A4_WIDTH_MM;
  const imgHeightMM = (canvas.height / canvas.width) * imgWidthMM;

  const pdf = new jsPDF({
    orientation: imgHeightMM > A4_HEIGHT_MM ? "portrait" : "portrait",
    unit: "mm",
    format: imgHeightMM > A4_HEIGHT_MM ? [A4_WIDTH_MM, imgHeightMM] : "a4",
  });

  const imgData = canvas.toDataURL("image/jpeg", 0.95);
  pdf.addImage(imgData, "JPEG", 0, 0, imgWidthMM, imgHeightMM);

  const weekRange = insight.weekStart.replace(/\//g, "-");
  pdf.save(`weekly-insight-${weekRange}.pdf`);
}
