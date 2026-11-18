# SF Pro for local design review

The AP design uses **SF Pro**, width axis 100, and weights Regular 400, Medium 510, Semibold 590 and Bold 700. The platform system font is also San Francisco on macOS, but it has different glyph metrics; it is not evidence of an exact Figma match.

The local review now uses the original variable `SF-Pro.ttf` from [Apple's official fonts page](https://developer.apple.com/fonts/) and its linked [SF Pro package](https://devimages-cdn.apple.com/design/resources/download/SF-Pro.dmg). No mirror, conversion, glyph editing, or global font installation is used.

## Prepare the local font

On macOS:

```sh
bun run scripts/setup-storybook-fonts.ts
```

The command downloads Apple's package only when the canonical local font is absent, mounts the DMG read-only, extracts its package without running the installer, validates the SF Pro family and variable axes, and copies the original TTF to these ignored locations:

- `packages/ui/src/assets/fonts/SF-Pro.ttf`: canonical local copy, with the package license and provenance.
- `apps/web/public/fonts/SF-Pro.ttf`: served at `/fonts/SF-Pro.ttf` by the app and Storybook.

Existing canonical fonts are preserved. `--refresh` explicitly fetches the current official package again. On another operating system, place an appropriately licensed original variable `SF-Pro.ttf` in the canonical local directory and rerun the command; it validates and copies the file without using macOS extraction tools.

The CSS declares weights 1–1000 and width 30%–150%, preserving the official variable face. Keep optical sizing automatic: the reviewed 14px control text selects optical size 17. Setting optical size 28 or disabling optical sizing changes the label geometry.

The inspected package has axes `wdth` 30–150/default 100, `opsz` 17–28/default 28, and `wght` 1–1000/default 400. The reviewed original TTF SHA-256 is `b5a18ca8d2f36303f2632a259313bcee33631c9a2eeb2a51a67ee81a862c1359`.

## License and publishing boundary

Apple's bundled SF Pro license limits use to UI mockups for software running on Apple's operating systems, includes a registered Apple Developer condition, and restricts embedding and redistribution. It explicitly does not grant general website-content use. Read the exact `APPLE-SF-PRO-LICENSE.rtf` copied alongside the local font; the official package contains the complete terms.

These binaries are prepared for the authorized local design review and are **not committed to GitHub**. This setup does not establish permission to embed SF Pro in a publicly deployed Agentplace website. Choose an appropriately licensed production font or obtain the required permission before public distribution.

A static Storybook build copies public assets, including a locally provisioned font. Keep that output local for review; do not publish its `fonts` directory under the assumption that ignoring the source binary in Git also removes it from build output.

## Review evidence

With the official face loaded, Chrome reports `SF Pro` / `SFPro-Regular` as a custom font rather than the macOS `.SF NS` fallback. At 14px, weight 510, width 100 and automatic optical sizing, natural label widths are 60.90625px for “Continue” and 68.1875px for “Unpublish”; Figma's 61px and 69px text frames are their whole-pixel allocations. Check the actual rendered component bounds and source frames as well as declared font CSS.
