# Novel Svelte

Based on [Novel](https://github.com/steven-tey/novel)

A Notion-style WYSIWYG editor built with Svelte and Tiptap. This project provides a rich text editor with a variety of features including formatting text, adding links and images, creating lists and tasks, and configuring placeholder text. The editor also includes a bubble menu for text formatting, a popover menu for node selection, and a dropdown menu for color selection. The project also includes a serverless function that uses the OpenAI API to generate text based on user prompts.

## TODO:

- [x] Slash Menus
- [x] Rate Limiting/Provide OpenAPI key on demo (feature flag?)
- [x] Theme control in demo
- [x] Bubble Menu
- [x] Toasts
- [ ] Image upload support (using Appwrite)
- [ ] Improve Readme
- [ ] Properly test out package


## Technologies and Frameworks

This project uses a variety of technologies and frameworks, including:

- **Svelte**: A modern framework for building user interfaces.
- **Tiptap**: A headless, framework-agnostic text editor.
- **Vite**: A build tool that provides a faster and leaner development experience.
- **Tailwind CSS**: A utility-first CSS framework for rapidly building custom designs.
- **Playwright**: A Node.js library for automating browser tasks.
- **ESLint**: A tool for identifying and reporting on patterns in JavaScript.
- **Prettier**: An opinionated code formatter.
- **PostCSS**: A tool for transforming CSS with JavaScript.
- **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript.
- **OpenAI API**: An API for generating text based on user prompts.
# Installation

Follow these steps to install and setup the project:

1. Ensure that you have Node.js and npm installed on your machine. If not, you can download and install them from [here](https://nodejs.org/en/download/).

2. Clone the repository to your local machine using the following command:

```bash
git clone https://github.com/TGlide/novel-svelte.git
```

3. Navigate to the project directory:

```bash
cd novel-svelte
```

4. Install the required npm packages:

```bash
npm install
```

5. Ensure that you have a .env file with the OPENAI_API_KEY, NODE_ENV, KV_REST_API_URL, and KV_REST_API_TOKEN variables set. If not, create a .env file in your project root and add these variables.

6. Now, you should be able to start the project using the following command:

```bash
npm run dev
```

This will start the development server. You can now open your browser and navigate to `http://localhost:5173/` to view the project.
