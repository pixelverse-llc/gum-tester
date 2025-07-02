const deviceList = document.getElementById('device-list');
const itemTemplate = document.getElementById('device-item-template');
const video = document.getElementById('video');

function storeEnumeratedDevices(devices) {
    localStorage.setItem('devices', JSON.stringify(devices));
}

function loadEnumeratedDevices() {
    const devices = localStorage.getItem('devices');
    return devices === null ? [] : JSON.parse(devices);
}

function populateDeviceList(devices) {

    // remove all items
    while (deviceList.lastChild) {
        deviceList.removeChild(deviceList.lastChild);
    }

    document.getElementById('device-count').textContent = `${devices.length} videoinput device(s) enumerated.`;

    const oldDevices = loadEnumeratedDevices();
    for (const newDevice of devices) {

        // check if this device can be found in previous devices (by ID)
        let previousDevice = null;
        for (const oldDevice of oldDevices) {
            if (oldDevice.deviceId === newDevice.deviceId) {
                previousDevice = oldDevice;
                break;
            }
        }

        let statusText = '';
        const displayId = newDevice.deviceId ?? '<no ID>';
        const displayLabel = newDevice.label ?? '<no label>';
        if (previousDevice === null) {
            statusText = `NEW device ID (${displayId.substring(0, 10)}…)`;
        }

        // add item to table
        const clone = itemTemplate.content.cloneNode(true);
        clone.querySelector('.device-label').textContent = displayLabel;
        clone.querySelector('.device-id').textContent = displayId;
        clone.querySelector('.device-status').textContent = statusText;
        deviceList.appendChild(clone);
    }

    storeEnumeratedDevices(devices);
}

async function doEnumerateDevices() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    populateDeviceList(devices.filter(device => device.kind === 'videoinput'));
}

document.getElementById('enumerate-devices').addEventListener('click', async () => {
    await doEnumerateDevices();
});

document.getElementById('get-user-media').addEventListener('click', async () => {
    const constraints = {audio: false, video: true};
    const stream = await navigator.mediaDevices.getUserMedia(constraints);

    video.onloadedmetadata = () => {
        video.play();
        setTimeout(() => {
            stream.getTracks().forEach(track => track.stop());
        }, 1_000);
    }
    video.srcObject = stream;
})

await doEnumerateDevices();

