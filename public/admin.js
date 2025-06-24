// DOM references
const turfListBody = document.getElementById('turf-list-body');
const bookingListBody = document.getElementById('booking-list-body');

async function fetchTurfs() {
    const res = await fetch(`http://localhost:5000/api/turfs`);
    if (!res.ok) throw new Error("Couldn't load turfs");
    return res.json();
}

async function fetchBookings() {
    const res = await fetch(`http://localhost:5000/api/bookings`);
    if (!res.ok) throw new Error("Couldn't load bookings");
    return res.json();
}

let users = [];

async function fetchUsers() {
    const res = await fetch('http://localhost:5000/api/users');
    if (!res.ok) throw new Error("Couldn't load users");
    users = await res.json();
}


function renderTurfs(turfs) {
    turfListBody.innerHTML = '';  // clear

    turfs.forEach(t => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="flex items-center">
          <div class="flex-shrink-0 h-10 w-10 bg-accent rounded-full flex items-center justify-center">
            <i class="fas fa-futbol text-white"></i>
          </div>
          <div class="ml-4">
            <div class="text-sm font-medium text-gray-900">${t.name}</div>
          </div>
        </div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${t.location}</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${t.type || '—'}</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Nu. ${t.pricePerHour}</td>
      <td class="px-6 py-4 whitespace-nowrap">
        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${t.status === 'active'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }">
          ${t.status === 'active' ? 'Available' : 'Unavailable'}
        </span>
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <button class="text-primary hover:text-secondary mr-3 view-turf" data-id="${t._id}">
          <i class="fas fa-eye"></i>
        </button>
        ${t.status === 'active' ? `<button onclick="deactivate('${t._id}')" class="text-red-500 hover:text-red-700 book-turf" data-id="${t._id}">
          <i class="fas fa-ban"></i>
        </button>` : ` <button onclick="activate('${t._id}')" class="text-blue-500 hover:text-blue-700 book-turf" data-id="${t._id}">
          <i class="fas fa-circle-check"></i>
        </button>`}
        
       
      </td>
    `;
        turfListBody.appendChild(tr);
    });

    turfListBody.querySelectorAll('.view-turf').forEach(btn =>
        btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            // load details & switch tab...
        })
    );
    turfListBody.querySelectorAll('.book-turf').forEach(btn =>
        btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            // open booking modal for turf id...
        })
    );
}

async function activate(id) {
    try {
        const res = await fetch(`/api/turfs/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: 'active' })
        });

        if (!res.ok) throw new Error(`Server error: ${res.status}`);

        alert("Turf activated successfully");
        location.reload()
    } catch (error) {
        console.error(error);
        alert("Something went wrong");
    }
}

async function deactivate(id) {
    try {
        const res = await fetch(`/api/turfs/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: 'inactive' })
        });

        if (!res.ok) throw new Error(`Server error: ${res.status}`);

        alert("Turf deactivated successfully");
        location.reload()
    } catch (error) {
        console.error(error);
        alert("Something went wrong");
    }
}

async function removeBooking(id) {
    try {
        const res = await fetch(`/api/bookings/${id}`, {
            method: 'DELETE'
        });

        if (!res.ok) throw new Error(`Server error: ${res.status}`);

        alert("Booking removed successfully");
        location.reload()
    } catch (error) {
        console.error(error);
        alert("Something went wrong");
    }
}

function renderBookings(bookings) {
    bookingListBody.innerHTML = '';
    bookings.forEach(b => {
        const customer = users.find(u => u._id === b.user._id) || {};
        const customerName = customer.name || '—';
        const tr = document.createElement('tr');
        tr.innerHTML = `
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="flex items-center">
          <div class="flex-shrink-0 h-10 w-10 bg-accent rounded-full flex items-center justify-center">
            <i class="fas fa-futbol text-white"></i>
          </div>
          <div class="ml-4">
            <div class="text-sm font-medium text-gray-900">${b.turf.name}</div>
          </div>
        </div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${customerName}</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        ${new Date(b.date).toLocaleDateString()}
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        ${b.startTime} - ${b.endTime}
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        ${(parseInt(b.endTime) - parseInt(b.startTime))} hr
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Nu. ${b.price * (parseInt(b.endTime) - parseInt(b.startTime))}</td>
      <td class="px-6 py-4 whitespace-nowrap">
        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${b.status === 'confirmed'
                ? 'bg-green-100 text-green-800'
                : b.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
            }">
          ${b.status.charAt(0).toUpperCase() + b.status.slice(1)}
        </span>
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <button class="text-primary hover:text-secondary mr-3 view-booking" data-id="${b._id}">
          <i class="fas fa-eye"></i>
        </button>
        <button onclick="removeBooking('${b._id}')" class="text-red-500 hover:text-red-700 delete-booking" data-id="${b._id}">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    `;
        bookingListBody.appendChild(tr);
    });

    bookingListBody.querySelectorAll('.delete-booking').forEach(btn =>
        btn.addEventListener('click', async () => {
            const id = btn.dataset.id;
            if (!confirm('Delete this booking?')) return;
            await fetch(`http://localhost:5000/api/bookings/${id}`, { method: 'DELETE' });
            loadAndRender();
        })
    );
}

