import { startSSDPBroadcast } from './lib/dlna/broadcast';
import { HTTP_PORT, SERVER_NAME } from './lib/dlna/config';
import {
    getBrowseResponseXml,
    getCdsXml,
    getDescriptionXml,
    getSearchCapabilitiesResponseXml,
    getSortCapabilitiesResponseXml,
} from './lib/dlna/xml-templates';
import { allStations } from './lib/scanner';

// Start SSDP broadcast
startSSDPBroadcast();

const mediaFiles = allStations();

function sendXml(xml: string) {
    return new Response(xml, {
        headers: { 'Content-Type': 'application/xml' },
    });
}

const server: ReturnType<typeof Bun.serve> = Bun.serve({
    port: HTTP_PORT,
    routes: {
        '/description.xml': {
            GET: (req): Response => {
                console.log(server.requestIP(req), 'HTTP GET ', req.url);
                return sendXml(getDescriptionXml());
            },
        },
        '/cds.xml': {
            GET: (req): Response => {
                console.log(server.requestIP(req), 'HTTP GET ', req.url);
                return sendXml(getCdsXml());
            },
        },
        '/cds-control': {
            POST: async (req): Promise<Response> => {
                const body = await req.text();
                console.log(server.requestIP(req), 'HTTP POST', req.url, body);
                if (body.includes('Browse')) {
                    const resultXML = getBrowseResponseXml(mediaFiles);
                    console.log('resultXml', resultXML);
                    return new Response(resultXML, {
                        headers: {
                            'Content-Type': 'text/xml; charset="utf-8"',
                            EXT: '',
                            Server: SERVER_NAME,
                            Connection: 'close',
                        },
                    });
                }

                if (body.includes('GetSearchCapabilities')) {
                    const resultXML = getSearchCapabilitiesResponseXml();
                    console.log('resultXml', resultXML);
                    return new Response(resultXML, {
                        headers: {
                            'Content-Type': 'text/xml; charset="utf-8"',
                            EXT: '',
                            Server: SERVER_NAME,
                            Connection: 'close',
                        },
                    });
                }

                if (body.includes('GetSortCapabilities')) {
                    const resultXML = getSortCapabilitiesResponseXml();
                    console.log('resultXml', resultXML);
                    return new Response(resultXML, {
                        headers: {
                            'Content-Type': 'text/xml; charset="utf-8"',
                            EXT: '',
                            Server: SERVER_NAME,
                            Connection: 'close',
                        },
                    });
                }

                return new Response('Invalid request', { status: 400 });
            },
        },
        '/station.m3u': {
            GET: (req): Response => {
                console.log(server.requestIP(req), 'HTTP GET ', req.url);
                const url = new URL(req.url, `http://localhost:${server.port}`);
                const originalStreamUrl = url.searchParams.get('originalStreamUrl');

                if (!originalStreamUrl) {
                    return new Response('Missing originalStreamUrl query parameter', {
                        status: 400,
                    });
                }

                const m3u: string = `#EXTM3U\n#EXTINF:-1,Stream\n${originalStreamUrl}\n`;
                return new Response(m3u, {
                    headers: { 'Content-Type': 'audio/x-mpegurl' },
                });
            },
        },
        '/*': {
            OPTIONS: (): Response => {
                const response = new Response(null, {
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                        'Access-Control-Allow-Headers': 'Content-Type, SOAPAction',
                    },
                });
                return response;
            },
        },
    },
});

console.log(`Server is running on http://localhost:${server.port}`);
