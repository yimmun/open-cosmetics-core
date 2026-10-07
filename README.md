# OpenCosmetics Core

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6.svg)](https://www.typescriptlang.org/)

**The open-source data kernel and deterministic regulatory engine for cosmetic formulation.**

Designed to decouple personal care product development from legacy, proprietary PLM software. Runs 100% locally with zero external API dependencies, zero latency, and zero LLM hallucinations.

---

## Key Features

- **Deterministic BOM & Formulation Engine**: Real-time 100.00% QS balancing, multiphase sequencing (Phases A/B/C), water/oil ratio dynamics, and linear batch weight scaling (g to metric tons).
- **Offline Regulatory Screening**: Instant cross-checking against:
  - Health Canada Cosmetic Hotlist
  - EU Regulation (EC) No 1223/2009 (Annexes II–VI)
  - California Proposition 65
- **Chemical Stoichiometry**: Dedicated precursor-to-coupler molar ratio balancing for oxidative hair dyes and metallo-phenolic complexes.
- **Standardized Data Schema**: Native export/import using the open `OpenCosmeticSpec` JSON format.

---

## Quickstart

```bash
npm install @cosmetic/core
