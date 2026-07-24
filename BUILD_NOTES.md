# Ridgeline — Build 1

This is a reversible first implementation pass based on the July 24, 2026
drawing-board discussion.

## Added

- Guided lead intake for:
  - Current roof type
  - Approximate roof age
  - Existing layers
  - Requested work
  - Reason for calling
  - Property use
  - Decision timeline
  - Intake notes
- Intake answers are copied into the new job and prefill the roof inspection
  checklist where applicable.
- Contact and property identifiers are created separately from the job
  identifier for new leads.
- Contacts are grouped into customer cards that can show multiple properties
  and projects.
- The job overview now includes an intake snapshot.
- Targeted feature coverage for lead creation and flat-roof checklist
  completion.

## Fixed

- Creating a lead no longer throws during activity logging, so the lead sheet
  closes and the new job opens.
- Flat / membrane roofs no longer require pitch before the inspection
  checklist can be completed.
- Flat and low-slope pitch choices now include flat, 1/12, and 2/12.
- Shared buttons now emit a proper disabled attribute for accessibility and
  reliable testing.

## Verification

- Production build: passed
- Full application smoke walkthrough: passed with no captured runtime errors
- Lead intake and flat-roof feature test: passed

## Rollback

The originally uploaded `Ridgeline-main.zip` remains untouched. Replacing this
build with that archive returns the project to the exact pre-build baseline.
