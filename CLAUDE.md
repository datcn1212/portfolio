# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A static personal portfolio website for Nhu-Dat Cao — no build tools, no framework, no dependencies. Three source files plus assets.

## Running Locally

Open `index.html` directly in a browser. No server, build step, or install required.

## Architecture

Single-page site with three files:

- **[index.html](index.html)** — All markup, organized as sections: `#hero`, `#experience`, `#skills`, `#projects`, `#education`, `#achievements`, `#contact`
- **[styles.css](styles.css)** — CSS custom properties for the design system (colors, spacing, shadows). Responsive breakpoint at 640px. Animations: blob morph, typing cursor, scroll reveal.
- **[scripts.js](scripts.js)** — Vanilla JS: typed role animation, IntersectionObserver scroll reveals, hamburger menu toggle, nav active-link tracking on scroll.

Images live in [assets/](assets/).

## Key Patterns

- **Scroll reveal**: `.reveal` class on elements; JS adds `.active` via `IntersectionObserver`. Staggered delays via inline `--delay` CSS variable.
- **Typed animation**: cycles through an array of role strings in `scripts.js`, controlled entirely in JS.
- **Color/spacing tokens**: all defined as `--var-name` on `:root` in `styles.css` — change values there, not inline.
