## You just cloned the project
### To get the frontend running:
1. cd client
2. npm i
3. npm run dev

### To get the backend running:
1. cd server
2. npm i 
3. npm run serve

## Know Bugs
- ~~Everyone joins with an unused duplicated socket~~
> The problem was in CodeMirrorEditor and EditorPage, there was no boolean key to prevent the duplicate pages in the code editor.
- ~~Code doesn't automatically sync for late joiners~~
> The problem was in CodeMirrorEditor, the onChangeCode sets to the default starting code - not the updated code.
- ~~Names that are too long messes up sidebar CSS~~
> Solved with Tailwind's truncate property

- Pressing more than 1 key simultaneously glitches out the code editor ⚠⚠⚠

## Features To be Implemented
- ~~Language dropdown picker + Make current language sync with web sockets~~
- ~~Editor Theme dropdown picker + Make current theme sync with web sockets~~
- ~~Make compiltation status sync with web sockets~~ 
- ~~*Compilation with Judge0* Late joiners don't receive output~~
> Threw a few ref hooks at it, as the setter of state hooks are asynchronous(?)

- Make the app not look ugly ⚠⚠⚠

## Nice-to-have Features
- Implement cancellation with Axios if the compilation host quits
- New joiners are not notified if code's being compiled at the time
- If there's only 1 player left and you refresh the page, the code is reset back to default. Normally if there are multiple people - the newly written code persists. Maybe bring we could store the code locally if there's a single player?