import path from 'path';
import { startSSDPBroadcast } from './lib/dlna/broadcast';
import { HTTP_PORT, SERVER_NAME, SERVER_URL } from './lib/dlna/config';
import { getBrowseResponseXml, getCdsXml, getDescriptionXml } from './lib/dlna/xml-templates';
import { allStations, findStation, getM3U } from './lib/scanner';

// Start SSDP broadcast
startSSDPBroadcast();

const mediaFiles = allStations();

function sendXml(xml: string) {
    return new Response(xml, {
        headers: { 'Content-Type': 'application/xml' },
    });
}

const server = Bun.serve({
    port: HTTP_PORT,
    routes: {
        '/description.xml': {
            GET: () => {
                return sendXml(getDescriptionXml());
            },
        },
        '/cds.xml': {
            GET: () => {
                return sendXml(getCdsXml());
            },
        },
        '/cds-control': {
            POST: async (req) => {
                const body = await req.text();
                if (body.includes('Browse')) {
                    const resultXML = getBrowseResponseXml(mediaFiles);
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
        '/media/*': {
            HEAD: (req) => {
                const stationId = decodeURIComponent(path.relative(`${SERVER_URL}/media`, req.url));
                const station = findStation(stationId);
                return station.isNone()
                    ? Response.json({ error: 'Station not found' }, { status: 404 })
                    : new Response(null, {
                          headers: {
                              'Content-Type': 'audio/x-mpegurl',
                              'Accept-Ranges': 'bytes',
                              'Content-Length': String(station.value.streamUrl.length),
                          },
                      });
            },
            GET: (req) => {
                const stationId = decodeURIComponent(path.relative(`${SERVER_URL}/media`, req.url));
                const station = findStation(stationId);
                if (station.isNone()) {
                    return Response.json({ error: 'Station not found' }, { status: 404 });
                }

                const m3uContents = getM3U(station.value);
                return new Response(m3uContents, {
                    headers: {
                        'Content-Type': 'audio/x-mpegurl',
                        'Content-Length': String(m3uContents.length),
                    },
                });
            },
        },
        '/*': {
            OPTIONS: () => {
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
