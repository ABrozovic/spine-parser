# Spine Parser

Spine Parser is a Next.js application that provides various features for working with Spine animations. It allows you to preview spine animations in your browser, convert .skel files to JSON format, and load spine animations from the Langrisser mobile game.

## Features

1. PixiJS Spine Previewer
   - Load and preview spine animations in your browser.
   - Supports spine versions from 3.7 to 4.1.
   - **Note**: There is a known bug in PixiJS Spine for spine versions 3.7 and 3.8, which may cause some bones to behave incorrectly.

2. .skel Converter (3.3-3.4 to 3.8 JSON)
   - Convert .skel files from spine versions 3.3-3.4 to the 3.8 JSON format.
   - Attempts to generate a 3.8 JSON file from the .skel file.
   - **Note**: There might be some bugs or cases where the conversion fails.
   - **TODO**: Handle EventTimeline and DrawOrderTimeline.

3. Langrisser Mobile Animation Loader
   - Load spine animations from the Langrisser mobile game.
   - Preview the loaded animations.

## Prerequisites

- Node.js (version X.X.X)
- npm (version X.X.X)

## Getting Started

1. Clone the repository:

   ```shell
   git clone https://github.com/ABrozovic/spine-parser.git
   ```

2. Navigate to the project directory:

   ```shell
   cd spine-parser
   ```

3. Install the dependencies:

   ```shell
   npm install
   ```

4. Start the application:

   ```shell
   npm run dev
   ```

5. Open your browser and visit [http://localhost:3000](http://localhost:3000) to access Spine Parser.

## License

This project is licensed under the [MIT License](LICENSE).