# Project-cover mascot motion follow-up

Verified on 18 November 2026 in ego-browser against the local Storybook Published project-card story.

The project cover mounted `Mascot` without enabling its timeline. The shared eyelid CSS also used a 0.003px layout height, which Chromium rounded to zero: running transform tracks alone did not produce visible blinking. The cover now enables the existing original-vector timeline only for the Default-mascot presentation. Eyelids use a 1px layout box with proportionally scaled transforms and adjusted positioning to preserve the intended native geometry. Static Blink specimens use the same corrected scale.

The new Published story play observes a complete natural cycle without seeking animation tracks and asserts both hop and eyelid movement while card bounds stay fixed. Storybook's Interactions panel reported **PASS** for all four assertions: 3.953865px artwork top-position range, 3.747116px eyelid-height range, 0px card-position change, and 0px card-height change. The artwork's top-position range includes squash/stretch around the original 2.643px translation; it is not a new hop amplitude.

Additional browser checks observed zero mascot animations while the upload affordance was shown, five running tracks after leaving the cover, and zero tracks with the OS reduced-motion preference emulated. The reduced mascot artwork had no transform. These checks did not repeat the earlier full-library visual audit or certify hidden-tab playback.

Validation passed: `bun run check`, `bun run check-types`, and `bun run build-storybook`. No new animation asset, export, or runtime dependency was needed.
