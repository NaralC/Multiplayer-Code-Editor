Hey don't mind the fact that each connection comes with an extra socket 🥶 (for now)

## You just cloned the project
### To get the frontend running:
1. cd client
2. npm i
3. npm run dev

### To get the backend running:
1. cd server
2. npm i 
3. npm start  

## Know Bugs
- ~~Everyone joins with an unused duplicated socket~~
> The problem was in CodeMirrorEditor and EditorPage, there was no boolean key to prevent the duplicate pages in the code editor.
- ~~Code doesn't automatically sync for late joiners~~
> The problem was in CodeMirrorEditor, the onChangeCode sets to the default starting code - not the updated code.

- If the host disconnects, the room dies
- Fast typing glitches out the code editor