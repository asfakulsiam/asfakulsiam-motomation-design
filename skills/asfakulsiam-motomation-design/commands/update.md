# Updating

## Check the installed version
Read `VERSION` in the skill folder. `/version` prints it.

## Check for a newer version
Compare with the latest release:
```bash
curl -fsSL https://raw.githubusercontent.com/asfakulsiam/asfakulsiam-motomation-design/main/skills/asfakulsiam-motomation-design/VERSION
```
If the remote version is higher, tell the user and show the update command. Don't update automatically.

## Update
```bash
npx skills update asfakulsiam-motomation-design        # project install
npx skills update asfakulsiam-motomation-design -g     # global install
```
Claude Code plugin users: `/plugin marketplace update asfakulsiam-motomation-design`.
Chat tools (ChatGPT, Grok, Google AI Studio, v0, Lovable): download the new `dist/motomation-design.md` and replace the old file in your project or instructions.

After updating, read `CHANGELOG.md` in the repository for what changed.
