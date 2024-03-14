<div align="center">
    <h1>bot-control-3d</h1>
    <p>An application that can be used to supervise service-robots</p>
    <a href="https://github.com/TobitSoftware/chayns-toolkit">
        <img 
            alt="Managed with chayns-toolkit" 
            src="https://img.shields.io/badge/managed%20with-chayns--toolkit-%23000?style=for-the-badge"
        />
    </a>
</div>

---

<b>Important</b>: This is a Prototype!

This application can be used to monitor, control and configure service robots. The service robots need to be integrated in the BotControlBackend by Tobit Labs.

![Screenshot of the Prototype](resources/Screenshot%20Uebersicht.png)

This application also offers a 3D view of a buildings floors. This 3D View can be edited via drag and drop. The 3D (glTF) Models were created, using the [Scaniverse App](https://scaniverse.com/).

![Video that shows dragging of models](resources/Animation.gif)

---

## Usage of Prototype

The prototype can be viewed [here](https://lptest.chayns.site/). Note that you need a chayns account to view the prototype.

You can also use the prototype on your chayns site by integrating the build (https://lepult.github.io/BotControl3D-Prototype/) like [this](https://github.com/TobitSoftware/create-chayns-app?tab=readme-ov-file#developing-a-custom-page).

<b>Important</b>: You won't be able to control the robots!

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
