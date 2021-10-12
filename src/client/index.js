import { showErrors, postData, getEnvData, setActions } from './js/app';

import './styles/main.scss';

// load svg images for brand
// import icon from 'https://mps-ph.s3.us-east-2.amazonaws.com/we/media/icon.ico';
// import brandi from 'https://mps-ph.s3.us-east-2.amazonaws.com/we/media/wemotoicon.svg';
// import brandw from 'https://mps-ph.s3.us-east-2.amazonaws.com/we/media/wemoto_white.svg';
// import brandb from 'https://mps-ph.s3.us-east-2.amazonaws.com/we/media/wemoto_black.svg';
// import face from 'https://mps-ph.s3.us-east-2.amazonaws.com/we/media/facebook.svg';
// import gith from 'https://mps-ph.s3.us-east-2.amazonaws.com/we/media/github.svg';
// import linked from 'https://mps-ph.s3.us-east-2.amazonaws.com/we/media/linkedin.svg';
// import twitt from 'https://mps-ph.s3.us-east-2.amazonaws.com/we/media/twitter.svg';

export { showErrors, postData, getEnvData, setActions };

window.showErrors = showErrors;
window.postData = postData;
window.getEnvData = getEnvData;
window.setActions = setActions;
