# Learn Guide Visual Review Report

**Date:** 2026-02-10
**Screenshots:** `/tmp/learn-guide-review/` (20 screenshots, desktop + mobile for all pages)

---

## Executive Summary

All pages render and load correctly — no broken pages, missing components, or blank sections. Interactive components (visualizers, sliders, toggles) are present on all pages. The main issues are **mobile text readability**, **breadcrumb truncation on mobile**, and a **possible umlaut issue on the German Transformer page** that needs manual verification.

---

## Page-by-Page Findings

### 1. Homepage (`/en`)
| Viewport | Status |
|----------|--------|
| Desktop | ✅ Good |
| Mobile | ⚠️ Minor issues |

- **Desktop:** Recently Updated grid, topic cards, and features section all render correctly. The rightmost "Recently Updated" card is slightly clipped — no scroll indicator visible.
- **Mobile:** Topic cards are very text-dense. Touch targets on tag/badge elements are small. CTA buttons could be full-width on mobile. No pagination for the long topic list.

### 2. LoRA (`/en/ai/llm/lora`)
| Viewport | Status |
|----------|--------|
| Desktop | ✅ Good |
| Mobile | ⚠️ Minor issues |

- **Desktop:** All 4 visualizer sections present and functional:
  - ✅ Matrix decomposition with dimension labels
  - ✅ VRAM & Storage comparison with rank slider (rank options 16/128/768)
  - ✅ Rank vs. Approximation Quality chart
  - ✅ LoRA variants comparison
  - ✅ Use cases and Anti-use-cases sections
- **Mobile:** Matrix decomposition diagram is cramped with barely legible dimension labels. VRAM comparison bars are squeezed. Dense text in gradient-bordered cards.

### 3. Transformer Architecture (`/en/ai/llm/transformer-architecture`)
| Viewport | Status |
|----------|--------|
| Desktop | ✅ Good |
| Mobile | ⚠️ Minor issues |

- **Desktop:** Layer stack explorer present with all 7 layers. "Send a Token Through" button visible. Encoder-Decoder toggle works with 3 variants. Dataflow section present.
- **Mobile:** Interactive diagrams cramped. Architecture variant toggle buttons are small tap targets. Dataflow diagram compressed and hard to follow.

### 4. Local Inference (`/en/ai/llm-inference/local-inference`)
| Viewport | Status |
|----------|--------|
| Desktop | ✅ Good |
| Mobile | ⚠️ Minor issues |

- **Desktop:** GPU compatibility grid present with model size/quantization selectors. Shows VRAM Required and Estimated Speed. Tools comparison (Ollama, llama.cpp, LM Studio, vLLM, text-generation-webui) with ratings columns.
- **Mobile:** GPU cards wrap aggressively with awkward line breaks. Code blocks have very small font. Tables could benefit from card layout on mobile.

### 5. KV Cache (`/en/ai/llm-inference/kv-cache`)
| Viewport | Status |
|----------|--------|
| Desktop | ✅ Good |
| Mobile | ⚠️ Minor issues |

- **Desktop:** Interactive KV Cache Explorer with Play/Step controls, token display, and data table (empty at Step 0, as expected). Memory formula renders correctly. Optimization techniques section present.
- **Mobile:** Breadcrumb truncated ("rtificial" instead of "Artificial Intelligence"). KV Cache table columns extremely compressed. Code/formula blocks lack visible horizontal scroll.

### 6. Batching (`/en/ai/llm-inference/batching`)
| Viewport | Status |
|----------|--------|
| Desktop | ✅ Good |
| Mobile | ⚠️ Minor issues |

- **Desktop:** Throughput vs Batch Size slider, Prefill vs Decode comparison, Continuous Batching timeline with play/reset, Per-User vs System throughput — all present. Color legends are small.
- **Mobile:** Charts and visualizations are small and potentially illegible. Code blocks have tiny font. Breadcrumb area cluttered.

### 7. Attention (`/en/ai/llm/attention`)
| Viewport | Status |
|----------|--------|
| Desktop | ✅ Good |
| Mobile | ⚠️ Minor issues |

