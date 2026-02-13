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

## 6. Known Limitation: Reminders Upgrade
Apple's "Modern Reminders" architecture (post-iOS 13) uses CloudKit and is **not compatible** with CalDAV/vdirsyncer.
- **Symptom**: `vdirsyncer` only shows two items: "The creator has upgraded these reminders" and "Where can I find my reminders?".
- **Status**: CalDAV sync for Reminders is disabled.

## 7. Advanced Sync: pyicloud (Working)
To bypass Apple's lockout, we use the `pyicloud` Python library to simulate a web login.
- **Script**: `~/.openclaw/workspace/icloud_reminders.py`
- **Requires**: Real Apple ID Password + 2FA (one-time).
- **Update Logic**: The agent runs this script to fetch real-time tasks.
