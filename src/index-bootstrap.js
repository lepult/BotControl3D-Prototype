import React from 'react';
import ReactDOM from 'react-dom';
import AppWrapper from './components/AppWrapper';

console.time('Test');
console.log('LEEEEL');

let pageLoad = 0; // Time until the iframe loaded

// Ideally under 1.8 sec; Should be under 3 sec.
let firstContentfulPaint = 0; // time until FCP

// Ideally under 2.5 sec; Should be under 4 sec.
let largestContentfulPaint = 0; // Time until 3D Models loaded

// Ideally under 0.1 sec; Should be under 0.3 sec.
let firstInputDelay = 0; // FID
let firstInputStartTime = 0;

// TODO Stop measuring when switching to other floor or when
// Ideally under 0.2 sec.
let totalBlockingTime = 0; // TBT

new PerformanceObserver((entryList) => {
    const entry = entryList.getEntriesByName('first-contentful-paint')[0]
    firstContentfulPaint = entry.startTime;
    console.log('FCP:', firstContentfulPaint);
}).observe({ type: 'paint', buffered: true });

new PerformanceObserver((entryList) => {
    const entry = entryList.getEntries()[0];
    firstInputDelay = entry.processingStart - entry.startTime;
    firstInputStartTime = entry.startTime;
    console.log('FID:', firstInputDelay, firstInputStartTime);
}).observe({ type: 'first-input', buffered: true });

new PerformanceObserver((entryList) => {
    const entry = entryList.getEntriesByType('navigation')[0]
    pageLoad = entry.duration;
    console.log('pageload time: ', pageLoad);
}).observe({ type: 'navigation', buffered: true });

var observer = new PerformanceObserver(function (list) {
    let perfEntries = list.getEntries();
    for (const perfEntry of perfEntries) {
        totalBlockingTime += perfEntry.duration - 50;
    }
    console.log({ totalBlockingTime });
});
observer.observe({ type: "longtask", buffered: true });
chayns.ready
    .then(async () => {
        try {
            console.log('RENDER');
            console.timeEnd('Test');
            ReactDOM.render(<AppWrapper/>, document.querySelector('#root'));
        } catch (e) {
            console.error('Encountered error at `ReactDOM.render`: ', e);
        }
    })
    .catch((error) => {
        console.warn('No chayns environment found.', error);
    });
