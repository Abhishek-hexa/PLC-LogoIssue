TO run the server
### `npm run dev`

To create a build
### `npm run build`

To fix prettier issue
### `npx prettier --write .`

This command will allow you to fix styling errors in all modules like indentation issue or any other rules defined in .prettierrc module.
Please visit those rules to avoid any unnecessary error.

You can check eslint rules in .eslintrc.cjs modules
To learn more about eslint pleas refer this url https://eslint.org/docs/latest/rules/

To log the value please use following method, you can import logger module from utils
    import { logger } from './utils/Logger.jsx'; 
    logger.log('index');
    logger.warn('index warn');
    logger.error('index error');
