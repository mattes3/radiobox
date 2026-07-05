import { describe, it, expect } from 'bun:test';
import { wrapStreamUrl } from '../lib/dlna/wrapStreamUrl';
import { SERVER_URL } from '../lib/dlna/config';

describe('wrapStreamUrl', () => {
    it('should wrap the URL into a proxy URL for an M3U', () => {
        const url = 'http://dispatcher.rndfnk.com/br/br1/obb/mp3/mid';
        const result = wrapStreamUrl(url);
        const expected = `${SERVER_URL}/station.m3u?originalStreamUrl=${encodeURIComponent(url)}`;
        expect(result).toEqual(expected);
    });
});