async function loadAndRender() {
    try {
        await fetchUsers();
        const [turfs, bookings] = await Promise.all([fetchTurfs(), fetchBookings()]);
        renderTurfs(turfs);
        renderBookings(bookings);
    } catch (e) {
        console.error(e);
        alert('Failed to load data.');
    }
}


document.addEventListener('DOMContentLoaded', loadAndRender);

let photoUrl;

function handleUpload(file) {
    return new Promise((resolve, reject) => {
        try {
            const formData = new FormData();
            formData.append("file", file);

            const xhr = new XMLHttpRequest();
            xhr.open(
                "POST",
                "https://api.pinata.cloud/pinning/pinFileToIPFS",
                true
            );
            xhr.setRequestHeader("pinata_api_key", "4e2e0b082a3a7a7624d3");
            xhr.setRequestHeader(
                "pinata_secret_api_key",
                "f9ccf3142e278df713936a3a8032d7c2e5b5336543a884f4b44e40b707ddba35"
            );

            xhr.onload = function () {
                if (xhr.status === 200) {
                    const resFile = JSON.parse(xhr.responseText);
                    const imgHash = `https://gateway.ipfs.io/ipfs/${resFile.IpfsHash}`;
                    resolve(imgHash);
                } else {
                    reject("Unable to upload image to Pinata");
                }
            };

            xhr.send(formData);
        } catch (err) {
            reject("Unable to upload image to Pinata");
            console.error(err);
        }
    });
}

async function handlePhotoUpload(e) {
    e.preventDefault()
    const fileInput = document.getElementById("fileInput").files[0];

    if (fileInput) {
        document.getElementById("status").textContent = "Uploading Image to IPFS...";

        try {
            photoUrl = await handleUpload(fileInput);
            document.getElementById("status").textContent = "Uploaded!";
            document.getElementById("ipfs-path").textContent = photoUrl;
            console.log("IPFS URL:", photoUrl);
        } catch (error) {
            document.getElementById("status").textContent = "Upload failed";
            console.error(error);
        }
    } else {
        alert("No file selected");
    }
}


async function handleAddTurf(e) {
    e.preventDefault()
    const name = document.getElementById('turf-name').value.trim();
    const description = document.getElementById('turf-description').value.trim();
    const location = document.getElementById('turf-location').value.trim();
    const pricePerHour = parseFloat(document.getElementById('turf-price').value);
    const type = document.getElementById('turf-type').value;

    if (!name || !description || !location || !pricePerHour || !type || !photoUrl) return alert("Fill in all relevant details!")

    const payload = {
        name,
        description,
        location,
        pricePerHour,
        type,
        photo: photoUrl
    };
    try {
        const res = await fetch('http://localhost:5000/api/turfs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        console.log('Server response:', data);
        alert(`Turf "${data.name}" added!`);
        loadAndRender();
        activeTab = 'turfList';
    } catch (err) {
        console.error(err);
        alert('Failed to add turf: ' + err.message);
    }

}