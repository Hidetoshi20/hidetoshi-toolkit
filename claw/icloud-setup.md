# iCloud Sync Setup Guide (CalDAV/CardDAV)

> **Status:** Active
> **Last Updated:** 2026-02-13
> **Tools:** `vdirsyncer`

This document describes how OpenClaw syncs with Hidetoshi's iCloud Reminders and Calendars within the Ubuntu VM.

## 1. Installation
The sync is powered by `vdirsyncer` (installed via apt).

```bash
sudo apt install vdirsyncer
```

## 2. Configuration
The main configuration file is located at `~/.config/vdirsyncer/config`.

### Credentials used:
- **Username**: `zwh.20@qq.com`
- **Password**: App-Specific Password (generated at appleid.apple.com).
- **DSID**: `10228098694` (Used in the CalDAV URL).

### Server URL Pattern:
`https://p227-caldav.icloud.com.cn/10228098694/principal/`

## 3. Storage Structure
Local files are synced to:
`~/.local/share/vdirsyncer/collections/`

Each collection (Reminder List or Calendar) is stored in a UUID-named subfolder containing individual `.ics` files.

## 4. Maintenance Commands

- **Manual Sync**: `vdirsyncer sync`
- **Discover New Lists**: `vdirsyncer discover`
- **Check Status**: `vdirsyncer metasync`

## 5. Automated Jobs
- **Status Check**: Every 20 mins (08:00-23:59), the agent runs `vdirsyncer sync` to stay updated.
- **Daily Briefing**: At 08:00 AM, the agent reads these local files to summarize the day.
