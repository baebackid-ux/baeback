import { jsxDEV } from "react/jsx-dev-runtime";
import React, { createContext, useContext, useState, useEffect, useMemo, useRef, lazy, Suspense } from "react";
import { renderToString } from "react-dom/server";
import { HelmetProvider } from "react-helmet-async";
import { StaticRouter } from "react-router-dom/server.mjs";
import { useLocation, Navigate, Link, NavLink, Routes, Route } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import { HeartHandshake, Mail, Instagram, ArrowUpRight, X, Menu, ChevronDown, UserRound, LogOut } from "lucide-react";
import { L as Lenis } from "./assets/vendor-core-sYyebZCC.js";
function SkeletonBlock({ className = "", style, as: Tag = "span" }) {
  return /* @__PURE__ */ jsxDEV(Tag, { className: `skeleton ${className}`.trim(), style, "aria-hidden": "true" }, void 0, false, {
    fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Skeleton.jsx",
    lineNumber: 2,
    columnNumber: 10
  }, this);
}
function skeletonStyle(index) {
  return { "--skeleton-index": index };
}
function ItemCardSkeleton({ index = 0, className = "" }) {
  return /* @__PURE__ */ jsxDEV(
    "article",
    {
      className: `item-card skeleton-card ${className}`.trim(),
      style: skeletonStyle(index),
      "aria-hidden": "true",
      children: [
        /* @__PURE__ */ jsxDEV("div", { className: "skeleton-image-wrap", children: /* @__PURE__ */ jsxDEV(SkeletonBlock, { className: "skeleton-image", as: "div" }, void 0, false, {
          fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Skeleton.jsx",
          lineNumber: 17,
          columnNumber: 9
        }, this) }, void 0, false, {
          fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Skeleton.jsx",
          lineNumber: 16,
          columnNumber: 7
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "item-card-body", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "skeleton-row skeleton-row--badges", children: [
            /* @__PURE__ */ jsxDEV(SkeletonBlock, { className: "skeleton-pill skeleton-pill--wide" }, void 0, false, {
              fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Skeleton.jsx",
              lineNumber: 21,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ jsxDEV(SkeletonBlock, { className: "skeleton-pill" }, void 0, false, {
              fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Skeleton.jsx",
              lineNumber: 22,
              columnNumber: 11
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Skeleton.jsx",
            lineNumber: 20,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV(SkeletonBlock, { className: "skeleton-title", as: "div" }, void 0, false, {
            fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Skeleton.jsx",
            lineNumber: 24,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV(SkeletonBlock, { className: "skeleton-line", as: "div" }, void 0, false, {
            fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Skeleton.jsx",
            lineNumber: 25,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV(SkeletonBlock, { className: "skeleton-line skeleton-line--medium", as: "div" }, void 0, false, {
            fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Skeleton.jsx",
            lineNumber: 26,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV(SkeletonBlock, { className: "skeleton-line skeleton-line--short", as: "div" }, void 0, false, {
            fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Skeleton.jsx",
            lineNumber: 27,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "skeleton-row skeleton-row--meta", children: [
            /* @__PURE__ */ jsxDEV(SkeletonBlock, { className: "skeleton-chip" }, void 0, false, {
              fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Skeleton.jsx",
              lineNumber: 29,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ jsxDEV(SkeletonBlock, { className: "skeleton-chip" }, void 0, false, {
              fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Skeleton.jsx",
              lineNumber: 30,
              columnNumber: 11
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Skeleton.jsx",
            lineNumber: 28,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV(SkeletonBlock, { className: "skeleton-link", as: "div" }, void 0, false, {
            fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Skeleton.jsx",
            lineNumber: 32,
            columnNumber: 9
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Skeleton.jsx",
          lineNumber: 19,
          columnNumber: 7
        }, this)
      ]
    },
    void 0,
    true,
    {
      fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Skeleton.jsx",
      lineNumber: 11,
      columnNumber: 5
    },
    this
  );
}
function CampaignCardSkeleton({ index = 0 }) {
  return /* @__PURE__ */ jsxDEV("article", { className: "item-card campaign-card skeleton-card", style: skeletonStyle(index), "aria-hidden": "true", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "skeleton-image-wrap", children: /* @__PURE__ */ jsxDEV(SkeletonBlock, { className: "skeleton-image", as: "div" }, void 0, false, {
      fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Skeleton.jsx",
      lineNumber: 42,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Skeleton.jsx",
      lineNumber: 41,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "item-card-body", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "skeleton-row skeleton-row--badges", children: [
        /* @__PURE__ */ jsxDEV(SkeletonBlock, { className: "skeleton-pill skeleton-pill--wide" }, void 0, false, {
          fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Skeleton.jsx",
          lineNumber: 46,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(SkeletonBlock, { className: "skeleton-pill" }, void 0, false, {
          fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Skeleton.jsx",
          lineNumber: 47,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Skeleton.jsx",
        lineNumber: 45,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(SkeletonBlock, { className: "skeleton-title", as: "div" }, void 0, false, {
        fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Skeleton.jsx",
        lineNumber: 49,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(SkeletonBlock, { className: "skeleton-line", as: "div" }, void 0, false, {
        fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Skeleton.jsx",
        lineNumber: 50,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(SkeletonBlock, { className: "skeleton-line skeleton-line--medium", as: "div" }, void 0, false, {
        fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Skeleton.jsx",
        lineNumber: 51,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "skeleton-progress", children: [
        /* @__PURE__ */ jsxDEV(SkeletonBlock, { className: "skeleton-progress-bar", as: "div" }, void 0, false, {
          fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Skeleton.jsx",
          lineNumber: 53,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "skeleton-row skeleton-row--progress", children: [
          /* @__PURE__ */ jsxDEV(SkeletonBlock, { className: "skeleton-line skeleton-line--tiny", as: "div" }, void 0, false, {
            fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Skeleton.jsx",
            lineNumber: 55,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(SkeletonBlock, { className: "skeleton-line skeleton-line--tiny", as: "div" }, void 0, false, {
            fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Skeleton.jsx",
            lineNumber: 56,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Skeleton.jsx",
          lineNumber: 54,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Skeleton.jsx",
        lineNumber: 52,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(SkeletonBlock, { className: "skeleton-link", as: "div" }, void 0, false, {
        fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Skeleton.jsx",
        lineNumber: 59,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Skeleton.jsx",
      lineNumber: 44,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Skeleton.jsx",
    lineNumber: 40,
    columnNumber: 5
  }, this);
}
function RequestRowSkeleton({ index = 0 }) {
  return /* @__PURE__ */ jsxDEV("article", { className: "request-row skeleton-card skeleton-row-card", style: skeletonStyle(index), "aria-hidden": "true", children: [
    /* @__PURE__ */ jsxDEV(SkeletonBlock, { className: "skeleton-avatar", as: "div" }, void 0, false, {
      fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Skeleton.jsx",
      lineNumber: 88,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "skeleton-row-content", children: [
      /* @__PURE__ */ jsxDEV(SkeletonBlock, { className: "skeleton-line skeleton-line--tiny", as: "div" }, void 0, false, {
        fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Skeleton.jsx",
        lineNumber: 90,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(SkeletonBlock, { className: "skeleton-line skeleton-line--short", as: "div" }, void 0, false, {
        fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Skeleton.jsx",
        lineNumber: 91,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(SkeletonBlock, { className: "skeleton-line skeleton-line--medium", as: "div" }, void 0, false, {
        fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Skeleton.jsx",
        lineNumber: 92,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Skeleton.jsx",
      lineNumber: 89,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(SkeletonBlock, { className: "skeleton-pill" }, void 0, false, {
      fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Skeleton.jsx",
      lineNumber: 94,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(SkeletonBlock, { className: "skeleton-icon skeleton-icon--sm", as: "div" }, void 0, false, {
      fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Skeleton.jsx",
      lineNumber: 95,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Skeleton.jsx",
    lineNumber: 87,
    columnNumber: 5
  }, this);
}
function StatCardSkeleton({ index = 0 }) {
  return /* @__PURE__ */ jsxDEV("div", { className: "stat-card skeleton-card", style: skeletonStyle(index), "aria-hidden": "true", children: [
    /* @__PURE__ */ jsxDEV(SkeletonBlock, { className: "skeleton-icon skeleton-icon--stat", as: "div" }, void 0, false, {
      fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Skeleton.jsx",
      lineNumber: 103,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(SkeletonBlock, { className: "skeleton-stat-value", as: "div" }, void 0, false, {
      fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Skeleton.jsx",
      lineNumber: 104,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(SkeletonBlock, { className: "skeleton-line skeleton-line--tiny", as: "div" }, void 0, false, {
      fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Skeleton.jsx",
      lineNumber: 105,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Skeleton.jsx",
    lineNumber: 102,
    columnNumber: 5
  }, this);
}
function DonationItemSkeleton({ index = 0 }) {
  return /* @__PURE__ */ jsxDEV("article", { className: "donation-item skeleton-card", style: skeletonStyle(index), "aria-hidden": "true", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "skeleton-donation-copy", children: [
      /* @__PURE__ */ jsxDEV(SkeletonBlock, { className: "skeleton-line skeleton-line--title", as: "div" }, void 0, false, {
        fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Skeleton.jsx",
        lineNumber: 114,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(SkeletonBlock, { className: "skeleton-line skeleton-line--tiny", as: "div" }, void 0, false, {
        fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Skeleton.jsx",
        lineNumber: 115,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(SkeletonBlock, { className: "skeleton-line skeleton-line--medium", as: "div" }, void 0, false, {
        fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Skeleton.jsx",
        lineNumber: 116,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Skeleton.jsx",
      lineNumber: 113,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(SkeletonBlock, { className: "skeleton-amount", as: "div" }, void 0, false, {
      fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Skeleton.jsx",
      lineNumber: 118,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Skeleton.jsx",
    lineNumber: 112,
    columnNumber: 5
  }, this);
}
function CardGridSkeleton({ count = 4, variant = "item", className = "" }) {
  const SkeletonComponent = variant === "campaign" ? CampaignCardSkeleton : ItemCardSkeleton;
  return /* @__PURE__ */ jsxDEV(
    "div",
    {
      className: `card-grid skeleton-grid ${className}`.trim(),
      "aria-busy": "true",
      "aria-label": "Memuat konten",
      children: Array.from({ length: count }, (_, index) => /* @__PURE__ */ jsxDEV(SkeletonComponent, { index }, index, false, {
        fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Skeleton.jsx",
        lineNumber: 133,
        columnNumber: 9
      }, this))
    },
    void 0,
    false,
    {
      fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Skeleton.jsx",
      lineNumber: 127,
      columnNumber: 5
    },
    this
  );
}
function DonationListSkeleton({ count = 4 }) {
  return /* @__PURE__ */ jsxDEV("div", { className: "donation-list skeleton-grid", "aria-busy": "true", "aria-label": "Memuat riwayat donasi", children: Array.from({ length: count }, (_, index) => /* @__PURE__ */ jsxDEV(DonationItemSkeleton, { index }, index, false, {
    fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Skeleton.jsx",
    lineNumber: 143,
    columnNumber: 9
  }, this)) }, void 0, false, {
    fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Skeleton.jsx",
    lineNumber: 141,
    columnNumber: 5
  }, this);
}
function DashboardSkeleton() {
  return /* @__PURE__ */ jsxDEV("div", { className: "dashboard-skeleton", "aria-busy": "true", "aria-label": "Memuat dashboard", children: [
    /* @__PURE__ */ jsxDEV("section", { children: [
      /* @__PURE__ */ jsxDEV("div", { className: "skeleton-section-heading", children: [
        /* @__PURE__ */ jsxDEV(SkeletonBlock, { className: "skeleton-line skeleton-line--eyebrow", as: "div" }, void 0, false, {
          fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Skeleton.jsx",
          lineNumber: 154,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(SkeletonBlock, { className: "skeleton-line skeleton-line--heading", as: "div" }, void 0, false, {
          fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Skeleton.jsx",
          lineNumber: 155,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Skeleton.jsx",
        lineNumber: 153,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "card-grid skeleton-grid--3", children: Array.from({ length: 3 }, (_, index) => /* @__PURE__ */ jsxDEV(StatCardSkeleton, { index }, index, false, {
        fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Skeleton.jsx",
        lineNumber: 159,
        columnNumber: 13
      }, this)) }, void 0, false, {
        fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Skeleton.jsx",
        lineNumber: 157,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Skeleton.jsx",
      lineNumber: 152,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("section", { children: [
      /* @__PURE__ */ jsxDEV("div", { className: "skeleton-section-heading skeleton-section-heading--split", children: [
        /* @__PURE__ */ jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDEV(SkeletonBlock, { className: "skeleton-line skeleton-line--eyebrow", as: "div" }, void 0, false, {
            fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Skeleton.jsx",
            lineNumber: 167,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(SkeletonBlock, { className: "skeleton-line skeleton-line--heading", as: "div" }, void 0, false, {
            fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Skeleton.jsx",
            lineNumber: 168,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Skeleton.jsx",
          lineNumber: 166,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(SkeletonBlock, { className: "skeleton-link", as: "div" }, void 0, false, {
          fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Skeleton.jsx",
          lineNumber: 170,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Skeleton.jsx",
        lineNumber: 165,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "mini-card-grid skeleton-grid", children: Array.from({ length: 2 }, (_, index) => /* @__PURE__ */ jsxDEV(ItemCardSkeleton, { index }, index, false, {
        fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Skeleton.jsx",
        lineNumber: 174,
        columnNumber: 13
      }, this)) }, void 0, false, {
        fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Skeleton.jsx",
        lineNumber: 172,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Skeleton.jsx",
      lineNumber: 164,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("section", { children: [
      /* @__PURE__ */ jsxDEV("div", { className: "skeleton-section-heading skeleton-section-heading--split", children: [
        /* @__PURE__ */ jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDEV(SkeletonBlock, { className: "skeleton-line skeleton-line--eyebrow", as: "div" }, void 0, false, {
            fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Skeleton.jsx",
            lineNumber: 182,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(SkeletonBlock, { className: "skeleton-line skeleton-line--heading", as: "div" }, void 0, false, {
            fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Skeleton.jsx",
            lineNumber: 183,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Skeleton.jsx",
          lineNumber: 181,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(SkeletonBlock, { className: "skeleton-link", as: "div" }, void 0, false, {
          fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Skeleton.jsx",
          lineNumber: 185,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Skeleton.jsx",
        lineNumber: 180,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "request-list skeleton-grid", children: Array.from({ length: 2 }, (_, index) => /* @__PURE__ */ jsxDEV(RequestRowSkeleton, { index }, index, false, {
        fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Skeleton.jsx",
        lineNumber: 189,
        columnNumber: 13
      }, this)) }, void 0, false, {
        fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Skeleton.jsx",
        lineNumber: 187,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Skeleton.jsx",
      lineNumber: 179,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Skeleton.jsx",
    lineNumber: 151,
    columnNumber: 5
  }, this);
}
function SessionSkeleton() {
  return /* @__PURE__ */ jsxDEV("main", { className: "container page-shell session-skeleton", "aria-busy": "true", "aria-label": "Memuat sesi", children: /* @__PURE__ */ jsxDEV("div", { className: "session-skeleton-inner", children: [
    /* @__PURE__ */ jsxDEV(SkeletonBlock, { className: "skeleton-line skeleton-line--eyebrow", as: "div" }, void 0, false, {
      fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Skeleton.jsx",
      lineNumber: 201,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV(SkeletonBlock, { className: "skeleton-line skeleton-line--hero", as: "div" }, void 0, false, {
      fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Skeleton.jsx",
      lineNumber: 202,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV(SkeletonBlock, { className: "skeleton-line skeleton-line--medium", as: "div" }, void 0, false, {
      fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Skeleton.jsx",
      lineNumber: 203,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "card-grid skeleton-grid skeleton-grid--session", children: Array.from({ length: 4 }, (_, index) => /* @__PURE__ */ jsxDEV(ItemCardSkeleton, { index }, index, false, {
      fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Skeleton.jsx",
      lineNumber: 206,
      columnNumber: 13
    }, this)) }, void 0, false, {
      fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Skeleton.jsx",
      lineNumber: 204,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Skeleton.jsx",
    lineNumber: 200,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Skeleton.jsx",
    lineNumber: 199,
    columnNumber: 5
  }, this);
}
const supabaseUrl = "https://hueatexumtvarkrwqdtk.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1ZWF0ZXh1bXR2YXJrcndxZHRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM4NjMyNjgsImV4cCI6MjA5OTQzOTI2OH0.TMMwtCObxDlbszC94TUaHsTKGC0FYj9v4nLJryt8Ifk";
const isSupabaseConfigured = true;
const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);
const AuthContext = createContext(null);
function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let mounted = true;
    async function loadSession() {
      var _a;
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setSession(data.session);
      if ((_a = data.session) == null ? void 0 : _a.user) {
        await ensureProfile(data.session.user);
      }
      setLoading(false);
    }
    loadSession();
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      setSession(nextSession);
      if (nextSession == null ? void 0 : nextSession.user) {
        await ensureProfile(nextSession.user);
      } else {
        setProfile(null);
      }
    });
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);
  async function ensureProfile(user) {
    var _a, _b;
    if (!user) return null;
    const { data: existing } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    if (existing) {
      setProfile(existing);
      return existing;
    }
    const payload = {
      id: user.id,
      full_name: ((_a = user.user_metadata) == null ? void 0 : _a.full_name) || ((_b = user.email) == null ? void 0 : _b.split("@")[0]) || "Pengguna BaeBack",
      role: "user",
      badge: "new_donor",
      kindness_points: 0
    };
    const { data } = await supabase.from("profiles").insert(payload).select("*").single();
    setProfile(data || payload);
    return data || payload;
  }
  async function signIn(email, password) {
    return supabase.auth.signInWithPassword({ email, password });
  }
  async function signUp(email, password, fullName) {
    return supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } }
    });
  }
  async function signOut() {
    await supabase.auth.signOut();
  }
  function incrementKindnessPointsLocal() {
  }
  const value = useMemo(
    () => ({
      session,
      user: (session == null ? void 0 : session.user) || null,
      profile,
      loading,
      isAuthenticated: Boolean(session == null ? void 0 : session.user),
      isAdmin: (profile == null ? void 0 : profile.role) === "admin",
      incrementKindnessPointsLocal,
      signIn,
      signUp,
      signOut
    }),
    [session, profile, loading]
  );
  return /* @__PURE__ */ jsxDEV(AuthContext.Provider, { value, children }, void 0, false, {
    fileName: "C:/Users/HP/Fauzi/codex/baeback/src/contexts/AuthContext.jsx",
    lineNumber: 101,
    columnNumber: 10
  }, this);
}
function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth harus digunakan di dalam AuthProvider.");
  }
  return context;
}
function AdminRoute({ children }) {
  const location = useLocation();
  const { isAuthenticated, isAdmin, loading } = useAuth();
  if (loading) return /* @__PURE__ */ jsxDEV(SessionSkeleton, {}, void 0, false, {
    fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/AdminRoute.jsx",
    lineNumber: 9,
    columnNumber: 23
  }, this);
  if (!isAuthenticated) return /* @__PURE__ */ jsxDEV(Navigate, { to: "/login", replace: true, state: { from: location } }, void 0, false, {
    fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/AdminRoute.jsx",
    lineNumber: 10,
    columnNumber: 32
  }, this);
  if (!isAdmin) return /* @__PURE__ */ jsxDEV(Navigate, { to: "/unauthorized", replace: true }, void 0, false, {
    fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/AdminRoute.jsx",
    lineNumber: 11,
    columnNumber: 24
  }, this);
  return children;
}
function Footer() {
  return /* @__PURE__ */ jsxDEV("footer", { className: "footer", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "container footer-grid", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "footer-intro", children: [
        /* @__PURE__ */ jsxDEV(Link, { to: "/", className: "brand footer-brand", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "brand-mark", children: /* @__PURE__ */ jsxDEV(HeartHandshake, { size: 21, "aria-hidden": "true" }, void 0, false, {
            fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Footer.jsx",
            lineNumber: 10,
            columnNumber: 42
          }, this) }, void 0, false, {
            fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Footer.jsx",
            lineNumber: 10,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "brand-copy", children: [
            /* @__PURE__ */ jsxDEV("strong", { children: "BaeBack" }, void 0, false, {
              fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Footer.jsx",
              lineNumber: 11,
              columnNumber: 42
            }, this),
            /* @__PURE__ */ jsxDEV("small", { children: "goods with a second story" }, void 0, false, {
              fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Footer.jsx",
              lineNumber: 11,
              columnNumber: 66
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Footer.jsx",
            lineNumber: 11,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Footer.jsx",
          lineNumber: 9,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("p", { children: "Tempat barang baik menemukan cerita keduanya—langsung kepada orang yang membutuhkannya." }, void 0, false, {
          fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Footer.jsx",
          lineNumber: 13,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "footer-socials", children: [
          /* @__PURE__ */ jsxDEV("a", { href: "mailto:halo@baeback.id", "aria-label": "Email BaeBack", children: /* @__PURE__ */ jsxDEV(Mail, { size: 18 }, void 0, false, {
            fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Footer.jsx",
            lineNumber: 15,
            columnNumber: 73
          }, this) }, void 0, false, {
            fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Footer.jsx",
            lineNumber: 15,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("a", { href: "https://instagram.com", "aria-label": "Instagram BaeBack", children: /* @__PURE__ */ jsxDEV(Instagram, { size: 18 }, void 0, false, {
            fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Footer.jsx",
            lineNumber: 16,
            columnNumber: 76
          }, this) }, void 0, false, {
            fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Footer.jsx",
            lineNumber: 16,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Footer.jsx",
          lineNumber: 14,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Footer.jsx",
        lineNumber: 8,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDEV("h4", { children: "Jelajahi" }, void 0, false, {
          fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Footer.jsx",
          lineNumber: 20,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(Link, { to: "/barang", children: "Cari Barang" }, void 0, false, {
          fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Footer.jsx",
          lineNumber: 21,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(Link, { to: "/need-board", children: "Need Board" }, void 0, false, {
          fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Footer.jsx",
          lineNumber: 22,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(Link, { to: "/donasikan", children: "Bagikan Barang" }, void 0, false, {
          fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Footer.jsx",
          lineNumber: 23,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Footer.jsx",
        lineNumber: 19,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDEV("h4", { children: "Akun" }, void 0, false, {
          fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Footer.jsx",
          lineNumber: 26,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(Link, { to: "/dashboard", children: "Aktivitas Saya" }, void 0, false, {
          fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Footer.jsx",
          lineNumber: 27,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(Link, { to: "/daftar-minat", children: "Daftar Minat" }, void 0, false, {
          fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Footer.jsx",
          lineNumber: 28,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(Link, { to: "/profil", children: "Profil" }, void 0, false, {
          fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Footer.jsx",
          lineNumber: 29,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Footer.jsx",
        lineNumber: 25,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "footer-share", children: [
        /* @__PURE__ */ jsxDEV("h4", { children: "Mulai berbagi" }, void 0, false, {
          fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Footer.jsx",
          lineNumber: 32,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("p", { children: "Barang yang tak lagi kamu gunakan bisa berarti besar bagi orang lain." }, void 0, false, {
          fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Footer.jsx",
          lineNumber: 33,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(Link, { className: "footer-cta", to: "/donasikan", children: [
          "Bagikan barang ",
          /* @__PURE__ */ jsxDEV(ArrowUpRight, { size: 17 }, void 0, false, {
            fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Footer.jsx",
            lineNumber: 34,
            columnNumber: 71
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Footer.jsx",
          lineNumber: 34,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Footer.jsx",
        lineNumber: 31,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Footer.jsx",
      lineNumber: 7,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "container footer-bottom", children: [
      /* @__PURE__ */ jsxDEV("span", { children: "© 2026 BaeBack" }, void 0, false, {
        fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Footer.jsx",
        lineNumber: 38,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("span", { children: "Dibuat untuk sirkulasi kebaikan, bukan transaksi." }, void 0, false, {
        fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Footer.jsx",
        lineNumber: 39,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Footer.jsx",
      lineNumber: 37,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Footer.jsx",
    lineNumber: 6,
    columnNumber: 5
  }, this);
}
const LenisContext = createContext(null);
const anchorEasing = (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t));
function LenisProvider({ children }) {
  const { hash, pathname } = useLocation();
  const lenisRef = useRef(null);
  const [lenis, setLenis] = useState(null);
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMotion.matches) {
      return void 0;
    }
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const instance = new Lenis({
      autoRaf: true,
      anchors: {
        duration: 1.1,
        easing: anchorEasing
      },
      lerp: isTouch ? 0.08 : 0.1,
      smoothWheel: true,
      stopInertiaOnNavigate: true,
      syncTouch: isTouch,
      touchMultiplier: 1.2,
      wheelMultiplier: 1
    });
    lenisRef.current = instance;
    setLenis(instance);
    return () => {
      instance.destroy();
      lenisRef.current = null;
      setLenis(null);
    };
  }, []);
  useEffect(() => {
    const scrollTarget = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null;
    if (scrollTarget && lenisRef.current) {
      lenisRef.current.scrollTo(scrollTarget, { offset: -88 });
      return;
    }
    if (scrollTarget) {
      scrollTarget.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { duration: 0.85, easing: anchorEasing });
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [hash, pathname]);
  const value = useMemo(() => ({ lenis }), [lenis]);
  return /* @__PURE__ */ jsxDEV(LenisContext.Provider, { value, children }, void 0, false, {
    fileName: "C:/Users/HP/Fauzi/codex/baeback/src/contexts/LenisContext.jsx",
    lineNumber: 71,
    columnNumber: 10
  }, this);
}
function useLenis() {
  const context = useContext(LenisContext);
  if (!context) {
    throw new Error("useLenis must be used within LenisProvider");
  }
  return context;
}
const navItems = [
  { to: "/", label: "Beranda" },
  { to: "/barang", label: "Jelajahi Barang" },
  { to: "/campaign", label: "Campaign" },
  { to: "/need-board", label: "Need Board" }
];
function Navbar() {
  var _a;
  const [open, setOpen] = useState(false);
  const headerRef = useRef(null);
  const scrolledRef = useRef(false);
  const { isAuthenticated, profile, signOut } = useAuth();
  const { lenis } = useLenis();
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return void 0;
    function updateScrolled(scrollY) {
      const scrolled = scrollY > 8;
      if (scrolledRef.current === scrolled) return;
      scrolledRef.current = scrolled;
      header.classList.toggle("is-scrolled", scrolled);
    }
    if (lenis) {
      const onScroll = (instance) => updateScrolled(instance.scroll);
      updateScrolled(lenis.scroll);
      lenis.on("scroll", onScroll);
      return () => lenis.off("scroll", onScroll);
    }
    function onNativeScroll() {
      updateScrolled(window.scrollY);
    }
    onNativeScroll();
    window.addEventListener("scroll", onNativeScroll, { passive: true });
    return () => window.removeEventListener("scroll", onNativeScroll);
  }, [lenis]);
  return /* @__PURE__ */ jsxDEV("header", { ref: headerRef, className: "site-header", children: /* @__PURE__ */ jsxDEV("nav", { className: "navbar container", children: [
    /* @__PURE__ */ jsxDEV(Link, { to: "/", className: "brand", onClick: () => setOpen(false), "aria-label": "BaeBack, kembali ke beranda", children: [
      /* @__PURE__ */ jsxDEV("span", { className: "brand-mark", children: /* @__PURE__ */ jsxDEV(HeartHandshake, { size: 22, "aria-hidden": "true" }, void 0, false, {
        fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Navbar.jsx",
        lineNumber: 53,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Navbar.jsx",
        lineNumber: 52,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("span", { className: "brand-copy", children: [
        /* @__PURE__ */ jsxDEV("strong", { children: "BaeBack" }, void 0, false, {
          fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Navbar.jsx",
          lineNumber: 55,
          columnNumber: 40
        }, this),
        /* @__PURE__ */ jsxDEV("small", { children: "goods with a second story" }, void 0, false, {
          fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Navbar.jsx",
          lineNumber: 55,
          columnNumber: 64
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Navbar.jsx",
        lineNumber: 55,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Navbar.jsx",
      lineNumber: 51,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV("button", { className: "icon-button menu-button", onClick: () => setOpen((value) => !value), "aria-label": "Buka menu", children: open ? /* @__PURE__ */ jsxDEV(X, { size: 22 }, void 0, false, {
      fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Navbar.jsx",
      lineNumber: 59,
      columnNumber: 19
    }, this) : /* @__PURE__ */ jsxDEV(Menu, { size: 22 }, void 0, false, {
      fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Navbar.jsx",
      lineNumber: 59,
      columnNumber: 37
    }, this) }, void 0, false, {
      fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Navbar.jsx",
      lineNumber: 58,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: `nav-links ${open ? "is-open" : ""}`, children: [
      navItems.map((item) => /* @__PURE__ */ jsxDEV(NavLink, { to: item.to, onClick: () => setOpen(false), children: item.label }, item.to, false, {
        fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Navbar.jsx",
        lineNumber: 64,
        columnNumber: 13
      }, this)),
      /* @__PURE__ */ jsxDEV(Link, { className: "btn btn-primary", to: isAuthenticated ? "/donasikan" : "/login", onClick: () => setOpen(false), children: isAuthenticated ? "Bagikan barang" : "Masuk untuk berbagi" }, void 0, false, {
        fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Navbar.jsx",
        lineNumber: 68,
        columnNumber: 11
      }, this),
      isAuthenticated ? /* @__PURE__ */ jsxDEV("div", { className: "account-menu", children: [
        /* @__PURE__ */ jsxDEV(Link, { className: "account-link", to: "/dashboard", onClick: () => setOpen(false), children: [
          /* @__PURE__ */ jsxDEV("span", { className: "nav-avatar", children: ((_a = profile == null ? void 0 : profile.full_name) == null ? void 0 : _a[0]) || "B" }, void 0, false, {
            fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Navbar.jsx",
            lineNumber: 74,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("span", { children: [
            /* @__PURE__ */ jsxDEV("small", { children: "Akun saya" }, void 0, false, {
              fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Navbar.jsx",
              lineNumber: 75,
              columnNumber: 23
            }, this),
            (profile == null ? void 0 : profile.full_name) || "Profil"
          ] }, void 0, true, {
            fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Navbar.jsx",
            lineNumber: 75,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV(ChevronDown, { size: 15 }, void 0, false, {
            fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Navbar.jsx",
            lineNumber: 76,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Navbar.jsx",
          lineNumber: 73,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "account-popover", children: [
          /* @__PURE__ */ jsxDEV(Link, { to: "/dashboard", onClick: () => setOpen(false), children: [
            /* @__PURE__ */ jsxDEV(UserRound, { size: 16 }, void 0, false, {
              fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Navbar.jsx",
              lineNumber: 79,
              columnNumber: 70
            }, this),
            " Dashboard"
          ] }, void 0, true, {
            fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Navbar.jsx",
            lineNumber: 79,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV(Link, { to: "/donasi-saya", onClick: () => setOpen(false), children: "Donasi saya" }, void 0, false, {
            fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Navbar.jsx",
            lineNumber: 80,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV(Link, { to: "/profil", onClick: () => setOpen(false), children: "Profil kontribusi" }, void 0, false, {
            fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Navbar.jsx",
            lineNumber: 81,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV(Link, { to: "/daftar-minat", onClick: () => setOpen(false), children: "Daftar minat" }, void 0, false, {
            fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Navbar.jsx",
            lineNumber: 82,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("button", { onClick: signOut, children: [
            /* @__PURE__ */ jsxDEV(LogOut, { size: 16 }, void 0, false, {
              fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Navbar.jsx",
              lineNumber: 83,
              columnNumber: 43
            }, this),
            " Keluar"
          ] }, void 0, true, {
            fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Navbar.jsx",
            lineNumber: 83,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Navbar.jsx",
          lineNumber: 78,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Navbar.jsx",
        lineNumber: 72,
        columnNumber: 13
      }, this) : /* @__PURE__ */ jsxDEV(Link, { className: "btn btn-secondary", to: "/login", onClick: () => setOpen(false), children: "Masuk" }, void 0, false, {
        fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Navbar.jsx",
        lineNumber: 87,
        columnNumber: 13
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Navbar.jsx",
      lineNumber: 62,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Navbar.jsx",
    lineNumber: 50,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/Navbar.jsx",
    lineNumber: 49,
    columnNumber: 5
  }, this);
}
function ProtectedRoute({ children }) {
  const location = useLocation();
  const { isAuthenticated, loading } = useAuth();
  if (loading) return /* @__PURE__ */ jsxDEV(SessionSkeleton, {}, void 0, false, {
    fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/ProtectedRoute.jsx",
    lineNumber: 9,
    columnNumber: 23
  }, this);
  if (!isAuthenticated) return /* @__PURE__ */ jsxDEV(Navigate, { to: "/login", replace: true, state: { from: location } }, void 0, false, {
    fileName: "C:/Users/HP/Fauzi/codex/baeback/src/components/ProtectedRoute.jsx",
    lineNumber: 10,
    columnNumber: 32
  }, this);
  return children;
}
const HomePage = lazy(() => import("./assets/HomePage-Fo6Tg6Ww.js"));
const ItemsPage = lazy(() => import("./assets/ItemsPage-PMZNA80b.js"));
const ItemDetailPage = lazy(() => import("./assets/ItemDetailPage-CQF9vudv.js"));
const CampaignsPage = lazy(() => import("./assets/CampaignsPage-C587PbNI.js"));
const CampaignDetailPage = lazy(() => import("./assets/CampaignDetailPage-Df6mr0eN.js"));
const NeedBoardPage = lazy(() => import("./assets/NeedBoardPage-CDFrPItP.js"));
const NeedDetailPage = lazy(() => import("./assets/NeedDetailPage-CAUhbcTp.js"));
const AuthPage = lazy(() => import("./assets/AuthPage-zJp0lNVA.js"));
const DonateItemPage = lazy(() => import("./assets/DonateItemPage-CqXf2FBI.js"));
const DashboardPage = lazy(() => import("./assets/DashboardPage-N273vkYf.js"));
const FavoritesPage = lazy(() => import("./assets/FavoritesPage-Rr-xLZJA.js"));
const RequestsPage = lazy(() => import("./assets/RequestsPage-B-xl56bG.js"));
const MyDonationsPage = lazy(() => import("./assets/MyDonationsPage-CsfDwQn_.js"));
const ProfilePage = lazy(() => import("./assets/ProfilePage-noJ9qFO9.js"));
const AdminPage = lazy(() => import("./assets/AdminPage-C1DohxM_.js"));
const NotFoundPage = lazy(() => import("./assets/NotFoundPage-BKzioRLU.js"));
const AccessDeniedPage = lazy(() => import("./assets/AccessDeniedPage-DdZyI3f6.js"));
function PageFallback() {
  return /* @__PURE__ */ jsxDEV("div", { className: "page-shell", "aria-busy": "true" }, void 0, false, {
    fileName: "C:/Users/HP/Fauzi/codex/baeback/src/App.jsx",
    lineNumber: 28,
    columnNumber: 10
  }, this);
}
function App() {
  const location = useLocation();
  return /* @__PURE__ */ jsxDEV(LenisProvider, { children: /* @__PURE__ */ jsxDEV("div", { className: "app-shell", children: [
    /* @__PURE__ */ jsxDEV("a", { className: "skip-link", href: "#main-content", children: "Lewati ke konten utama" }, void 0, false, {
      fileName: "C:/Users/HP/Fauzi/codex/baeback/src/App.jsx",
      lineNumber: 37,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(Navbar, {}, void 0, false, {
      fileName: "C:/Users/HP/Fauzi/codex/baeback/src/App.jsx",
      lineNumber: 38,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { id: "main-content", children: /* @__PURE__ */ jsxDEV("div", { className: "page-transition", children: /* @__PURE__ */ jsxDEV(Suspense, { fallback: /* @__PURE__ */ jsxDEV(PageFallback, {}, void 0, false, {
      fileName: "C:/Users/HP/Fauzi/codex/baeback/src/App.jsx",
      lineNumber: 41,
      columnNumber: 31
    }, this), children: /* @__PURE__ */ jsxDEV(Routes, { location, children: [
      /* @__PURE__ */ jsxDEV(Route, { path: "/", element: /* @__PURE__ */ jsxDEV(HomePage, {}, void 0, false, {
        fileName: "C:/Users/HP/Fauzi/codex/baeback/src/App.jsx",
        lineNumber: 43,
        columnNumber: 40
      }, this) }, void 0, false, {
        fileName: "C:/Users/HP/Fauzi/codex/baeback/src/App.jsx",
        lineNumber: 43,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ jsxDEV(Route, { path: "/barang", element: /* @__PURE__ */ jsxDEV(ItemsPage, {}, void 0, false, {
        fileName: "C:/Users/HP/Fauzi/codex/baeback/src/App.jsx",
        lineNumber: 44,
        columnNumber: 46
      }, this) }, void 0, false, {
        fileName: "C:/Users/HP/Fauzi/codex/baeback/src/App.jsx",
        lineNumber: 44,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ jsxDEV(Route, { path: "/barang/:id", element: /* @__PURE__ */ jsxDEV(ItemDetailPage, {}, void 0, false, {
        fileName: "C:/Users/HP/Fauzi/codex/baeback/src/App.jsx",
        lineNumber: 45,
        columnNumber: 50
      }, this) }, void 0, false, {
        fileName: "C:/Users/HP/Fauzi/codex/baeback/src/App.jsx",
        lineNumber: 45,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ jsxDEV(Route, { path: "/campaign", element: /* @__PURE__ */ jsxDEV(CampaignsPage, {}, void 0, false, {
        fileName: "C:/Users/HP/Fauzi/codex/baeback/src/App.jsx",
        lineNumber: 46,
        columnNumber: 48
      }, this) }, void 0, false, {
        fileName: "C:/Users/HP/Fauzi/codex/baeback/src/App.jsx",
        lineNumber: 46,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ jsxDEV(Route, { path: "/campaign/:slug", element: /* @__PURE__ */ jsxDEV(CampaignDetailPage, {}, void 0, false, {
        fileName: "C:/Users/HP/Fauzi/codex/baeback/src/App.jsx",
        lineNumber: 47,
        columnNumber: 54
      }, this) }, void 0, false, {
        fileName: "C:/Users/HP/Fauzi/codex/baeback/src/App.jsx",
        lineNumber: 47,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ jsxDEV(Route, { path: "/need-board", element: /* @__PURE__ */ jsxDEV(NeedBoardPage, {}, void 0, false, {
        fileName: "C:/Users/HP/Fauzi/codex/baeback/src/App.jsx",
        lineNumber: 48,
        columnNumber: 50
      }, this) }, void 0, false, {
        fileName: "C:/Users/HP/Fauzi/codex/baeback/src/App.jsx",
        lineNumber: 48,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ jsxDEV(Route, { path: "/need-board/:id", element: /* @__PURE__ */ jsxDEV(NeedDetailPage, {}, void 0, false, {
        fileName: "C:/Users/HP/Fauzi/codex/baeback/src/App.jsx",
        lineNumber: 49,
        columnNumber: 54
      }, this) }, void 0, false, {
        fileName: "C:/Users/HP/Fauzi/codex/baeback/src/App.jsx",
        lineNumber: 49,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ jsxDEV(Route, { path: "/login", element: /* @__PURE__ */ jsxDEV(AuthPage, { mode: "login" }, void 0, false, {
        fileName: "C:/Users/HP/Fauzi/codex/baeback/src/App.jsx",
        lineNumber: 50,
        columnNumber: 45
      }, this) }, void 0, false, {
        fileName: "C:/Users/HP/Fauzi/codex/baeback/src/App.jsx",
        lineNumber: 50,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ jsxDEV(Route, { path: "/register", element: /* @__PURE__ */ jsxDEV(AuthPage, { mode: "register" }, void 0, false, {
        fileName: "C:/Users/HP/Fauzi/codex/baeback/src/App.jsx",
        lineNumber: 51,
        columnNumber: 48
      }, this) }, void 0, false, {
        fileName: "C:/Users/HP/Fauzi/codex/baeback/src/App.jsx",
        lineNumber: 51,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ jsxDEV(Route, { path: "/unauthorized", element: /* @__PURE__ */ jsxDEV(AccessDeniedPage, {}, void 0, false, {
        fileName: "C:/Users/HP/Fauzi/codex/baeback/src/App.jsx",
        lineNumber: 52,
        columnNumber: 52
      }, this) }, void 0, false, {
        fileName: "C:/Users/HP/Fauzi/codex/baeback/src/App.jsx",
        lineNumber: 52,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ jsxDEV(
        Route,
        {
          path: "/donasikan",
          element: /* @__PURE__ */ jsxDEV(ProtectedRoute, { children: /* @__PURE__ */ jsxDEV(DonateItemPage, {}, void 0, false, {
            fileName: "C:/Users/HP/Fauzi/codex/baeback/src/App.jsx",
            lineNumber: 57,
            columnNumber: 21
          }, this) }, void 0, false, {
            fileName: "C:/Users/HP/Fauzi/codex/baeback/src/App.jsx",
            lineNumber: 56,
            columnNumber: 19
          }, this)
        },
        void 0,
        false,
        {
          fileName: "C:/Users/HP/Fauzi/codex/baeback/src/App.jsx",
          lineNumber: 53,
          columnNumber: 15
        },
        this
      ),
      /* @__PURE__ */ jsxDEV(
        Route,
        {
          path: "/dashboard",
          element: /* @__PURE__ */ jsxDEV(ProtectedRoute, { children: /* @__PURE__ */ jsxDEV(DashboardPage, {}, void 0, false, {
            fileName: "C:/Users/HP/Fauzi/codex/baeback/src/App.jsx",
            lineNumber: 65,
            columnNumber: 21
          }, this) }, void 0, false, {
            fileName: "C:/Users/HP/Fauzi/codex/baeback/src/App.jsx",
            lineNumber: 64,
            columnNumber: 19
          }, this)
        },
        void 0,
        false,
        {
          fileName: "C:/Users/HP/Fauzi/codex/baeback/src/App.jsx",
          lineNumber: 61,
          columnNumber: 15
        },
        this
      ),
      /* @__PURE__ */ jsxDEV(
        Route,
        {
          path: "/daftar-minat",
          element: /* @__PURE__ */ jsxDEV(ProtectedRoute, { children: /* @__PURE__ */ jsxDEV(FavoritesPage, {}, void 0, false, {
            fileName: "C:/Users/HP/Fauzi/codex/baeback/src/App.jsx",
            lineNumber: 73,
            columnNumber: 21
          }, this) }, void 0, false, {
            fileName: "C:/Users/HP/Fauzi/codex/baeback/src/App.jsx",
            lineNumber: 72,
            columnNumber: 19
          }, this)
        },
        void 0,
        false,
        {
          fileName: "C:/Users/HP/Fauzi/codex/baeback/src/App.jsx",
          lineNumber: 69,
          columnNumber: 15
        },
        this
      ),
      /* @__PURE__ */ jsxDEV(
        Route,
        {
          path: "/pengajuan",
          element: /* @__PURE__ */ jsxDEV(ProtectedRoute, { children: /* @__PURE__ */ jsxDEV(RequestsPage, {}, void 0, false, {
            fileName: "C:/Users/HP/Fauzi/codex/baeback/src/App.jsx",
            lineNumber: 81,
            columnNumber: 21
          }, this) }, void 0, false, {
            fileName: "C:/Users/HP/Fauzi/codex/baeback/src/App.jsx",
            lineNumber: 80,
            columnNumber: 19
          }, this)
        },
        void 0,
        false,
        {
          fileName: "C:/Users/HP/Fauzi/codex/baeback/src/App.jsx",
          lineNumber: 77,
          columnNumber: 15
        },
        this
      ),
      /* @__PURE__ */ jsxDEV(
        Route,
        {
          path: "/donasi-saya",
          element: /* @__PURE__ */ jsxDEV(ProtectedRoute, { children: /* @__PURE__ */ jsxDEV(MyDonationsPage, {}, void 0, false, {
            fileName: "C:/Users/HP/Fauzi/codex/baeback/src/App.jsx",
            lineNumber: 89,
            columnNumber: 21
          }, this) }, void 0, false, {
            fileName: "C:/Users/HP/Fauzi/codex/baeback/src/App.jsx",
            lineNumber: 88,
            columnNumber: 19
          }, this)
        },
        void 0,
        false,
        {
          fileName: "C:/Users/HP/Fauzi/codex/baeback/src/App.jsx",
          lineNumber: 85,
          columnNumber: 15
        },
        this
      ),
      /* @__PURE__ */ jsxDEV(
        Route,
        {
          path: "/profil",
          element: /* @__PURE__ */ jsxDEV(ProtectedRoute, { children: /* @__PURE__ */ jsxDEV(ProfilePage, {}, void 0, false, {
            fileName: "C:/Users/HP/Fauzi/codex/baeback/src/App.jsx",
            lineNumber: 97,
            columnNumber: 21
          }, this) }, void 0, false, {
            fileName: "C:/Users/HP/Fauzi/codex/baeback/src/App.jsx",
            lineNumber: 96,
            columnNumber: 19
          }, this)
        },
        void 0,
        false,
        {
          fileName: "C:/Users/HP/Fauzi/codex/baeback/src/App.jsx",
          lineNumber: 93,
          columnNumber: 15
        },
        this
      ),
      /* @__PURE__ */ jsxDEV(
        Route,
        {
          path: "/admin",
          element: /* @__PURE__ */ jsxDEV(AdminRoute, { children: /* @__PURE__ */ jsxDEV(AdminPage, {}, void 0, false, {
            fileName: "C:/Users/HP/Fauzi/codex/baeback/src/App.jsx",
            lineNumber: 105,
            columnNumber: 21
          }, this) }, void 0, false, {
            fileName: "C:/Users/HP/Fauzi/codex/baeback/src/App.jsx",
            lineNumber: 104,
            columnNumber: 19
          }, this)
        },
        void 0,
        false,
        {
          fileName: "C:/Users/HP/Fauzi/codex/baeback/src/App.jsx",
          lineNumber: 101,
          columnNumber: 15
        },
        this
      ),
      /* @__PURE__ */ jsxDEV(Route, { path: "*", element: /* @__PURE__ */ jsxDEV(NotFoundPage, {}, void 0, false, {
        fileName: "C:/Users/HP/Fauzi/codex/baeback/src/App.jsx",
        lineNumber: 109,
        columnNumber: 40
      }, this) }, void 0, false, {
        fileName: "C:/Users/HP/Fauzi/codex/baeback/src/App.jsx",
        lineNumber: 109,
        columnNumber: 15
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/HP/Fauzi/codex/baeback/src/App.jsx",
      lineNumber: 42,
      columnNumber: 13
    }, this) }, void 0, false, {
      fileName: "C:/Users/HP/Fauzi/codex/baeback/src/App.jsx",
      lineNumber: 41,
      columnNumber: 11
    }, this) }, location.pathname, false, {
      fileName: "C:/Users/HP/Fauzi/codex/baeback/src/App.jsx",
      lineNumber: 40,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "C:/Users/HP/Fauzi/codex/baeback/src/App.jsx",
      lineNumber: 39,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(Footer, {}, void 0, false, {
      fileName: "C:/Users/HP/Fauzi/codex/baeback/src/App.jsx",
      lineNumber: 114,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/HP/Fauzi/codex/baeback/src/App.jsx",
    lineNumber: 36,
    columnNumber: 5
  }, this) }, void 0, false, {
    fileName: "C:/Users/HP/Fauzi/codex/baeback/src/App.jsx",
    lineNumber: 35,
    columnNumber: 5
  }, this);
}
function render(url) {
  var _a, _b, _c, _d;
  const helmetContext = {};
  const html = renderToString(
    /* @__PURE__ */ jsxDEV(React.StrictMode, { children: /* @__PURE__ */ jsxDEV(HelmetProvider, { context: helmetContext, children: /* @__PURE__ */ jsxDEV(StaticRouter, { location: url, children: /* @__PURE__ */ jsxDEV(AuthProvider, { children: /* @__PURE__ */ jsxDEV(App, {}, void 0, false, {
      fileName: "C:/Users/HP/Fauzi/codex/baeback/src/entry-server.jsx",
      lineNumber: 16,
      columnNumber: 13
    }, this) }, void 0, false, {
      fileName: "C:/Users/HP/Fauzi/codex/baeback/src/entry-server.jsx",
      lineNumber: 15,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "C:/Users/HP/Fauzi/codex/baeback/src/entry-server.jsx",
      lineNumber: 14,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "C:/Users/HP/Fauzi/codex/baeback/src/entry-server.jsx",
      lineNumber: 13,
      columnNumber: 7
    }, this) }, void 0, false, {
      fileName: "C:/Users/HP/Fauzi/codex/baeback/src/entry-server.jsx",
      lineNumber: 12,
      columnNumber: 5
    }, this)
  );
  const { helmet } = helmetContext;
  return {
    html,
    head: [
      ((_a = helmet == null ? void 0 : helmet.title) == null ? void 0 : _a.toString()) || "",
      ((_b = helmet == null ? void 0 : helmet.meta) == null ? void 0 : _b.toString()) || "",
      ((_c = helmet == null ? void 0 : helmet.link) == null ? void 0 : _c.toString()) || "",
      ((_d = helmet == null ? void 0 : helmet.script) == null ? void 0 : _d.toString()) || ""
    ].filter(Boolean).join("\n")
  };
}
export {
  CardGridSkeleton as C,
  DashboardSkeleton as D,
  ItemCardSkeleton as I,
  StatCardSkeleton as S,
  DonationListSkeleton as a,
  isSupabaseConfigured as i,
  render,
  supabase as s,
  useAuth as u
};
