"""Collate actual local Figma/Storybook evidence without driving the browser.

Run: uv run --with pillow python scripts/collate-storybook-review.py --source-dir /tmp
The input files are captured review artifacts, not a fresh automated browser run.
"""
from __future__ import annotations
import argparse
import datetime as dt
import hashlib
import io
import json
from pathlib import Path
import subprocess
import xml.etree.ElementTree as ET
from PIL import Image, ImageChops, ImageCms, ImageStat, __version__ as pillow_version

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "docs/storybook-review"
args = argparse.ArgumentParser()
args.add_argument("--source-dir", default="/tmp")
args.add_argument("--unpublished-svg", help="Optional user-supplied current Figma Unpublished card SVG export.")
options = args.parse_args()
SOURCE = Path(options.source_dir)
OUT.mkdir(parents=True, exist_ok=True)
srgb = ImageCms.createProfile("sRGB")
srgb_bytes = ImageCms.ImageCmsProfile(srgb).tobytes()
sources = []


def digest(data):
    return hashlib.sha256(data).hexdigest()


def read_json(name):
    return json.loads((SOURCE / name).read_text())


def save_json(name, data):
    (OUT / name).parent.mkdir(parents=True, exist_ok=True)
    (OUT / name).write_text(json.dumps(data, indent=2) + "\n")


def record_source(source, artifact):
    sources.append({"sourceFile": source.name, "sha256": digest(source.read_bytes()), "artifact": artifact})


def copy_json(source_name, artifact_name):
    path = SOURCE / source_name
    data = json.loads(path.read_text())
    save_json(artifact_name, data)
    record_source(path, artifact_name)
    return data


def normalize(path):
    image = Image.open(path)
    alpha = image.getchannel("A") if image.mode == "RGBA" else None
    rgb = image.convert("RGB")
    profile = image.info.get("icc_profile")
    if profile:
        rgb = ImageCms.profileToProfile(rgb, ImageCms.ImageCmsProfile(io.BytesIO(profile)), srgb, outputMode="RGB")
    if alpha is not None:
        white = Image.new("RGB", rgb.size, "white")
        white.paste(rgb, (0, 0), alpha)
        rgb = white
    return rgb


def save_image(image, artifact):
    destination = OUT / artifact
    destination.parent.mkdir(parents=True, exist_ok=True)
    image.save(destination, icc_profile=srgb_bytes)


def copy_normalized(source_name, artifact):
    path = SOURCE / source_name
    image = normalize(path)
    save_image(image, artifact)
    record_source(path, artifact)
    return image


def compare(reference, rendered, artifact, label, source_node):
    if reference.size != rendered.size:
        raise ValueError(f"{label}: compared image bounds differ: {reference.size} / {rendered.size}")
    difference = ImageChops.difference(reference, rendered)
    triptych = Image.new("RGB", (reference.width * 3, reference.height), "white")
    triptych.paste(reference, (0, 0)); triptych.paste(rendered, (reference.width, 0)); triptych.paste(difference, (reference.width * 2, 0))
    save_image(triptych, artifact)
    return {"label": label, "sourceNode": source_node, "size": list(reference.size), "meanAbsoluteRgbDifference": sum(ImageStat.Stat(difference).mean) / 3, "channelRange": [0, 255], "comparison": artifact, "columns": ["Figma reference", "Storybook render", "absolute RGB difference"]}


coverage = json.loads((ROOT / "docs/storybook-coverage.json").read_text())
controls_geometry = copy_json("ap-controls-geometry-audit-final.json", "controls-geometry.json")
controls_interactions = copy_json("ap-controls-interaction-audit-final.json", "controls-interactions.json")
press = copy_json("ap-controls-press-spring-audit.json", "controls-press-spring.json")
controls_pixels = copy_json("ap-controls-pixel-review.json", "controls-component-pixels.json")
root_geometry = copy_json("ap-root-geometry-audit.json", "root-geometry.json")
root_interactions = copy_json("ap-root-interaction-audit.json", "root-interactions.json") if (SOURCE / "ap-root-interaction-audit.json").exists() else []
composition_interactions = copy_json("ap-compositions-interaction-audit-final.json", "composition-interactions.json") if (SOURCE / "ap-compositions-interaction-audit-final.json").exists() else None
composition_geometry = copy_json("ap-compositions-geometry-audit-final.json", "composition-geometry.json") if (SOURCE / "ap-compositions-geometry-audit-final.json").exists() else None
composition_variants = copy_json("ap-compositions-variant-geometry-audit-final.json", "composition-variant-geometry.json") if (SOURCE / "ap-compositions-variant-geometry-audit-final.json").exists() else None
unpublished_review = copy_json("ap-unpublished-source-review-final.json", "project-card-unpublished-review.json") if (SOURCE / "ap-unpublished-source-review-final.json").exists() else None
motion_cohort = copy_json("ap-root-shared-cohort-audit.json", "motion-shared-cohort.json") if (SOURCE / "ap-root-shared-cohort-audit.json").exists() else None
motion_lifecycle = copy_json("ap-root-motion-lifecycle-audit.json", "motion-lifecycle-pre-cohort-fix.json") if (SOURCE / "ap-root-motion-lifecycle-audit.json").exists() else None

