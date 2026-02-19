# Frontend Case Implementation Plan

This document describes the step-by-step implementation tasks for the Nuxt 4 + Payload CMS frontend case project.

The goal is to build a **production-ready blog platform** with SSR, SEO, CMS integration, and modern frontend best practices.

---

# Project Overview

We are building a modern blog platform with:

* Nuxt 4 (SSR frontend)
* Payload CMS 3 (headless CMS)
* Tailwind CSS v4
* TypeScript strict mode
* pnpm
* SQLite database

The blog must be SEO-optimized, accessible, responsive, and performant.

---

# Architecture

Frontend: Nuxt 4 SSR app
CMS: Payload headless API
Database: SQLite
Styling: Tailwind CSS v4

Nuxt fetches content from Payload REST API.

---

# Step 1 — Initialize Nuxt Project

Create a Nuxt 4 project with:

* TypeScript strict
* Tailwind CSS v4
* ESLint
* pnpm

Project name: `nuxt-payload-blog`

---

# Step 2 — Setup Payload CMS

Create a Payload 3 project inside `/cms`.

Requirements:

* SQLite database
* Local media storage
* Admin panel enabled

Collections:

## Posts

* title (text, required)
* slug (text, unique)
* excerpt (textarea)
* content (richText)
* coverImage (upload)
* publishedAt (date)
* tags (array of text)

## Authors

* name
* bio
* avatar

---

# Step 3 — Seed Data

Create seed script that inserts:

* 1 author
* 3 posts with content

---

# Step 4 — Nuxt CMS Integration

Create composable:

`/composables/usePosts.ts`

Functions:

* getPosts()
* getPostBySlug(slug)

Fetch from Payload REST:

`/api/posts`
`/api/posts?where[slug][equals]=`

SSR compatible.

---

# Step 5 — Pages

Create pages:

## Home `/`

* Latest posts list
* Hero section

## Blog list `/blog`

* All posts
* Pagination ready

## Blog detail `/blog/[slug]`

* Title
* Cover
* Content
* Author
* Date
* Tags

SSR rendered.

---

# Step 6 — SEO

Implement:

* dynamic meta tags
* Open Graph
* Twitter cards
* canonical URL
* JSON-LD Article schema
* sitemap.xml
* robots.txt

SEO must be generated from post data.

---

# Step 7 — Styling

Use Tailwind v4.

Requirements:

* clean typography
* readable content width
* responsive images
* mobile-first
* max width container
* spacing scale consistency

---

# Step 8 — Accessibility

Ensure:

* semantic HTML
* alt text for images
* aria labels
* keyboard navigation
* sufficient color contrast

---

# Step 9 — Performance

Requirements:

* SSR pages
* optimized images
* lazy loading
* minimal JS
* Lighthouse ≥ 90

---

# Step 10 — Deployment

Frontend: Vercel
CMS: Node server

Environment variables:

* PAYLOAD_URL
* DATABASE_URL

---

# Step 11 — README

Include:

* install steps
* env setup
* dev run
* build
* deploy
* seed command

---

# Definition of Done

The project is complete when:

* CMS manages posts
* Nuxt renders posts SSR
* SEO tags generated
* responsive design works
* demo deployed
* repo clean

---

# Cursor Instructions

Continue implementing the project step-by-step following this plan.

Always:

* use TypeScript strict
* follow Nuxt best practices
* write clean composables
* keep components small
* ensure SSR compatibility
* avoid client-only hacks

When a step is finished, proceed to the next step.
