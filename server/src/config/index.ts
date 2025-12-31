import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

const configFileNameObj = {
  development: 'dev',
  test: 'test',
  production: 'prod',
};

const env = process.env.NODE_ENV || 'development';

console.log('Current Env:', env);

export default () => {
  const configPath = join(__dirname, `./${configFileNameObj[env]}.yml`);
  let configContent = readFileSync(configPath, 'utf8');

  // Replace ${VAR} with process.env.VAR
  configContent = configContent.replace(/\$\{(\w+)\}/g, (_, key) => {
    const value = process.env[key];
    // If the environment variable is missing, you might want to leave it or throw an error
    // Here we return the original string if missing, or empty string, or handle it.
    // However, if we return undefined, it might break the replacement string.
    // Let's assume if it's not in env, we keep the placeholder or replace with empty string.
    // Better practice: Use empty string if not found, or keep original?
    // If we keep original: return '${' + key + '}';
    // But usually we want to inject.
    return value !== undefined ? value : '';
  });

  return yaml.load(configContent) as Record<string, any>;
};
