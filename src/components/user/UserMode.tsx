/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { FC, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
// @ts-ignore
import { SmallWaitCursor } from 'chayns-components';
import Map from '../map/Map';
import { selectMapsFetchState, selectSelectedMap } from '../../redux-modules/map/selectors';
import { FetchState } from '../../types/fetch';
import UserModeButtons from '../map/user-mode-buttons/UserModeButtons';
import { selectDestinationFetchState } from '../../redux-modules/destination/selectors';
import logger from '../../utils/logger';

const UserMode: FC<{
    measurePerformanceMetrics: boolean,
}> = ({
    measurePerformanceMetrics,
}) => {
    const selectedMap = useSelector(selectSelectedMap);

    const mapFetchState = useSelector(selectMapsFetchState);
    const destinationFetchState = useSelector(selectDestinationFetchState);

    const [firstContentfulPaint, setFirstContentfulPaint] = useState<number>();
    const [firstInputDelay, setFirstInputDelay] = useState<number>();
    const [firstInputStartTime, setFirstInputStartTime] = useState<number>();
    const [pageLoadTime, setPageLoadTime] = useState<number>();
    const totalBlockingTime = useRef<number>();

    useEffect(() => {
        new PerformanceObserver((entryList) => {
            const entry = entryList.getEntriesByName('first-contentful-paint')[0];
            setFirstContentfulPaint((prev) => prev || entry.startTime);
        }).observe({ type: 'paint', buffered: true });

        new PerformanceObserver((entryList) => {
            const entry = entryList.getEntries()[0] as unknown as { processingStart: number, startTime: number };
            setFirstInputDelay((prev) => prev || entry.processingStart - entry.startTime);
            setFirstInputStartTime((prev) => prev || entry.startTime);
        }).observe({ type: 'first-input', buffered: true });

        new PerformanceObserver((entryList) => {
            const entry = entryList.getEntriesByType('navigation')[0]
            setPageLoadTime((prev) => prev || entry.duration);
        }).observe({ type: 'navigation', buffered: true });

        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach((entry) => {
                console.log('entry', entry.duration, entry);
                totalBlockingTime.current = (totalBlockingTime.current || 0) + entry.duration - 50;
            });
        }).observe({ type: 'longtask', buffered: true });
    }, []);

    useEffect(() => {
        if (measurePerformanceMetrics && firstContentfulPaint) {
            logger.info({
                message: 'FirstContentfulPaint',
                customNumber: firstContentfulPaint,
            });
        }
    }, [firstContentfulPaint]);
    useEffect(() => {
        if (measurePerformanceMetrics && firstInputDelay) {
            logger.info({
                message: 'FirstInputDelay',
                customNumber: firstInputDelay,
            });
        }
    }, [firstInputDelay]);
    // useEffect(() => {
    //     if (measurePerformanceMetrics && firstInputStartTime) {
    //         console.log('TEST firstInputStartTime', firstInputStartTime);
    //     }
    // }, [firstInputStartTime]);
    useEffect(() => {
        if (measurePerformanceMetrics && pageLoadTime) {
            logger.info({
                message: 'PageLoadTime',
                customNumber: pageLoadTime,
            });
        }
    }, [pageLoadTime]);
    useEffect(() => {
        const conditions = [FetchState.fulfilled, FetchState.rejected];
        if (conditions.includes(mapFetchState) && conditions.includes(destinationFetchState) && totalBlockingTime.current !== undefined) {
            setTimeout(() => {
                logger.info({
                    message: 'TotalBlockingTime',
                    customNumber: totalBlockingTime.current,
                });
            }, 1000);
        }
    }, [mapFetchState, destinationFetchState]);

    return (
        <div>
            <UserModeButtons/>
            {mapFetchState === FetchState.pending && (
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100vh',
                        width: '100%'
                    }}
                >
                    <SmallWaitCursor show/>
                </div>
            )}
            {selectedMap && <Map mapId={selectedMap}/>}
        </div>
    );
};

export default UserMode;
