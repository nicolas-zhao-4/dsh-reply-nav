# Installs dsh-reply-nav into a dsh web profile and registers it in the patch layer.
# Usage: ./install.ps1 [profileName]   (default profile: web)
$ErrorActionPreference = "Stop"

$dshHome = if ($env:DSH_HOME) { $env:DSH_HOME } else { Join-Path $HOME ".dsh" }
$profile = if ($args[0]) { $args[0] } else { "web" }
$profileDir = Join-Path $dshHome "profiles\$profile"

if (-not (Test-Path $profileDir)) {
    Write-Error "profile '$profile' not found at $profileDir. Pass your profile name as the first argument."
    exit 1
}

# 1) copy the package into the profile's node_modules
$nodeModules = Join-Path $profileDir "node_modules"
$target = Join-Path $nodeModules "dsh-reply-nav"
New-Item -ItemType Directory -Force $nodeModules | Out-Null
if (Test-Path $target) {
    Write-Host "already installed: $target"
} else {
    New-Item -ItemType Directory -Force $target | Out-Null
    Copy-Item (Join-Path $PSScriptRoot "lib") (Join-Path $target "lib") -Recurse -Force
    Copy-Item (Join-Path $PSScriptRoot "package.json") (Join-Path $target "package.json") -Force
    Write-Host "installed: $target"
}

# 2) register the loader row in cordis.patch.yml (idempotent)
$patch = Join-Path $profileDir "cordis.patch.yml"
$block = "`n- insert:`n    - id: reply-nav`n      name: dsh-reply-nav`n"
if (Test-Path $patch) {
    $content = Get-Content $patch -Raw
    if ($content -match "id:\s*reply-nav") {
        Write-Host "already registered in $patch"
    } else {
        Add-Content $patch $block
        Write-Host "registered in $patch"
    }
} else {
    Set-Content $patch "# Your patch layer for this dsh profile, applied after every bundle layer.`n$block"
    Write-Host "created $patch with registration"
}

Write-Host ""
Write-Host "Done. Refresh the dsh web page (no dsh restart needed)."
Write-Host "If the rail does not appear, open the browser console (F12) and check /plugins/dsh-reply-nav/client.js returns 200."
