let isConnected = false;

function updateConnectionStatus(connected) {
    const statusElement = document.getElementById('connectionStatus');
    if (connected !== isConnected) {
        isConnected = connected;
        if (connected) {
            statusElement.className = 'connection-status connected';
            statusElement.innerHTML = '✓ Connected';
        } else {
            statusElement.className = 'connection-status disconnected';
            statusElement.innerHTML = '✗ Disconnected';
        }
    }
}

function updateStatusIndicator(status) {
    const indicator = document.getElementById('statusIndicator');
    indicator.textContent = status;

    // Remove all status classes
    indicator.classList.remove('status-normal', 'status-mild', 'status-tremor');

    // Add appropriate class based on status
    if (status === 'Normal') {
        indicator.classList.add('status-normal');
    } else if (status === 'Mild Movement') {
        indicator.classList.add('status-mild');
    } else if (status === 'Tremor Detected') {
        indicator.classList.add('status-tremor');
    }
}

async function load() {
    try {
        const response = await fetch('/api/sensor/latest');
        if (response.ok) {
            const d = await response.json();

            updateConnectionStatus(true);

            if (d) {
                console.log('Received data:', d); // Debug log

                document.getElementById('ax').textContent = d?.ax ?? '-';
                document.getElementById('ay').textContent = d?.ay ?? '-';
                document.getElementById('az').textContent = d?.az ?? '-';
                document.getElementById('accelMag').textContent = d?.accelerationMagnitude ?? '-';
                document.getElementById('deltaA').textContent = d?.deltaA ?? '-';

                const status = d?.status ?? 'Unknown';
                updateStatusIndicator(status);

                const timestamp = d?.timeStamp
                    ? new Date(d.timeStamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
                    : '-';
                document.getElementById('timestamp').textContent = `Last updated: ${timestamp}`;
            } else {
                console.log('No data received');
                document.getElementById('timestamp').textContent = 'Last updated: No data available';
            }
        } else {
            console.error('Failed to fetch sensor data:', response.status, response.statusText);
            updateConnectionStatus(false);
        }
    } catch (error) {
        console.error('Error fetching sensor data:', error);
        updateConnectionStatus(false);
    }
}

// Start loading data
setInterval(load, 500);
load();