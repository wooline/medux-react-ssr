import {ModelHandlers, initModelState} from './model';

import Details from './views/Details';
import List from './views/List';
import Main from './views/Main';
import {exportModule} from '@medux/react';

export default exportModule('comments', initModelState, ModelHandlers, {Main, Details, List});
