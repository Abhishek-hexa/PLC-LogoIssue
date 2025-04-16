import * as log from 'loglevel';

log.setLevel(import.meta.env.VITE_LOG_LEVEL);
const logger = log;

export { logger };
