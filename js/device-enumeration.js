
const tbody = document.getElementById('device-list');
const itemTemplate = document.getElementById('device-item-template');

function populateDeviceList(devices) {

    // remove all table items
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }

    devices.forEach(device => {
        console.dir(device);
        const clone = itemTemplate.content.cloneNode(true);
        clone.querySelector('.device-type').textContent = device.kind ? device.kind : '<none>';
        clone.querySelector('.device-label').textContent = device.label ? device.label : '<none>';
        clone.querySelector('.device-id').textContent = device.deviceId ? device.deviceId : '<none>';
        tbody.appendChild(clone);
    });
}

document.getElementById('enumerate-devices').addEventListener('click', async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    populateDeviceList(devices.filter(device => device.kind === 'videoinput'));
});

document.getElementById('get-user-media').addEventListener('click', async () => {
    const constraints = { audio: false, video: true };
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    setTimeout(() => stream.close(), 1_000);
})


