import {
  getLocationData,
  getPhotoData,
  getWeatherData,
  getLastTripBundle,
} from '../src/client/js/data.js';

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

describe('Testing the getLastTripBundle functionality', () => {
  test('Testing the getLocationData() function', async () => {
    const inputs = [
      {
        input: 'dummy gf fdfd',
        fetchResult: {
          totalResultsCount: 0,
          geonames: [],
        },
        result: `Couldn't find any city with this name`,
      },
    ];

    global.fetch = jest
      .fn()
      .mockImplementation(setupFetchStub(inputs[0].fetchResult));

    await expect(getLocationData(inputs[0].input)).rejects.toThrow(
      inputs[0].result
    );

    expect(fetch).toHaveBeenCalledTimes(1);
    global.fetch.mockClear();
    delete global.fetch;
  });
  test('Testing the getPhotoData() function', async () => {
    const inputs = [
      {
        input: 'dummy gf fdfd',
        fetchResult: {
          total: 0,
          totalHits: 0,
          hits: [],
        },
        result: `Couldn't find any photo for this city or country.`,
      },
    ];

    global.fetch = jest
      .fn()
      .mockImplementation(setupFetchStub(inputs[0].fetchResult));

    await expect(getPhotoData(inputs[0].input)).rejects.toThrow(
      inputs[0].result
    );

    expect(fetch).toHaveBeenCalledTimes(1);
    global.fetch.mockClear();
    delete global.fetch;
  });
  test('Testing the getWeatherData() function', async () => {
    const inputs = [
      {
        input: 'dummy gf fdfd',
        fetchResult: {
          error: 'Invalid lat/lon supplied.',
        },
        result: `Invalid lat/lon supplied.`,
      },
    ];

    global.fetch = jest
      .fn()
      .mockImplementation(setupFetchStub(inputs[0].fetchResult));

    await expect(getWeatherData(inputs[0].input)).rejects.toThrow(
      inputs[0].result
    );

    expect(fetch).toHaveBeenCalledTimes(1);
    global.fetch.mockClear();
    delete global.fetch;
  });
  test('Testing the getLastTripBundle() function', async () => {
    const inputs = [
      {
        input: 'dummy gf fdfd',
        fetchResult: {
          totalResultsCount: 0,
          geonames: [],
        },
        result: `Couldn't find any city with this name`,
      },
    ];

    global.fetch = jest
      .fn()
      .mockImplementation(setupFetchStub(inputs[0].fetchResult));

    await expect(getLastTripBundle(inputs[0].input)).rejects.toThrow(
      inputs[0].result
    );

    expect(fetch).toHaveBeenCalledTimes(1);
    global.fetch.mockClear();
    delete global.fetch;
  });
});
