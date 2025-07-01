const tbody = document.getElementById('device-list');
const itemTemplate = document.getElementById('device-item-template');
const video = document.getElementById('video');
const statusText = document.getElementById('status-text');

function storeEnumeratedDevices(devices) {
    localStorage.setItem('devices', JSON.stringify(devices));
}

function loadEnumeratedDevices() {
    const devices = localStorage.getItem('devices');
    return devices === null ? [] : JSON.parse(devices);
}

function populateDeviceList(devices) {

    // remove all table items
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }

    let changes = '';
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

        const displayId = newDevice.deviceId ?? '<no ID>';
        const displayLabel = newDevice.label ?? '<no label>';
        if (previousDevice === null) {
            changes += `New device found: ${displayLabel} (${displayId})<br>`;
        }

        // add item to table
        const clone = itemTemplate.content.cloneNode(true);
        clone.querySelector('.device-type').textContent = newDevice.kind;
        clone.querySelector('.device-label').textContent = displayLabel;
        clone.querySelector('.device-id').textContent = displayId;
        tbody.appendChild(clone);
    }

    statusText.innerHTML = changes;

    storeEnumeratedDevices(devices);
}

document.getElementById('enumerate-devices').addEventListener('click', async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    populateDeviceList(devices.filter(device => device.kind === 'videoinput'));
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