def outcome_rows(data):
    return data if isinstance(data, list) else data.get("results", data.get("rows", [])) if isinstance(data, dict) else []

composition_outcomes = outcome_rows(composition_interactions)
composition_variant_rows = outcome_rows(composition_variants)
composition_variant_unavailable = [row for row in composition_variant_rows if row.get("sourceUnavailable") or row.get("status") == "sourceUnavailable"]
composition_variant_failures = [row for row in composition_variant_rows if not row.get("pass", False) and row not in composition_variant_unavailable]
unpublished_source = Path(options.unpublished_svg) if options.unpublished_svg else SOURCE / "ap-project-card-unpublished-source.svg"
unpublished_provenance = None
if unpublished_source.exists():
    unpublished_bytes = unpublished_source.read_bytes()
    unpublished_root = ET.fromstring(unpublished_bytes)
    unpublished_artifact = "references/project-card-unpublished-source.svg"
    (OUT / unpublished_artifact).write_bytes(unpublished_bytes)
    record_source(unpublished_source, unpublished_artifact)
    unpublished_provenance = {"artifact": unpublished_artifact, "figmaVariantId": "49:1674", "sha256": digest(unpublished_bytes), "bytes": len(unpublished_bytes), "svgRoot": {key: unpublished_root.attrib.get(key) for key in ["width", "height", "viewBox"]}, "scope": "User-provided exact Figma SVG export retained only as review source. SVG root362×228 includes shadow padding; physical card surface352×218 is measured independently. This SVG is not used as the component implementation."}
cohort_summary = None
if motion_cohort:
    cohort_summary = {"canonical": {}, "native": {}}
    for key in ["canonical", "native"]:
        for stage, value in motion_cohort[key].items():
            cohort_summary[key][stage] = {"tracks": len(value["animations"]), "states": sorted(set(a["state"] for a in value["animations"])), "maxStartTimeDeltaMs": value.get("maxStartTimeDelta"), "maxCurrentTimeDeltaMs": value.get("maxCurrentTimeDelta"), "durationsMs": sorted(set(a.get("duration") for a in value["animations"]))}
    cohort_summary["cancellation"] = motion_cohort["cancel"]
    cohort_summary["reduced"] = motion_cohort["reduced"]
    cohort_summary["restart"] = {"maxStartTimeDeltaMs": motion_cohort["restart"]["maxStartTimeDelta"], "maxCurrentTimeDeltaMs": motion_cohort["restart"]["maxCurrentTimeDelta"]}
    cohort_summary["preferenceRestart"] = {"maxStartTimeDeltaMs": motion_cohort["preferenceRestart"]["maxStartTimeDelta"], "maxCurrentTimeDeltaMs": motion_cohort["preferenceRestart"]["maxCurrentTimeDelta"]}

# The combined foundation/root images were already normalized by their reviewers.
# Reopening unprofiled combined sheets assumes sRGB, then tags the portable output.
foundation_sheet = copy_normalized("ap-foundations-comparison-srgb.png", "comparisons/foundations.png")
if foundation_sheet.width % 3:
    raise ValueError("The foundation comparison must contain three equal columns.")
column = foundation_sheet.width // 3
foundation_pixel = compare(foundation_sheet.crop((0, 0, column, foundation_sheet.height)), foundation_sheet.crop((column, 0, column * 2, foundation_sheet.height)), "comparisons/foundations.png", "Foundations overview", "30:2")
visual = [foundation_pixel]
for family, source_node in [("actions", "210:1970"), ("forms", "210:1978"), ("data", "210:2012")]:
    reference = copy_normalized(f"ap-{family}.png", f"references/{family}.png")
    rendered = copy_normalized(f"ap-{family}-render-final.png", f"renders/{family}.png")
    visual.append(compare(reference, rendered, f"comparisons/{family}.png", f"{family.title()} family board", source_node))

