# Beta - v0.3.0

## New Feature

- Login + sync lists!
- Syncing prioritizes the local data, and safely merges remote data - no overwrites!

### Home

- If you are logged in, you can press the Sync button to sync lists with a Supabase database!
- Also retrieves the list from the supabase db

### Login

- Added authentication!
- Added a signup/login page, and you can logout from the settings page

### Settings

- Displays your email if you are logged in
- Can log out from the settings page

### Bug Fixes + Miscellaneous

- Improved item id management, so auto delete should work better now if you click on multiple items within a few seconds of each other
- Some misc. css + ts adjustments as usual