- **Desktop:** Attention Map Simulator with 3 example tabs, token display, focus indicator, and legend. Q/K/V cards present. Score formula bar, optimization cards, scaling problem visualization all render correctly. Attention connections only show on hover (expected).
- **Mobile:** Attention grid may overflow on narrow devices. Comparison metric cards (speed/time stats) are cramped in 3-column layout.

### 8. Agent Loop (`/en/ai/agents/loop`)
| Viewport | Status |
|----------|--------|
| Desktop | ✅ Good |
| Mobile | ⚠️ Minor issues |

- **Desktop:** Agent loop visualizer present with Play button, Step counter, code panel, and Context area (0 tokens at start). "Start Loop" label could use better button styling. Four Phases cards (Observe, Think, Act, Learn) render correctly.
- **Mobile:** Breadcrumb truncated ("rtificial ntelligence"). Code block in "The Core Pattern" truncates (`tool_defini...`). Code needs `overflow-x: auto`.

---

## German Pages — Umlaut Check

### German Transformer (`/de/ai/llm/transformer-architecture`)
| Viewport | Status |
|----------|--------|
| Desktop | ⚠️ **Needs manual verification** |
| Mobile | ✅ Umlauts OK |

- **Desktop:** One analysis detected possible umlaut substitutions (ü→ue, ö→oe, ß→ss patterns like "fuer", "Groesse", "Schluesselkonzepte"). However, the mobile version of the same page showed umlauts rendering correctly. **This discrepancy needs manual verification** — it may be a false positive from the image analysis model.
- **Mobile:** All umlauts (ä, ö, ü, ß) render correctly. "Schlüsselkonzepte", "für", "Übersetzung" all display properly.

### German LoRA (`/de/ai/llm/lora`)
| Viewport | Status |
|----------|--------|
| Desktop | ✅ Umlauts OK |
| Mobile | ✅ Umlauts OK |

- Both viewports show correct umlaut rendering: "ermöglicht", "für", "Überanpassung", "Großes Sprachmodell" all display properly.

---

## Cross-Cutting Issues

### 🔴 Recurring Problems

1. **Mobile breadcrumb truncation** — Seen on KV Cache and Agent Loop pages. "Artificial Intelligence" gets clipped to "rtificial" or "rtificial ntelligence". Needs `text-overflow: ellipsis` or a collapsed breadcrumb on mobile.

2. **Mobile code block overflow** — Code blocks truncate without horizontal scroll indicators on Agent Loop and other pages. Apply `overflow-x: auto` with visible scrollbar hint.

3. **Small text in visualizations on mobile** — Charts, graphs, and comparison tables have text that's too small to read on mobile. Consider increasing minimum font size or providing zoom/expand functionality.

### 🟡 Nice-to-Have Improvements

4. **Recently Updated scroll indicator** (Homepage) — Add dots, arrows, or a visible scrollbar to indicate the carousel is scrollable.

5. **Touch target sizes on mobile** — Tags, small buttons, and tab controls are below the recommended 44×44px minimum.

6. **Dense text in cards on mobile** — German text especially suffers from this due to longer compound words. Consider increased padding/line-height for DE locale.

7. **Agent Loop "Start Loop" affordance** — The label looks like plain text, not a button. Add clear button styling.

---

## Summary

| Page | Desktop | Mobile |
|------|---------|--------|
| Homepage | ✅ | ⚠️ Minor |
| LoRA | ✅ | ⚠️ Minor |
| Transformer | ✅ | ⚠️ Minor |
| Local Inference | ✅ | ⚠️ Minor |
| KV Cache | ✅ | ⚠️ Minor |
| Batching | ✅ | ⚠️ Minor |
| Attention | ✅ | ⚠️ Minor |
| Agent Loop | ✅ | ⚠️ Minor |
| DE Transformer | ⚠️ Verify umlauts | ✅ |
| DE LoRA | ✅ | ✅ |

**Overall verdict:** All pages are functional with all interactive components present. Desktop layouts are solid. Mobile has consistent minor issues around text size, touch targets, and breadcrumb truncation. No critical broken layouts or missing components found.