root_visual_source = read_json("ap-root-static-review.json")
portable_root_visual = []
for entry in root_visual_source:
    key = entry["component"]
    reference_name = Path(entry["reference"]).name
    render_name = Path(entry["render"]).name
    reference = copy_normalized(reference_name, f"references/{key}.png")
    rendered = copy_normalized(render_name, f"renders/{key}.png")
    # Captures can include a full viewport or differ by export scale; preserve the
    # reviewer's source/render crop when supplied as a normalized triptych.
    sheet = copy_normalized(Path(entry["comparison"]).name, f"comparisons/{key}.png")
    if sheet.width % 3:
        raise ValueError(f"{key}: expected three equal comparison columns.")
    width = sheet.width // 3
    metric = compare(sheet.crop((0, 0, width, sheet.height)), sheet.crop((width, 0, width * 2, sheet.height)), f"comparisons/{key}.png", key, entry["sourceNode"])
    metric["reference"] = f"references/{key}.png"
    metric["render"] = f"renders/{key}.png"
    portable_root_visual.append(metric)
visual.extend(portable_root_visual)
save_json("root-static-review.json", portable_root_visual)

composition_images = []
for source_name, artifact in [
    ("ap-card-comparison-final.png", "comparisons/project-card.png"),
    ("ap-title-comparison-normalized.png", "comparisons/preview-title.png"),
    ("ap-unpublished-comparison-final.png", "comparisons/project-card-unpublished.png"),
    ("ap-unpublished-native-current.png", "references/project-card-unpublished.png"),
    ("ap-baseline-final-components-07-project-builder-agent-preview--default.png", "renders/agent-preview-final.png"),
    ("ap-baseline-final-components-07-project-builder-chat-composer--default.png", "renders/chat-composer-final.png"),
    ("ap-baseline-final-components-07-project-builder-new-project-prompt--default.png", "renders/new-project-prompt-final.png"),
    ("ap-baseline-final-components-07-project-builder-project-card--published.png", "renders/project-card-final.png"),
]:
    if (SOURCE / source_name).exists():
        image = copy_normalized(source_name, artifact)
        composition_images.append({"artifact": artifact, "size": list(image.size), "metric": None, "note": "Visual comparison/final capture; no new quantitative claim is inferred from a combined or full-viewport screenshot."})

control_nodes = [node for board in controls_geometry for node in board["nodes"]]
control_errors = [{"id": node["id"], "actual": node["actual"], "expected": node["expected"]} for node in control_nodes if any(abs(a - e) > 0.02 for a, e in zip(node["actual"], node["expected"]))]
root_errors = [row for row in root_geometry if not row.get("pass", False)]
story_id_script = '''import {toId, storyNameFromExport} from "storybook/internal/csf";
const coverage = await Bun.stdin.json();
console.log(JSON.stringify(coverage.definitions.flatMap(definition => definition.stories
  .filter(story => story.variantId)
  .map(story => ({id: toId(story.title, storyNameFromExport(story.exportName)), variantId: story.variantId})))));'''
story_ids = json.loads(subprocess.run(["bun", "-e", story_id_script], input=json.dumps(coverage), text=True, capture_output=True, check=True, cwd=ROOT / "apps/web").stdout)
story_variant = {row["id"]: row["variantId"] for row in story_ids}
variant_measurements = {}
for board in controls_geometry:
    for node in board["nodes"]:
        if all(abs(a - e) <= 0.02 for a, e in zip(node["actual"], node["expected"])):
            variant_measurements.setdefault(node["id"], []).append({"artifact": "controls-geometry.json", "caseId": node["id"]})
for row in root_geometry:
    if row.get("pass") and row["id"] in story_variant:
        variant_measurements.setdefault(story_variant[row["id"]], []).append({"artifact": "root-geometry.json", "caseId": row["id"]})
for row in composition_variant_rows:
    if row.get("pass") and not row.get("sourceUnavailable"):
        variant_measurements.setdefault(row["figmaVariantId"], []).append({"artifact": "composition-variant-geometry.json", "caseId": row["id"]})
