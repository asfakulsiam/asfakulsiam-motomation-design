# Skill Update Commands

## /version
Report the current installed version of this skill.

Look for the `VERSION` file in the skill root.  
Current expected format: semantic version (e.g. `1.2.0`)

## /check-update
Check whether a newer version of the skill is available.

1. Read the local `VERSION` file.
2. Compare against the latest version published in the official repository:
   `https://github.com/asfakulsiam/asfakulsiam-motomation-design`
3. Report:
   - Current installed version
   - Latest available version
   - Whether an update is recommended

If network access is unavailable, clearly state that the check could not be performed.

## /update-skill
Update the skill to the latest version.

### Recommended methods

**Method 1 — skills CLI (preferred)**
```bash
npx skills add asfakulsiam/asfakulsiam-motomation-design --force
```

**Method 2 — Manual**
1. Download the latest release or clone the repository.
2. Replace the existing skill folder.
3. Restart the agent / reload the skill.

### After updating
- Confirm the new version with `/version`
- Re-run the thinking sequence on the current task if needed

---

## For environments like v0, Cursor, Claude Code, etc.

When the skill is already installed in a project and a new version is released:

1. Run `/check-update` to confirm a newer version exists.
2. Run the update command above.
3. Restart the agent session or reload skills so the new files are picked up.

The skill is designed so that updating is non-destructive to the user’s project code.