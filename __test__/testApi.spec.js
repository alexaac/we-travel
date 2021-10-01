// Import the js file to test
import { postData, getData } from '../src/client/js/api';
import { getDataForUrl } from './mockData.js';

function FormDataMock() {
  this.append = jest.fn();
}

global.FormData = FormDataMock;

// https://jaketrent.com/post/mock-fetch-jest-test
function setupFetchStub(data) {
  return function fetchStub(_url) {
    return new Promise((resolve) => {
      resolve({
        json: () =>
          Promise.resolve({
            data,
          }),
      });
    });
  };
}

// The describe() function takes two arguments - a string description, and a test suite as a callback function.
// A test suite may contain one or more related tests
describe('Testing the API functionality', () => {
  // The test() function has two arguments - a string description, and an actual test as a callback function.
  test('Testing the getData() function', () => {
    // Define the input for the function, if any, in the form of variables/array
    // Define the expected output, if any, in the form of variables/array
    // The expect() function, in combination with a Jest matcher, is used to check if the function produces the expected output
    // The general syntax is `expect(myFunction(arg1, arg2, ...)).toEqual(expectedValue);`, where `toEqual()` is a matcher
    expect(getData).toBeDefined();
  });

  const dataForUrl = getDataForUrl();

  dataForUrl.forEach((myTest) => {
    test(
      (myTest.response &&
        myTest.response.status &&
        myTest.response.status.message) ||
        (myTest.response && myTest.response.message) ||
        myTest.testName,
      async () => {
        global.fetch = jest
          .fn()
          .mockImplementation(setupFetchStub(myTest.response));

        const data = await getData(myTest.baseUrl, myTest.params);

        expect(data).toEqual({ data: myTest.response });
        expect(fetch).toHaveBeenCalledTimes(1);

        global.fetch.mockClear();
        delete global.fetch;
      }
    );
  });
});
