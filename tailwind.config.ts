import { Config } from 'tailwindcss';

import sharedConfig from './src/lib/styles/tailwind.config.cjs';

const config: Config = {
	presets: [sharedConfig],
	content: sharedConfig.content
};

export default config;
