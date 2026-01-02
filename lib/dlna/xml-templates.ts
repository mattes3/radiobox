import type { RadioStation } from '../radiotypes';
import {
    MANUFACTURER,
    MANUFACTURER_URL,
    SERVER_DESCRIPTION,
    SERVER_NAME,
    SERVER_URL,
} from './config';
import { getOrCreateUUID } from './utils';

export function getDescriptionXml() {
    return `
    <?xml version="1.0"?>
    <root xmlns="urn:schemas-upnp-org:device-1-0">
    <specVersion>
        <major>1</major>
        <minor>0</minor>
    </specVersion>
    <device>
        <deviceType>urn:schemas-upnp-org:device:MediaServer:1</deviceType>
        <friendlyName>${SERVER_NAME}</friendlyName>
        <manufacturer>${MANUFACTURER}</manufacturer>
        <manufacturerURL>${MANUFACTURER_URL}</manufacturerURL>
        <modelDescription>${SERVER_DESCRIPTION}</modelDescription>
        <modelName>DLNAServer</modelName>
        <modelNumber>1.0</modelNumber>
        <serialNumber>DLNAServer001</serialNumber>
        <UDN>${getOrCreateUUID()}</UDN>

        <serviceList>
        <service>
            <serviceType>urn:schemas-upnp-org:service:ContentDirectory:1</serviceType>
            <serviceId>urn:upnp-org:serviceId:ContentDirectory</serviceId>
            <SCPDURL>/cds.xml</SCPDURL>
            <controlURL>/cds-control</controlURL>
            <eventSubURL>/cds-events</eventSubURL>
        </service>
        </serviceList>

        <presentationURL>/</presentationURL>
    </device>
    </root>`.trim();
}

export function getCdsXml() {
    return `
    <?xml version="1.0"?>
    <scpd xmlns="urn:schemas-upnp-org:service-1-0">
    <specVersion>
        <major>1</major>
        <minor>0</minor>
    </specVersion>
    <actionList>
        <action>
        <name>Browse</name>
        <argumentList>
            <argument>
            <name>ObjectID</name>
            <direction>in</direction>
            <relatedStateVariable>A_ARG_TYPE_ObjectID</relatedStateVariable>
            </argument>
            <argument>
            <name>BrowseFlag</name>
            <direction>in</direction>
            <relatedStateVariable>A_ARG_TYPE_BrowseFlag</relatedStateVariable>
            </argument>
            <argument>
            <name>Filter</name>
            <direction>in</direction>
            <relatedStateVariable>A_ARG_TYPE_Filter</relatedStateVariable>
            </argument>
            <argument>
            <name>StartingIndex</name>
            <direction>in</direction>
            <relatedStateVariable>A_ARG_TYPE_Index</relatedStateVariable>
            </argument>
            <argument>
            <name>RequestedCount</name>
            <direction>in</direction>
            <relatedStateVariable>A_ARG_TYPE_Count</relatedStateVariable>
            </argument>
            <argument>
            <name>SortCriteria</name>
            <direction>in</direction>
            <relatedStateVariable>A_ARG_TYPE_SortCriteria</relatedStateVariable>
            </argument>
            <argument>
            <name>Result</name>
            <direction>out</direction>
            <relatedStateVariable>A_ARG_TYPE_Result</relatedStateVariable>
            </argument>
            <argument>
            <name>NumberReturned</name>
            <direction>out</direction>
            <relatedStateVariable>A_ARG_TYPE_Count</relatedStateVariable>
            </argument>
            <argument>
            <name>TotalMatches</name>
            <direction>out</direction>
            <relatedStateVariable>A_ARG_TYPE_Count</relatedStateVariable>
            </argument>
            <argument>
            <name>UpdateID</name>
            <direction>out</direction>
            <relatedStateVariable>A_ARG_TYPE_UpdateID</relatedStateVariable>
            </argument>
        </argumentList>
        </action>
    </actionList>
    <serviceStateTable>
        <stateVariable sendEvents="no">
        <name>A_ARG_TYPE_ObjectID</name>
        <dataType>string</dataType>
        </stateVariable>
        <stateVariable sendEvents="no">
        <name>A_ARG_TYPE_BrowseFlag</name>
        <dataType>string</dataType>
        </stateVariable>
        <stateVariable sendEvents="no">
        <name>A_ARG_TYPE_Filter</name>
        <dataType>string</dataType>
        </stateVariable>
        <stateVariable sendEvents="no">
        <name>A_ARG_TYPE_Index</name>
        <dataType>ui4</dataType>
        </stateVariable>
        <stateVariable sendEvents="no">
        <name>A_ARG_TYPE_Count</name>
        <dataType>ui4</dataType>
        </stateVariable>
        <stateVariable sendEvents="no">
        <name>A_ARG_TYPE_SortCriteria</name>
        <dataType>string</dataType>
        </stateVariable>
        <stateVariable sendEvents="no">
        <name>A_ARG_TYPE_Result</name>
        <dataType>string</dataType>
        </stateVariable>
        <stateVariable sendEvents="no">
        <name>A_ARG_TYPE_UpdateID</name>
        <dataType>ui4</dataType>
        </stateVariable>
    </serviceStateTable>
    </scpd>
  `.trim();
}

