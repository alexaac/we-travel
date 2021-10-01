/**
 * @description POST data to API
 * @param {string} url - url to analyze
 * @param {object} data - parameters
 */
const postData = async (url = '', data = {}) => {
  const res = await fetch(url, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  try {
    const newData = await res.json();

    if (newData.errors) {
      showErrors(newData.errors);
    }

    return newData;
  } catch (error) {
    console.error('error', error);
  }
};

/**
 * @description GET data from API
 * @param {string} baseUrl - url to analyze
 * @param {object} params - parameters
 */
const getData = async (baseUrl = '', params = {}) => {
  console.log(baseUrl);
  console.log(params);

  try {
    const queryString = Object.keys(params)
      .map((key) => `${key}=${params[key]}`)
      .join('&');
    const url = `${baseUrl}&${queryString}`;

    const res = await fetch(url);
    const data = await res.json();

    console.log(data);
    return data;
  } catch (error) {
    console.error('error', error);
  }
};

export { postData, getData };
