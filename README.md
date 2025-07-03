# Amethyst To Do List
To do list built with React (Typescript) + turned into a lightweight cross platform desktop app with Tauri. Also uses Zustand as context/state storage.

[Based on an old Vue to do list I made years ago](https://codepen.io/wrawasia/pen/poJjgJd)

## Tauri Plugins used:
- Updater
- Process
- Dialog

## Future Plans:
- Always ongoing: reorganize code
- When loading the any json (list data or settings, etc), make sure the structure of the json is correct, if not force it to be correct
- Settings page for:
- ...notification/dialog popup after a task timer expires
- ...modifying auto delete on completion
- ...login/logout
- ...delete user/local data from there as well
- ...delete user account
- Check current version date + force an update after 30 days?
- Add an update window that shows the update info AND that shows up only after an update is installed
- Add a sync to do lists with account sign up, leading into monetization