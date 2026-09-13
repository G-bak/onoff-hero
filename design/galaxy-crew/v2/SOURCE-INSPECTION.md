# Gesture v2 source inspection

Generated with image_gen, two passes per character. All five original identity sheets and the supplied solidarity-gesture reference were visually inspected first. No code was used to invent poses, mirror bodies, add marks, or synthesize motion.

Selected source files: strategy-16.png, design-16.png, website-16.png, marketing-16.png, operation-16.png. Each is a 1024×1536 PNG with 4 columns × 4 rows and sixteen separately image-generated full-body poses. PNG header dimensions, byte counts and SHA256 are in file-verification.json. Exact generated-file origins are in selected-files.json.

prompts.json records the initial requests; correction-prompts.json records the applied second pass. The corrected strategy action sheet was used as the first pose reference for the other four characters, while each existing identity sheet was used as the second reference. This corrected the right-arm bias from the old identity sheets.

## Visual checks

- All five maintain recognizable original agency identities, hairstyles, clothes, pale miniature plinths and solid vivid green backgrounds.
- All selected raised poses use anatomical LEFT arm (viewer-left from behind), with generated black X on exposed left wrist/distal forearm. No subsequent artwork overlay or body mirroring was applied.
- Sixteen genuine painted poses per person show frontal anticipation, torso/foot pivot, rear transition and incremental left-arm lifting. Last row contains distinct lifts/extensions.
- Strategy final: tall raised left arm; free right hand on hip.
- Design final: raised left arm with hip/contrapposto and free right hand at hip/small of back.
- Website final: left arm raised; free right arm hangs relaxed at side. Its planned behind-back hand/narrow stance was not fully followed, accepted by root as a distinct valid relaxed pose rather than regenerating the whole sheet.
- Marketing final: left arm raised with wider stance; free right elbow bends at waist. Some head lead/overshoot toward the opposite side occurs in frames8–9 before settling to exact rear.
- Operation final: tall left arm raised; free right hand in pocket, soft knee.

## Packing caveats agreed with root

The generator did not follow exact cell-local body height and margins despite both requests. Source silhouettes are complete on each full image, but some raised fists cross the nominal y=1152 fourth-row boundary by a few pixels. Body crown-to-base height and row baselines also drift slightly. Root will isolate complete silhouette components across nominal row boundaries, normalize crown-to-base height and align feet when packing, preserving all generated pixels. Do not slice blindly into equal 256×384 rectangles.

Head/torso angles are approximate rather than exact requested degree values. Strategy and website show a small rear-angle variation near the second/third-row boundary; root inspected and accepted them as usable source poses. All final backs and raised left wrists are clear. Exact arm-extension personality differs less than the prompt intended, but free-right-arm stance differs across the set.

Only temporary-directory files were authored/copied in this asset subtask. The image generator automatically retained its originals under .codex/generated_images. No site checkout source/assets, git commits, pushes, deployment settings or servers were modified here.
