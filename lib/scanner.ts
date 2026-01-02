import { None, Some, type Option } from 'ts-results-es';
import type { RadioStation } from './radiotypes';

const SUPPORTED_MIME_TYPES = ['video/mp4', 'audio/x-mpegurl', 'application/x-mpegurl'];

type RadioStationWithoutId = Omit<RadioStation, 'id'>;

const radioStations: RadioStationWithoutId[] = [
    {
        name: 'Bayern 1',
        streamUrl: 'https://dispatcher.rndfnk.com/br/br1/obb/mp3/mid',
    },
    {
        name: 'Bayern 2',
        streamUrl: 'https://dispatcher.rndfnk.com/br/br2/live/mp3/mid',
    },
    {
        name: 'Bayern 3',
        streamUrl: 'https://dispatcher.rndfnk.com/br/br3/live/mp3/mid',
    },
    {
        name: 'BR Puls',
        streamUrl: 'https://dispatcher.rndfnk.com/br/puls/live/mp3/mid',
    },
    {
        name: 'WDR 1LIVE',
        streamUrl: 'https://wdr-1live-live.icecastssl.wdr.de/wdr/1live/live/mp3/128/stream.mp3',
    },
    {
        name: 'WDR 2',
        streamUrl:
            'https://wdr-wdr2-rheinland.icecastssl.wdr.de/wdr/wdr2/rheinland/mp3/128/stream.mp3',
    },
    {
        name: 'WDR 3',
        streamUrl: 'https://wdr-wdr3-live.icecastssl.wdr.de/wdr/wdr3/live/mp3/256/stream.mp3',
    },
    {
        name: 'WDR 4',
        streamUrl: 'https://wdr-wdr4-live.icecastssl.wdr.de/wdr/wdr4/live/mp3/128/stream.mp3',
    },
    {
        name: 'WDR 5',
        streamUrl: 'https://wdr-wdr5-live.icecastssl.wdr.de/wdr/wdr5/live/mp3/128/stream.mp3',
    },
    {
        name: 'Radio Bonn-Rhein-Sieg',
        streamUrl: 'https://stream.lokalradio.nrw/444z6zk',
    },
];

function slugify(input: string): string {
    return input
        .normalize('NFKD') // split accented characters
        .replace(/[\u0300-\u036f]/g, '') // remove diacritics
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-') // replace non-alphanumerics with -
        .replace(/^-+|-+$/g, '') // trim leading/trailing -
        .replace(/-{2,}/g, '-'); // collapse multiple -
}

export function allStations(): RadioStation[] {
    return radioStations.map((station) => ({ ...station, id: slugify(station.name) }));
}

export function findStation(id: string): Option<RadioStation> {
    const station = allStations().find((s) => s.id === id);
    return station ? Some(station) : None;
}

export function getM3U(station: RadioStation): string {
    return `#EXTM3U\n#EXTINF:-1, ${station.name}\n${station.streamUrl}`;
}
