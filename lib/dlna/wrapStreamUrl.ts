import { SERVER_URL } from './config';

export function wrapStreamUrl(streamUrl: string): string {
    const url = new URL('station.m3u', SERVER_URL);
    url.searchParams.append('originalStreamUrl', streamUrl);
    return url.toString();
}
