# WebCraft

A Minecraft inspired game engine based on WebGL - Work In Progress

## Inspired by

TypeScript Game Dev Series - [GLOOM](https://www.youtube.com/redirect?redir_token=r-7RGtn6INKqVcbnAsfkctrJ8qx8MTU5MDUyNDU3NkAxNTkwNDM4MTc2&q=https%3A%2F%2Fgithub.com%2Ftravisvroman%2Fgloom&v=Td7R3JLxa0o&event=video_description)
By [Travis Vroman](https://www.youtube.com/watch?v=PMvQQlx1L5w&list=PLv8Ddw9K0JPgdB1nl41SpcssTKskP2D5C)

## Progress

Slowly, slowly..
![Screenshot](screenshot.gif)

## [Live Demo](https://kp.id.lv/)

### TODO

- [ ] Move date from Level to DataStore
- [ ] Set up World
  - [x] Initial demo level
  - [ ] Procedural generation
- [ ] Set up asset loading
  - [x] Initial demo texture loading
  - [ ] Texture atlas
  - [ ] Loading phase
- [ ] Set up Entities
  - [x] Entities class
    - [x] Voxel call
  - [ ] Component class
  - [ ] SafeArray class
  - [x] Remove redundant Block class
- [x] Set up rendering
  - [x] Combine block mesh
  - [ ] Optimize mesh updating
  - [ ] Refactor level code
- [ ] Create a HTML5 HUD system
  - [ ] Add SCSS support
  - [ ] Update only on events
  - [ ] Redo debug HUD
  - [ ] Add crosshair
- [ ] Set up Physics
  - [ ] Collisions
  - [ ] Gravity
- [ ] Set up game states
- [ ] Limit delta time
- [ ] Create globals
- [ ] Create dispose methods
- [ ] Set up audio
- [ ] Add more TODOs...

### Done

- [x] Set up development project
  - [x] Git
  - [x] Prettier
  - [x] Linter
- [x] Set up build process
  - [x] Bundler
  - [x] Debugging
  - [x] Assets
- [x] Set up skeleton page
  - [x] Handle canvas resizing
  - [x] Set up game-loop
- [x] Set up data store
- [x] Set up messaging
- [x] Add Game class
- [x] Set up basic WebGL
- [x] Set up input handling
  - [x] Keyboard handling
  - [x] Mouse locking

## To run

First install dependencies:

```sh
npm i
```

To run locally on `localhost:1234`:

```sh
npm start
```

To create a production build:

```sh
npm run build
```

To debug on VS Code run locally and start the debugger
