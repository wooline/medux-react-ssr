import {ModelHandlers, initModelState} from './model';

import Main from './views/Main';
import {exportModule} from '@medux/react';

export default exportModule('app', initModelState, ModelHandlers, {Main});
