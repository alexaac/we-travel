import { showErrors, postData, getEnvData, setActions } from './js/app';

import './styles/main.scss';

// load svg images for brand
import icon from './media/icon.ico';
import brandi from './media/wemotoicon.svg';
import brandw from './media/wemoto_white.svg';
import brandb from './media/wemoto_black.svg';
import face from './media/facebook.svg';
import gith from './media/github.svg';
import linked from './media/linkedin.svg';
import twitt from './media/twitter.svg';

export { showErrors, postData, getEnvData, setActions };

window.showErrors = showErrors;
window.postData = postData;
window.getEnvData = getEnvData;
window.setActions = setActions;
