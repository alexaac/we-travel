import { showErrors, postData, getEnvData, setActions } from './js/app';

import './styles/main.scss';

// load svg images for brand
import icon from './media/icon.ico';
import brand from './media/wemoto.svg';

export { showErrors, postData, getEnvData, setActions };

window.showErrors = showErrors;
window.postData = postData;
window.getEnvData = getEnvData;
window.setActions = setActions;
