import { None, Some, type Option } from 'ts-results-es';
import type { RadioStation } from './radiotypes';

type RadioStationWithoutId = Omit<RadioStation, 'id'>;

const radioStations: RadioStationWithoutId[] = [
    {
        name: 'Bayern 1',
        streamUrl: 'http://dispatcher.rndfnk.com/br/br1/obb/mp3/mid',
    },
    {
        name: 'Bayern 2',
        streamUrl: 'http://dispatcher.rndfnk.com/br/br2/live/mp3/mid',
    },
    {
        name: 'Bayern 3',
        streamUrl: 'http://dispatcher.rndfnk.com/br/br3/live/mp3/mid',
    },
    {
        name: 'BR-Klassik',
        streamUrl: 'http://dispatcher.rndfnk.com/br/brklassik/live/mp3/high',
    },
    {
        name: 'SWR 1',
        streamUrl: 'http://dispatcher.rndfnk.com/swr/swr1/bw/mp3/128/stream.mp3?aggregator=web',
    },
    {
        name: 'SWR Kultur',
        streamUrl: 'http://dispatcher.rndfnk.com/swr/swr2/live/mp3/256/stream.mp3?aggregator=web',
    },
    {
        name: 'SWR 3',
        streamUrl: 'http://dispatcher.rndfnk.com/swr/swr3/live/mp3/128/stream.mp3?aggregator=web',
    },
    {
        name: 'SWR 4',
        streamUrl: 'http://dispatcher.rndfnk.com/swr/swr4/bw/mp3/128/stream.mp3?aggregator=web',
    },
    {
        name: 'WDR 2',
        streamUrl:
            'http://wdr-wdr2-rheinland.icecast.wdr.de/wdr/wdr2/rheinland/mp3/128/stream.mp3?ar-distributor=ffa1',
    },
    {
        name: 'WDR 3',
        streamUrl:
            'http://wdr-wdr3-live.icecast.wdr.de/wdr/wdr3/live/mp3/256/stream.mp3?ar-distributor=ffa1',
    },
    {
        name: 'WDR 4',
        streamUrl:
            'http://wdr-wdr4-live.icecast.wdr.de/wdr/wdr4/live/mp3/128/stream.mp3?ar-distributor=ffa1',
    },
    {
        name: 'WDR 5',
        streamUrl:
            'http://wdr-wdr5-live.icecast.wdr.de/wdr/wdr5/live/mp3/128/stream.mp3?ar-distributor=ffa1',
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
