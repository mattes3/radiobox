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
        name: 'BBC World Service',
        streamUrl: 'http://stream.live.vc.bbcmedia.co.uk/bbc_world_service',
    },
    {
        name: 'HR 1',
        streamUrl: 'http://dispatcher.rndfnk.com/hr/hr1/live/mp3/high',
    },
    {
        name: 'HR 2',
        streamUrl: 'http://dispatcher.rndfnk.com/hr/hr2/live/mp3/high',
    },
    {
        name: 'HR 3',
        streamUrl: 'http://dispatcher.rndfnk.com/hr/hr3/live/mp3/high',
    },
    {
        name: 'HR 4',
        streamUrl: 'http://dispatcher.rndfnk.com/hr/hr4/rheinmain/high',
    },
    {
        name: 'MDR Aktuell',
        streamUrl: 'http://mdr-284340-0.cast.mdr.de/mdr/284340/0/mp3/high/stream.mp3',
    },
    {
        name: 'MDR Sachsen',
        streamUrl: 'http://mdr-990100-0.cast.mdr.de/mdr/990100/0/mp3/high/stream.mp3',
    },
    {
        name: 'MDR Sachsen-Anhalt',
        streamUrl: 'http://mdr-284290-0.cast.mdr.de/mdr/284290/0/mp3/high/stream.mp3',
    },
    {
        name: 'MDR Thueringen',
        streamUrl: 'http://mdr-284300-0.cast.mdr.de/mdr/284300/0/mp3/high/stream.mp3',
    },
    {
        name: 'NDR 1',
        streamUrl: 'http://icecast.ndr.de/ndr/ndr1niedersachsen/oldenburg/mp3/128/stream.mp3',
    },
    {
        name: 'NDR 2',
        streamUrl: 'http://icecast.ndr.de/ndr/ndr2/hamburg/mp3/128/stream.mp3',
    },
    {
        name: 'NDR Kultur',
        streamUrl: 'http://icecast.ndr.de/ndr/ndrkultur/live/mp3/128/stream.mp3',
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
