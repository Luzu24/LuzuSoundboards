# LuzuSoundboards

A desktop soundboard application built with Electron, React, and TypeScript.

## Features

- Create and manage multiple soundboards
- Assign audio files to customizable buttons
- Select audio output device
- Save and load soundboards from `C:\Program Files\LuzuSoundboards\Soundboards\`

## Tech Stack

- [Electron](https://www.electronjs.org/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)

## Development

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS)
- [Git](https://git-scm.com/)

### Setup

```bash
git clone https://github.com/Luzu24/LuzuSoundboards.git
cd LuzuSoundboards
npm install
npm run dev
```

### Build

```bash
npm run electron:build
```

The installer will be generated in the `release/` folder.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.