import {ModelHandlers, initModelState} from './model';

import Details from './views/Details';
import List from './views/List';
import {exportModule} from '@medux/react-web-router';

export default exportModule('videos', initModelState, ModelHandlers, {Details, List});
