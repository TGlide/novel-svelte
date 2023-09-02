import { Config } from 'tailwindcss';

import sharedConfig from './src/lib/styles/tailwind.config.cjs';
import plugin from 'tailwindcss/plugin';

const config: Config = {
	presets: [sharedConfig],
	content: sharedConfig.content,
	plugins: [
		plugin(function ({ addVariant, matchUtilities, theme }) {
			addVariant('hocus', ['&:hover', '&:focus']);
			// Square utility
			matchUtilities(
				{
					square: (value) => ({
						width: value,
						height: value
					})
				},
				{ values: theme('spacing') }
			);
		})
	]
};

export default config;
