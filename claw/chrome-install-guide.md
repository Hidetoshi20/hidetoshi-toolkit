# Chrome (Chromium) Installation Guide for Ubuntu 24.04 ARM64

> **Target Environment:** Ubuntu 24.04 LTS (ARM64 / aarch64) running in UTM VM.
> **Problem:** Google does not provide official Chrome builds for Linux ARM64. Snap version of Chromium is buggy in server environments (missing slots/permissions).
> **Solution:** Install native `.deb` version of Chromium via PPA.

## 1. Clean Up (Remove Snap)

If `snap` version was previously installed or partially installed:

```bash
# Remove existing snap
sudo snap remove chromium

# Purge apt dummy package
sudo apt purge chromium-browser -y
sudo apt autoremove -y
```

## 2. Add PPA (xtradeb/apps)

We use `xtradeb/apps` PPA which provides up-to-date native builds for ARM64.

```bash
sudo add-apt-repository ppa:xtradeb/apps -y
sudo apt update
```

## 3. Pin Priority (Critical)

Prevent Ubuntu from automatically reinstalling the Snap version by pinning the PPA version with higher priority.

Create `/etc/apt/preferences.d/chromium-pin`:

```bash
echo 'Package: chromium*
Pin: release o=LP-PPA-xtradeb-apps
Pin-Priority: 1001' | sudo tee /etc/apt/preferences.d/chromium-pin
```

## 4. Install Chromium

Now install the native package.

```bash
sudo apt install chromium -y
```

## 5. Verification

Check version and path. It should NOT reference `/snap/`.

```bash
chromium --version
# Expected: Chromium 1xx.x.xxxx.xx built on Ubuntu ...

which chromium
# Expected: /usr/bin/chromium
```

## 6. Usage in OpenClaw

When using `browser` tool or Playwright, you may need to specify the executable path if auto-detection fails (though `/usr/bin/chromium` is standard).

```bash
export CHROME_BIN=/usr/bin/chromium
```
