# J2ME-For-Web

> Run J2ME MIDlets in the browser with TypeScript and WebAssembly-free Java byte-code interpreter.

<!-- Badges -->

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Tests](https://img.shields.io/badge/tests-73%2F73-brightgreen)
![License](https://img.shields.io/badge/license-GPLv2-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)

---

## What it is

A hobby VM that boots real J2ME byte-code (CLDC 1.1 / MIDP 2.0 subset) inside modern browsers.

✨ **No plug-ins, no WebAssembly** – just a TypeScript interpreter, Canvas-based LCDUI and Web Audio.

---

## Current Status (2025-11-20)

| Component             | Status         | Details                                                     |
| --------------------- | -------------- | ----------------------------------------------------------- |
| **Class-file loader** | ✅ Complete    | CLDC 1.1 subset, constant pool, fields, methods, attributes |
| **Interpreter**       | ✅ Complete    | 73+ bytecode instructions, Generator-based execution        |
| **Threading**         | ✅ Complete    | Cooperative scheduler, Object.wait/notify/notifyAll         |
| **Native bridge**     | ✅ Complete    | JNI-style registry, System/Object native methods            |
| **Object model**      | ✅ Complete    | JavaObject, JavaArray, JavaString with GC integration       |
| **Reflection**        | ✅ Complete    | java.lang.Class, Object.getClass(), instanceof checks       |
| **Long math**         | ✅ Complete    | Native BigInt, 100× faster than ASM.js                      |
| **Arrays & Fields**   | ✅ Complete    | All primitive arrays, GETFIELD/PUTFIELD/GETSTATIC/PUTSTATIC |
| **Build & Test**      | ✅ Passing     | TypeScript compilation + unit tests all green               |
| **LCDUI Graphics**    | 🚧 In Progress | Display, Canvas, Graphics API (next milestone)              |

---

## Quick Start

### Prerequisites

- Node.js 12.20.55+
- npm or yarn
- Modern browser (Chrome, Firefox, Safari, Edge)

### Installation

```bash
# Clone the repository
git clone https://github.com/lingfeng11111/J2ME-For-Web
cd J2ME-For-Web

# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test
```

### Running MIDlets

1. Drop any CLDC 1.1 compatible MIDlet (JAR) into `/midlets`
2. Open `http://localhost:8080/?midlet=yourApp.jar` in a modern browser
3. Enjoy your J2ME game!

---

## Project Layout

```
src/
├─ vm-core/              # Core VM implementation
│  ├─ interpreter/       # Byte-code instruction set (73 instructions)
│  ├─ threading/         # Green threads & scheduler
│  ├─ native/            # JNI-style native method registry
│  └─ classfile/         # Class file parser & loader
└─ game-modules/         # J2ME API implementations (WIP)
    └─ stdlib/           # Standard library (java.lang, etc.)
```

### Key Features

- **Performance**: BigInt-based long math (100× faster than ASM.js)
- **Threading**: Cooperative green threads with Object.wait/notify
- **Extensible**: Easy-to-add native methods via registry pattern
- **Type-safe**: Full TypeScript implementation with strict typing

---

## Why?

Because flip-phone games deserve a second life in the browser tab.

---

## Acknowledgments & Inspiration

Thanks to [Mozilla's PluotSorbet](https://github.com/mozilla/pluotsorbet) for first proving that "running MIDlets in the browser without plugins" is possible, which sparked the initial inspiration for this project.

---

## Contributing

PRs & bug reports welcome – [open an issue](https://github.com/lingfeng11111/J2ME-For-Web/issues) or send a pull-request.

### Development Setup

```bash
# Fork and clone
git clone https://github.com/YOUR_USERNAME/J2ME-For-Web.git
cd J2ME-For-Web

# Install dependencies
npm install

# Start development
npm run build
npm test
```

---

## License

GPL v2 License - see [LICENSE](LICENSE) file for details.

---

<div align="center">

**Made with star for retro mobile gaming**

</div>
