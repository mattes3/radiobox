import { None, Some, type Option } from 'ts-results-es';
import type { RadioStation } from './radiotypes';

const SUPPORTED_MIME_TYPES = ['video/mp4', 'audio/x-mpegurl', 'application/x-mpegurl'];

type RadioStationWithoutId = Omit<RadioStation, 'id'>;

const radioStations: RadioStationWithoutId[] = [
    { name: 'BR24', streamUrl: 'http://dispatcher.rndfnk.com/br/br24/live/mp3/mid' },
    {
        name: 'BR24 Live',
        streamUrl: 'http://dispatcher.rndfnk.com/br/br24live/live/mp3/mid',
    },
    {
        name: 'BR Klassik',
        streamUrl: 'https://dispatcher.rndfnk.com/br/brklassik/live/mp3/mid',
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
