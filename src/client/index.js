import { showErrors, postData, getEnvData, setActions } from './js/app';

import './styles/trip.scss';
import './styles/buttons.scss';
import './styles/colors.scss';
import './styles/base.scss';
import './styles/footer.scss';
import './styles/form.scss';
import './styles/header.scss';

export { showErrors, postData, getEnvData, setActions };

window.showErrors = showErrors;
window.postData = postData;
window.getEnvData = getEnvData;
window.setActions = setActions;
