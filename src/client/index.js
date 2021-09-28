import {
  getDate,
  showErrors,
  postData,
  getEnvData,
  setActions,
} from './js/app';

import './styles/style.scss';

export { getDate, showErrors, postData, getEnvData, setActions };

window.getDate = getDate;
window.showErrors = showErrors;
window.postData = postData;
window.getEnvData = getEnvData;
window.setActions = setActions;
