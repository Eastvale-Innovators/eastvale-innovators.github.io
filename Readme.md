# Eastvale Innovators Website

This repository contains the public website for Eastvale Innovators, a student-led STEM organization focused on building real-world projects, organizing teams, and creating opportunities for collaboration and leadership. The site is a static, content-first experience designed to present the organization clearly to students, mentors, partners, and visitors.

## Overview

The website is organized as a collection of standalone HTML pages with shared assets, reusable header and footer partials, and small JavaScript helpers that keep navigation and layout behavior consistent. It presents the organization at three levels:

1. The brand and mission of Eastvale Innovators as a whole.
2. The teams and people who contribute to the organization.
3. The individual projects and initiatives the teams are building.

The site is intentionally broad in scope. It is not just a project showcase; it is the public home for the organization, its current work, and its identity.

## What Visitors Can Find

- A home page that introduces Eastvale Innovators and establishes the visual identity of the site.
- A projects page that groups initiatives by current and past work.
- Dedicated project pages for major efforts such as Roosevelt Connect, Intelligrader, and Virtual Medical Missions.
- A teams page that breaks the organization into its constituent groups.
- A leadership page for organizational leadership and structure.
- A contact page for outreach, partnerships, and general communication.

## Site Map

- `index.html` - homepage and organization overview
- `projects.html` - consolidated project gallery and discovery page
- `leadership.html` - leadership and organizational roles
- `teams.html` - team directory and team-specific anchors
- `contact.html` - contact and outreach page
- `roosevelt-connect.html` - Roosevelt Connect project page
- `intelligrader.html` - Intelligrader project page
- `virtual-medical-missions.html` - Virtual Medical Missions project page
- `project-template.html` - base template for adding new project pages

## Shared Architecture

The site uses a lightweight shared-component pattern instead of a framework or build pipeline.

- `partials/header.html` contains the global navigation markup.
- `partials/footer.html` contains the shared footer content.
- `assets/js/shared-header.js` loads the header partial into each page.
- `assets/js/shared-footer.js` loads the footer partial into each page.
- `assets/js/site-common.js` handles shared UI behavior such as dropdown navigation, mobile menu interactions, navbar state, and theme toggling.
- `assets/css/shared-header.css` and `assets/css/shared-footer.css` provide the shared styling for those reused sections.

This structure keeps the pages visually aligned while still allowing each page to have its own layout, content, and styling.

## Navigation Model

The header is built to reflect the site’s content hierarchy rather than flatten everything into a single list.

- The main nav points to the homepage, projects, teams, and contact areas.
- The Projects dropdown separates past and current work.
- The Teams dropdown exposes anchors for each major team section.
- The mobile menu mirrors the desktop navigation and keeps the same grouping.

That structure makes the site easier to scan and keeps the most important destinations close together.

## Design Direction

The current site leans into a bold, high-contrast, futuristic STEM aesthetic. Across the pages, you will see:

- Deep navy and dark backgrounds with bright accent colors.
- Large display typography using Google Fonts such as Inter, Space Grotesk, Orbitron, and related families.
- Hero sections with gradients, overlays, and motion.
- Project pages that use strong color themes to distinguish each initiative.
- Card-based content sections and glass-like surfaces for hierarchy and readability.

The design language is meant to feel energetic and student-built, while still being polished enough to represent the organization publicly.

## Key Pages

### Home

The home page sets the tone for the whole site. It introduces the organization, gives visitors a fast sense of the brand, and points them to deeper content.

### Projects

The projects page collects the organization’s work into one place so visitors can understand what Eastvale Innovators is building without needing to hunt through multiple pages.

### Teams

The teams page is structured to help visitors understand how the organization is divided. Navigation links and page anchors point to:

- Eastvale Innovators Team
- Roosevelt Connect Team
- Intelligrader Team
- Virtual Medical Missions Team

### Leadership

The leadership page gives visibility to the student leaders guiding the organization and helps establish the organizational structure.

### Contact

The contact page exists for collaboration, questions, partnerships, and general outreach.

## Project Pages

The site currently highlights several initiatives with their own dedicated pages:

- Roosevelt Connect - a current project page focused on its own mission and presentation.
- Intelligrader - an AP History FRQ scoring tool with its own product-style landing page.
- Virtual Medical Missions - a past project page centered on outreach, operations, and support infrastructure.

The projects page and navigation also separate current and past work so visitors can understand what the organization is actively building versus what has already been completed.

## Assets And Content

- `assets/img/` contains the visual assets used across the site, including banners, backgrounds, logos, and project imagery.
- `assets/models/` contains model assets used on pages that need them.
- `assets/sfx/` stores sound assets where applicable.
- `assets/css/` and `assets/js/` contain shared site logic and shared styles.

When adding new content, keep assets organized by type and reuse existing visual patterns where possible.

## Content Conventions

- Use short, direct section headings.
- Prefer explicit page labels over generic wording.
- Keep project descriptions specific to the actual work being shown.
- Update navigation when a page becomes important enough to be discoverable site-wide.
- Keep the public-facing copy consistent with the tone used across the rest of the site.

## Local Development

This is a static site, so it can be previewed directly in a browser. For a more reliable local workflow, serve the repository with a simple static server so relative paths, partial loading, and page navigation behave the same way they do online.

Example:

```bash
python -m http.server
```

Then open the local address printed in the terminal.

If you are working on the shared header, footer, or JavaScript loaders, refresh pages after edits so the partials are reloaded from disk.

## How To Add A New Page

1. Start from `project-template.html` if the new page is a project page.
2. Update the page metadata, title, and canonical URL.
3. Reuse the shared header and footer partials.
4. Add any page-specific assets under `assets/`.
5. Keep the styling aligned with the rest of the site unless the new page has a deliberate visual identity of its own.

## Editing Guidelines

- Keep the shared navigation and footer in sync with every page.
- Preserve the site-wide tone: student-driven, technical, and polished.
- Prefer clear page organization over adding more visual noise.
- Use the existing partials and shared scripts instead of duplicating markup.
- If you introduce a new project, update the navigation and project listings so the site stays coherent.
- Test changes on both desktop and mobile widths when modifying layout-heavy pages.

## Maintenance Checklist

When making a site-wide change, verify the following:

- The header and footer still load correctly on every page.
- The nav links still point to the right pages and anchors.
- Project pages still have correct meta tags and page titles.
- New assets are committed under the right folder in `assets/`.
- The homepage, projects page, and contact page still reflect the current state of the organization.

## Deployment

The repository is configured for GitHub Pages hosting under `eastvale-innovators.github.io`.

There is no build step. The site is published directly from the repository’s HTML, CSS, JavaScript, and asset files.

## Why This Site Exists

The purpose of the website is to give Eastvale Innovators a single public home that communicates:

- Who the organization is.
- What the organization is building.
- Who is involved.
- How people can get in touch or collaborate.

In other words, the site should function as the organization’s front door, archive, and project showcase all in one.

## Credits

The footer credits the site’s creators and supporting contributors. Keep those names current if the ownership or maintenance structure changes.