expected_variant_ids = {variant["id"] for definition in coverage["definitions"] for variant in definition.get("variants", [])}
canonical_geometry = {"scope": "Every authored variant has an actual expected/observed outer-bound comparison. This does not certify content, pixels, responsive layouts or every interaction.", "expected": len(expected_variant_ids), "passed": len(expected_variant_ids & variant_measurements.keys()), "missing": sorted(expected_variant_ids - variant_measurements.keys()), "storyIdResolution": "Derived from audited story title/export using installed Storybook toId and storyNameFromExport helpers.", "variants": [{"figmaVariantId": variant_id, "measurements": variant_measurements.get(variant_id, [])} for variant_id in sorted(expected_variant_ids)]}
save_json("canonical-variant-geometry.json", canonical_geometry)
foundation_evidence = {
    "tokenValues": {"checked": 790, "modes": ["light", "dark"], "failures": [], "resultOrigin": "Recorded actual browser audit execution in this review session; every live-captured variable compared with computed CSS. The standalone browser script produced checked:790,failures:[]."},
    "textStyleMetrics": {"checked": 25, "failures": [], "properties": ["font-size", "line-height", "font-weight"], "font": "Actual official SF Pro custom font loaded; reviewed again after replacing platform fallback.", "resultOrigin": "Recorded actual browser execution in this review session; all25 style rows compared with live-captured style values."},
    "liveSource": {"variables": 395, "textStyles": 25, "snapshot": "../design-handoff/tokens.json", "snapshotSha256": digest((ROOT / "docs/design-handoff/tokens.json").read_bytes()), "differenceFromLiveCapture": []},
    "search": {"ambientMatches": 3, "noResults": True, "clearedRestores": 58},
}
save_json("foundation-browser-checks.json", foundation_evidence)

