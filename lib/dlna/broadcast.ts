import dgram from 'dgram';
import {
    SSDP_ADDRESS,
    SSDP_PORT,
    DLNA_DEVICE_TYPE,
    SERVER_NAME,
    SERVER_URL,
    DLNA_SERVICE_TYPE,
} from './config';
import { getLocalIP } from '../utils/common';
import { getOrCreateUUID } from './utils';

export async function startSSDPBroadcast() {
    const socket = dgram.createSocket({ type: 'udp4', reuseAddr: true });

    socket.on('listening', () => {
        socket.addMembership(SSDP_ADDRESS);
        console.log('SSDP listener started');
        sendNotify(); // initial notify
        setInterval(sendNotify, 30000); // repeat every 30 seconds (standard interval)
    });

    socket.on('message', (msg, rinfo) => {
        console.log('Received SSDP message:', msg.toString());
        const message = msg.toString();
        if (message.includes('M-SEARCH') && message.includes('ssdp:discover')) {
            if (
                message.includes('urn:schemas-upnp-org:device:MediaServer:1') ||
                message.includes('ssdp:all') ||
                message.includes('upnp:rootdevice')
            ) {
                respondToSearch(rinfo.address, rinfo.port);
            }
        }
    });

    /*
NT: upnp:rootdevice
USN: uuid:592a69a6-ad0c-44ce-b84c-4548e6a4dc6d::upnp:rootdevice

NT: uuid:592a69a6-ad0c-44ce-b84c-4548e6a4dc6d
USN: uuid:592a69a6-ad0c-44ce-b84c-4548e6a4dc6d

NT: urn:schemas-upnp-org:device:MediaServer:1
USN: uuid:592a69a6-ad0c-44ce-b84c-4548e6a4dc6d::urn:schemas-upnp-org:device:MediaServer:1

NT: urn:schemas-upnp-org:service:ContentDirectory:1
USN: uuid:592a69a6-ad0c-44ce-b84c-4548e6a4dc6d::urn:schemas-upnp-org:service:ContentDirectory:1
*/

    function sendNotify() {
        function internalSend(uuid: string, nt: string | null) {
            const notifyMessage = [
                'NOTIFY * HTTP/1.1',
                `HOST: ${SSDP_ADDRESS}:${SSDP_PORT}`,
                `NT: ${nt ?? uuid}`,
                'NTS: ssdp:alive',
                `USN: ${uuid}${nt != null ? `::${nt}` : ''}`,
                'CACHE-CONTROL: max-age=1800',
                `LOCATION: ${SERVER_URL}/description.xml`,
                '',
                '',
            ].join('\r\n');

            socket.send(notifyMessage, SSDP_PORT, SSDP_ADDRESS);
            console.log('Sent SSDP NOTIFY', { uuid, nt });
        }

        const uuid = getOrCreateUUID();
        internalSend(uuid, 'upnp:rootdevice');
        internalSend(uuid, null);
        internalSend(uuid, DLNA_DEVICE_TYPE);
        internalSend(uuid, DLNA_SERVICE_TYPE);
    }

    function respondToSearch(address: string, port: number) {
        const localIP = getLocalIP();
        const response = [
            'HTTP/1.1 200 OK',
            `CACHE-CONTROL: max-age=1800`,
            `DATE: ${new Date().toUTCString()}`,
            `EXT:`,
            `LOCATION: ${SERVER_URL}/description.xml`,
            `SERVER: Linux/6.8 UPnP/1.0 ${SERVER_NAME}`,
            `ST: ${DLNA_DEVICE_TYPE}`,
            `USN: ${getOrCreateUUID()}::${DLNA_DEVICE_TYPE}`,
            '',
            '',
        ].join('\r\n');

        socket.send(response, port, address);
        console.log(`Sent SSDP response to ${address}:${port}`);
    }

    socket.bind(SSDP_PORT);
}
