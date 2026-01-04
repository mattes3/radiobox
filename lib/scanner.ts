import { None, Some, type Option } from 'ts-results-es';
import type { RadioStation } from './radiotypes';

type RadioStationWithoutId = Omit<RadioStation, 'id'>;

const radioStations: RadioStationWithoutId[] = [
    {
        name: 'Bayern 1',
        streamUrl: 'http://streams.br.de/bayern1obb_2.m3u',
    },
    {
        name: 'Bayern 2',
        streamUrl: 'http://streams.br.de/bayern2_2.m3u',
    },
    {
        name: 'Bayern 3',
        streamUrl: 'http://streams.br.de/bayern3_2.m3u',
    },
    {
        name: 'BR-Klassik',
        streamUrl: 'https://dispatcher.rndfnk.com/br/brklassik/live/mp3/high',
    },
    {
        name: 'BR Puls',
        streamUrl: 'http://streams.br.de/puls_2.m3u',
    },
    {
        name: 'SWR 1',
        streamUrl: 'http://liveradio.swr.de/sw282p3/swr1bw/play.m3u',
    },
    {
        name: 'SWR Kultur',
        streamUrl: 'http://liveradio.swr.de/sw282p3/swr2/play.m3u',
    },
    {
        name: 'SWR 3',
        streamUrl: 'http://liveradio.swr.de/sw282p3/swr3/play.m3u',
    },
    {
        name: 'SWR 4',
        streamUrl: 'http://liveradio.swr.de/sw282p3/swr4bw/play.m3u',
    },
    {
        name: 'WDR 2',
        streamUrl: 'http://www.wdr.de/wdrlive/media/wdr2.m3u',
    },
    {
        name: 'WDR 3',
        streamUrl: 'http://www.wdr.de/wdrlive/media/wdr3_hq.m3u',
    },
    {
        name: 'WDR 4',
        streamUrl: 'http://www.wdr.de/wdrlive/media/wdr4.m3u',
    },
    {
        name: 'WDR 5',
        streamUrl: 'http://www.wdr.de/wdrlive/media/wdr5.m3u',
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
