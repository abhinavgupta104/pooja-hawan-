// ─────────────────────────────────────────────────────────────
//  Packages dist/ into the cPanel upload zip.
//
//  Why not Compress-Archive: Windows PowerShell 5.1 writes entry
//  paths with BACKSLASHES. The ZIP spec (APPNOTE 4.4.17.1) requires
//  forward slashes, and Linux extractors — including some cPanel
//  builds — then create a file literally named "assets\app.js"
//  instead of an assets/ directory, which 404s every script on the
//  deployed site. PowerShell 7 fixed this, so we use pwsh when it is
//  present and fall back to Python's zipfile (also spec-correct).
// ─────────────────────────────────────────────────────────────
import { execFileSync } from 'node:child_process'
import { existsSync, rmSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const DIST = resolve(ROOT, 'dist')
const OUT = resolve(ROOT, 'pujahavan-frontend.zip')

if (!existsSync(DIST)) {
  console.error('✗ dist/ not found — run the build first.')
  process.exit(1)
}
if (existsSync(OUT)) rmSync(OUT)

function tryPwsh() {
  execFileSync(
    'pwsh',
    ['-NoProfile', '-Command', `Compress-Archive -Path (Get-ChildItem "${DIST}" -Force).FullName -DestinationPath "${OUT}" -Force`],
    { stdio: 'pipe' },
  )
}

function tryPython() {
  const script = `
import os, zipfile
dist = r"${DIST}"
out  = r"${OUT}"
with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as z:
    for root, _dirs, files in os.walk(dist):
        for f in files:
            full = os.path.join(root, f)
            rel  = os.path.relpath(full, dist).replace(os.sep, "/")
            z.write(full, rel)
`
  execFileSync('python', ['-c', script], { stdio: 'pipe' })
}

let via = 'pwsh'
try {
  tryPwsh()
} catch {
  via = 'python'
  tryPython()
}

// Verify the separators actually came out right — this is the whole point.
const check = `
import zipfile
z = zipfile.ZipFile(r"${OUT}")
names = z.namelist()
bad = [n for n in names if "\\\\" in n]
print(len(names), len(bad))
`
const [total, bad] = execFileSync('python', ['-c', check], { encoding: 'utf-8' }).trim().split(/\s+/).map(Number)

if (bad > 0) {
  console.error(`✗ ${bad} zip entries still use backslashes — cPanel would extract these wrongly.`)
  process.exit(1)
}
console.log(`✓ pujahavan-frontend.zip — ${total} files, forward-slash paths (via ${via})`)
