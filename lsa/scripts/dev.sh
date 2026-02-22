#!/usr/bin/env bash
# Raise open-files limit to avoid EMFILE with Webpack watcher, then start Next.js dev server.
ulimit -n 65536 2>/dev/null || true
exec next dev --webpack
