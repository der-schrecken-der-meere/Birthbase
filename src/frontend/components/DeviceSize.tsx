import { MediaScreenEntry } from '@/globals/constants/media_screens';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setScreen } from '../store/mediaType/mediaTypeSlice';

type mediaQuery = {
    mq: MediaQueryList,
    fn: (e: MediaQueryListEvent) => void,
}

interface I_DeviceSize {
    mediaScreens: readonly MediaScreenEntry[]
}

const DeviceSize = ({
    mediaScreens,
}: I_DeviceSize) => {
    const dispatch = useDispatch();

    useEffect(() => {
        const arr: mediaQuery[] = Array.from(mediaScreens).map(screen => {
            // Creates the mediaQuery
            const mq = () => {
                let str = "";
                for (const [key, value] of Object.entries(screen.mediaQuery)) {
                    let substr = `(${key}: ${value}px)`;
                    if (str[str.length - 1] === ")") {
                        str = str.concat(` and ${substr}`);
                    } else {
                        str = substr;
                    }
                }
                return str;
            }
            return {
                fn: (e) => {
                    if (e.matches) dispatch(setScreen(screen.name));
                },
                mq: window.matchMedia(mq()),
            }
        });

        arr.forEach(e => {
            e.mq.addEventListener("change", e.fn);
            if (e.mq.matches) e.fn({matches: true} as MediaQueryListEvent);
        })

        return () => {
            arr.forEach(e => {
                e.mq.removeEventListener("change", e.fn);
            })
        }
    }, []);

    return (<></>);
}

export default DeviceSize