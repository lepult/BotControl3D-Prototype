<div align="center">
    <h1><a href="https://github.com/lepult/BotControl3D-Prototype">bot-control-3d</a></h1>
    <p>An application that can be used to supervise service-robots</p>
    <a href="https://github.com/TobitSoftware/chayns-toolkit">
        <img 
            alt="Managed with chayns-toolkit" 
            src="https://img.shields.io/badge/managed%20with-chayns--toolkit-%23000?style=for-the-badge"
        />
    </a>
</div>

---

<b>IMPORTANT</b>: This is a Prototype!

This application can be used to monitor, control and configure service robots. The service robots need to be integrated in the BotControlBackend by Tobit Laboratories.

![Screenshot of the Prototype](resources/Screenshot%20Uebersicht.png)

This application also offers a 3D view of a buildings floors. This 3D View can be edited via drag and drop. The 3D (glTF) Models were created, using the [Scaniverse App](https://scaniverse.com/).

![Video that shows dragging of models](resources/Animation.gif)

---

## Dependencies

### Web Framework

- [React](https://react.dev/)
- [Redux](https://redux.js.org/)

### 3D Map

- [deck.gl](https://deck.gl)
- [loaders.gl](https://loaders.gl)

### chayns

- [chayns-api](https://github.com/TobitSoftware/chayns-api)
- [chayns-colors](https://github.com/TobitSoftware/chayns-colors)
- [chayns-components](https://github.com/TobitSoftware/chayns-components)
- [chayns-toolkit](https://github.com/TobitSoftware/chayns-toolkit)

### Testing

- [jest](https://jestjs.io/)
- [enzyme](https://enzymejs.github.io/enzyme/)

(Note that tests can be found in files that end with test.ts/tsx)

### Misc

- [clsx](https://github.com/lukeed/clsx)
- [Font Awesome](https://fontawesome.com/)

---

## Get Started

To get started with working on the project first you have to install its
dependencies:

```bash
npm install
```

Then you will have the following commands available:

### `npm run dev`

This starts the project with a local server for development. Typically this will
be on [`http://localhost:1234/`](http://localhost:1234/), but this
[can be adjusted](https://github.com/TobitSoftware/chayns-toolkit#development-options).

### `npm run build:test`

This tests and builds your project for production.

### `npm run build`

This builds your project without testing.

> If you want to analyze your bundle size you can do so by passing the `-a` flag
> to this command.

### `npm run test`

This tests your project.

### `npm run lint`

Checks your project for errors and code quality.

### `npm run format`

Automatically formats all of the source code in your project.

---

This project is based on
[`chayns-toolkit`](https://github.com/TobitSoftware/chayns-toolkit). If you
encounter any issues with the toolchain and the commands, please
[open an issue](https://github.com/TobitSoftware/chayns-toolkit/issues/new).