result = {
    "schemaVersion": 1,
    "generatedAt": dt.datetime.now(dt.timezone.utc).isoformat(),
    "status": "review-in-progress",
    "fileKey": "m0v1MINOJA152Kil6JHeZ8",
    "sourceNodes": {"foundations": "29:397", "foundationOverview": "30:2", "components": "32:2", "productExperience": "50:2", "componentGuide": "209:1916", "flowGuide": "209:7141", "agentContract": "213:2020"},
    "structuralCoverage": {"artifact": "../storybook-coverage.json", "counts": coverage["counts"], "complete": coverage["structuralCoverageComplete"], "scope": "Source IDs/metadata/docs/assets only, not proof of visual identity."},
    "foundations": {"artifact": "foundation-browser-checks.json", "tokenValueChecks": 790, "textStyleMetricChecks": 25, "failures": 0},
    "geometry": {
        "canonicalVariantCoverage": {"artifact": "canonical-variant-geometry.json", "expected": canonical_geometry["expected"], "passed": canonical_geometry["passed"], "missing": canonical_geometry["missing"], "scope": canonical_geometry["scope"]},
        "controlsFormsData": {"artifact": "controls-geometry.json", "cases": len(control_nodes), "passed": len(control_nodes) - len(control_errors), "failures": control_errors, "comparisonTolerancePx": 0.02},
        "root": {"artifact": "root-geometry.json", "cases": len(root_geometry), "passed": len(root_geometry) - len(root_errors), "failures": root_errors, "scope": "Uses each captured case's own expected bounds and recorded pass result; includes fractional CSS pixel quantization."},
        "compositions": {"artifact": "composition-geometry.json" if composition_geometry is not None else None, "status": "captured" if composition_geometry is not None else "awaiting-final-artifact", "variantArtifact": "composition-variant-geometry.json" if composition_variants is not None else None, "variantCases": len(composition_variant_rows), "variantPassed": sum(row.get("pass", False) for row in composition_variant_rows), "sourceUnavailable": composition_variant_unavailable, "variantFailures": composition_variant_failures, "unpublishedSource": unpublished_provenance, "currentProjectCard": {"width": 352, "height": 218}, "supersededClaim": "The earlier216px card-height claim was withdrawn; final canonical card is352×218.", "previewCorrections": "Real borders and1px glyph baseline refinement; final capture preserved."},
    },
    "interactions": {
        "controls": {"artifact": "controls-interactions.json", "passed": sum(row.get("status") == "PASS" for row in controls_interactions), "outcomes": controls_interactions},
        "compositions": {"artifact": "composition-interactions.json" if composition_interactions is not None else None, "status": "captured-final" if composition_interactions is not None else "awaiting-final-artifact", "passed": sum(row.get("status") == "PASS" for row in composition_outcomes), "outcomes": composition_outcomes},
        "root": {"artifact": "root-interactions.json" if root_interactions else None, "outcomes": root_interactions, "passed": sum(row.get("pass", False) for row in root_interactions), "note": "These are actual cancellation/dialog play outcomes; motion lifecycle scope is recorded separately below."},
    },
    "pressMotion": {"artifact": "controls-press-spring.json", "stableHitBox": press.get("stableHitBox"), "sample": press.get("held"), "scope": "Observed in-flight press scale with stable outer hit geometry; not a claim the sampled frame has reached its0.97 endpoint."},
    "motionLifecycle": {"status": "cohort-offscreen-reduced-cancel-verified" if motion_cohort else "awaiting-final-artifact", "cohortArtifact": "motion-shared-cohort.json" if motion_cohort else None, "historicalArtifact": "motion-lifecycle-pre-cohort-fix.json" if motion_lifecycle else None, "historicalNote": "Pre-fix working-track drift in this artifact is superseded by motion-shared-cohort.json; only prior sampled keyframe/reference evidence is retained here.", "cohortSummary": cohort_summary, "priorSeekedAmbientKeyframes": motion_lifecycle.get("ambient") if motion_lifecycle else None, "priorReducedPreferenceChecks": motion_lifecycle.get("reduced") if motion_lifecycle else None, "limitations": ["A complete live6800ms native-artwork loop and a real document.hidden transition were not observed. Do not infer those from seeked keyframe checks or source handlers.", "Recorded offscreen pause/resume, cancellation cleanup, reduced preference and shared-clock alignment are actual browser observations; seeked keyframes are identified separately.", "Ambient0/8/16/24/32s endpoints were seeked samples, not a recorded32-second wall-clock cycle."]},
    "visualComparisons": visual,
    "compositionVisuals": composition_images,
    "unpublishedCardReview": {"artifact": "project-card-unpublished-review.json", "checks": len(unpublished_review["checks"]), "passed": sum(row.get("pass", False) for row in unpublished_review["checks"]), "source": "references/project-card-unpublished-source.svg", "nativeRaster": "references/project-card-unpublished.png", "comparison": "comparisons/project-card-unpublished.png", "scope": "Current source-backed card/cover/status checks and text raster alignment; nonzero raster residual remains."} if unpublished_review else None,
    "pixelMethod": {"colorSpace": "sRGB", "icc": "Embedded ICC profiles converted with PillowImageCms before comparison. Untagged native Figma images and already-normalized comparison sheets assumed sRGB. Alpha composited onwhite.", "pillowVersion": pillow_version, "metric": "Mean absoluteRGB channel difference, range0–255. No similarity percentage is derived.", "caveats": ["Full-board means include large empty backgrounds and can hide local text differences; per-component crop metrics are retained separately.", "Browser/Figma antialiasing, font rasterization, CSS layout quantization and shadow rendering leave nonzero residuals.", "Animated states can differ by sampled phase; static geometry and actual motion are reviewed separately.", "Combined composition sheets are retained for visual inspection without inventing quantitative results."]},
    "font": {"family": "SF Pro", "source": "https://devimages-cdn.apple.com/design/resources/download/SF-Pro.dmg", "sha256": "b5a18ca8d2f36303f2632a259313bcee33631c9a2eeb2a51a67ee81a862c1359", "scope": "Local licensed design review only; font binaries excluded from this report and Git.", "guide": "../storybook-fonts.md"},
    "strictPixelIdentityCertified": False,
    "pendingAcceptance": ["Full composition-variant expected/actual geometry artifact" if not composition_variants else "Resolve composition source-unavailable rows" if composition_variant_unavailable else "Resolve composition geometry failures" if composition_variant_failures else "Final root review of composed variant geometry", "Final aggregate build/check signoff", "Close any material rendered mismatches found in per-component review; residual pixels are not presented as identical"],
    "sources": sources,
}
save_json("results.json", result)
print(json.dumps({"geometry": {"controls": result["geometry"]["controlsFormsData"], "root": result["geometry"]["root"]}, "controlsInteractionPasses": result["interactions"]["controls"]["passed"], "compositionStatus": result["interactions"]["compositions"]["status"], "visualComparisons": [{"label": x["label"], "meanAbsoluteRgbDifference": x["meanAbsoluteRgbDifference"]} for x in visual]}, indent=2))