export function getBrowseResponseXml(mediaFiles: RadioStation[]) {
    return `
    <?xml version="1.0"?>
    <s:Envelope
        xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" 
                        s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
        <s:Body>
            <u:BrowseResponse
                xmlns:u="urn:schemas-upnp-org:service:ContentDirectory:1">
                <Result>
                    ${getDIDLItemXml(mediaFiles)}
                </Result>
                <NumberReturned>${mediaFiles.length}</NumberReturned>
                <TotalMatches>${mediaFiles.length}</TotalMatches>
                <UpdateID>${Date.now()}</UpdateID>
            </u:BrowseResponse>
        </s:Body>
    </s:Envelope>
    `.trim();
}

export function getSearchCapabilitiesResponseXml() {
    return `
    <?xml version="1.0"?>
    <s:Envelope
        xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" 
                        s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
        <s:Body>
            <u:GetSearchCapabilitiesResponse xmlns:u="urn:schemas-upnp-org:service:ContentDirectory:1">
                <SearchCaps></SearchCaps>
            </u:GetSearchCapabilitiesResponse>
        </s:Body>
    </s:Envelope>
    `.trim();
}

export function getSortCapabilitiesResponseXml() {
    return `
    <?xml version="1.0"?>
    <s:Envelope
        xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" 
                        s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
        <s:Body>
            <u:GetSortCapabilitiesResponse xmlns:u="urn:schemas-upnp-org:service:ContentDirectory:1">
                <SortCaps></SortCaps>
            </u:GetSortCapabilitiesResponse>
        </s:Body>
    </s:Envelope>
    `.trim();
}

function getDIDLItemXml(stations: RadioStation[]) {
    function escapeXml(str: string) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    const items = stations.map((station, index) => {
        return `
        <item id="${index + 1}" parentID="0" restricted="1">
            <dc:title>${station.name}</dc:title>
            <dc:creator>radio</dc:creator>
            <upnp:album></upnp:album>
            <upnp:artist></upnp:artist>
            <res protocolInfo="http-get:*:audio/x-mpegurl:*" duration="0:00:01" size="200">${SERVER_URL}/media/${encodeURIComponent(
            station.id,
        )}</res>
            <upnp:class>object.item.audioItem.audioBroadcast</upnp:class>
        </item>
    `.trim();
    });

    return escapeXml(
        `
    <DIDL-Lite xmlns:dc="http://purl.org/dc/elements/1.1/"
            xmlns:upnp="urn:schemas-upnp-org:metadata-1-0/upnp/"
            xmlns="urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/">
        ${items.join('\n')}
    </DIDL-Lite>
  `.trim(),
    );
}
