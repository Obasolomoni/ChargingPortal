//   const modal = document.getElementById("myModal");
//   const modal3 = document.getElementById("myModal3");

//   const openBtn = document.getElementById("openModalBtn");
//   const closeBtn = document.getElementById("closeModalBtn");
//   const closeBtn3 = document.getElementById("closeModalBtn3");

//   openBtn.onclick = () => (modal.style.display = "block");
//   closeBtn.onclick = () => (modal.style.display = "none");
//   closeBtn3.onclick = () => (modal3.style.display = "none");

//   const apiURL = 'http://localhost:2000/chargedUsers';
//   let editingId = null;

//   // ✅ Load all sessions
//   async function loadCharge() {
//     try {
//       const res = await fetch(apiURL);
//       const data = await res.json();
//       const table = document.getElementById('table-body');
//       table.innerHTML = '';

//       data.forEach((item, index) => {
//         const row = document.createElement('tr');
//         row.innerHTML = `
//           <td>${index + 1}</td>
//           <td>${item.userName}</td>
//           <td>${item.mobileName}</td>
//           <td>${item.userNumber}</td>
//           <td>${item.session}</td>
//           <td>${item.slotName}</td>
//           <td>${item.timeCharged || ''}</td>
//           <td>${item.timeCollected || ''}</td>
//           <td>${item.date}</td>
//           <td>
//             <button onclick="openEditModal(${item.id}, '${item.mobileName}', '${item.userNumber}', '${item.slotName}', '${item.session}')">✏️</button>
//             <button onclick="deleteSession(${item.id})">🗑️</button>
//           </td>
//         `;
//         table.appendChild(row);
//       });
//     } catch (err) {
//       console.error("Error loading sessions:", err);
//     }
//   }

//   function searchFile() {
//   const searchInput = document.getElementById("mySearch").value.toLowerCase();
//   const rows = document.querySelectorAll("#table-body tr");

//   if (searchInput === "") {
//     alert("Please enter a value to search");
//     return;
//   }

//   rows.forEach((row) => {
//     const rowText = row.textContent.toLowerCase();
//     row.style.display = rowText.includes(searchInput) ? "" : "none";
//   });
// }


//   // ✅ Add new session
//   async function addCharge() {
//     const chargeInput = document.getElementById("userName-input");
//     const mobileNameInput = document.getElementById("mobileName-input");
//     const userMobileNumberInput = document.getElementById("userNumber-input");
//     const sessionInput = document.getElementById("session-input");
//     const slotNameInput = document.getElementById("slotName-input");

//     if (!chargeInput.value || !mobileNameInput.value || !userMobileNumberInput.value || !sessionInput.value || !slotNameInput.value) {
//       alert('Please fill all fields!');
//       return;
//     }

//     const payload = {
//       userName: chargeInput.value,
//       mobileName: mobileNameInput.value,
//       userNumber: userMobileNumberInput.value,
//       session: sessionInput.value,
//       slotName: slotNameInput.value
//     };

//     try {
//       const res = await fetch(apiURL, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload)
//       });

//       if (res.ok) {
//         chargeInput.value = '';
//         mobileNameInput.value = '';
//         userMobileNumberInput.value = '';
//         sessionInput.value = '';
//         slotNameInput.value = '';
//         modal.style.display = 'none';
//         loadCharge();
//       } else {
//         const error = await res.json();
//         alert(error.message || 'Error adding session');
//       }
//     } catch (err) {
//       alert('Connection error');
//       console.error(err);
//     }
//   }

//   // ✅ Open edit modal with values
//   function openEditModal(id, mobileName, userNumber, slotName, session) {
//     editingId = id;
//     document.getElementById("edit-mobileName-input").value = mobileName;
//     document.getElementById("edit-userNumber-input").value = userNumber;
//     document.getElementById("edit-slotName-input").value = slotName;
//     document.getElementById("edit-session-input").value = session;
//     modal3.style.display = 'block';
//   }

//   // ✅ Edit session (PUT)
//   async function editSession() {
//     const updatedData = {
//       mobileName: document.getElementById("edit-mobileName-input").value,
//       userNumber: document.getElementById("edit-userNumber-input").value,
//       slotName: document.getElementById("edit-slotName-input").value,
//       session: document.getElementById("edit-session-input").value
//     };

    
//     try {
//       const res = await fetch(`${apiURL}/${editingId}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(updatedData)
//       });

      

//       if (res.ok) {
//         modal3.style.display = 'none';
//         loadCharge();
//       } else {
//         alert("Failed to update session");
//       }
//     } catch (err) {
//       console.error("Update error:", err);
//     }
//   }

//   // ✅ Delete session
//   async function deleteSession(id) {
//     if (!confirm("Are you sure you want to delete this session?")) return;

//     try {
//       const res = await fetch(`${apiURL}/${id}`, {
//         method: 'DELETE'
//       });

//       if (res.ok) {
//         loadCharge();
//       } else {
//         alert("Failed to delete session");
//       }
//     } catch (err) {
//       console.error("Delete error:", err);
//     }
//   }

//   // ✅ Auto-load on page open
//   window.onload = loadCharge;