import { check } from '@tauri-apps/plugin-updater';
import { relaunch } from '@tauri-apps/plugin-process';
import { message } from '@tauri-apps/plugin-dialog';

export async function updater() {
  const update = await check();

  if (update) {
    console.log(`found update ${update.version} from ${update.date}`);

    let downloaded = 0;
    let contentLength = 0;

    await update.downloadAndInstall((event) => {
      switch (event.event) {
        case 'Started':
          if (event.data.contentLength !== undefined) {
            contentLength = event.data.contentLength;
          }
          console.log(`started downloading ${event.data.contentLength} bytes`);
          break;
        case 'Progress':
          downloaded += event.data.chunkLength;
          console.log(`downloaded ${downloaded} from ${contentLength}`);
          break;
        case 'Finished':
          console.log('download finished');
          break;
      }
    });

    console.log('update installed');
    await relaunch();
  } else {
    console.log('up to date');
    await message('You are already running the latest version.', {
      title: 'No updates found!',
      kind: 'info',
    });
  }
}
