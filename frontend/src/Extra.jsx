// import { useState, useEffect } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";

// export default function Charging() {
//   const [showForm, setShowForm] = useState(false);
//   const [submitted, setSubmitted] = useState(false);
//   const [result, setResult] = useState("");
//   const [sessions, setSessions] = useState([]);

//   // Fetch API here
//   const url =
//     "http://localhost:2000/api";

//   //   // Fetch existing charging sessions from your backend or database
//   useEffect(() => {
//     async function fetchData() {
//       try {
//         const res = await fetch(url);
//         const data = await res.json();
//         console.log(data)
//       } catch (err) {
//         console.error("Error fetching sessions:", err);
//       }
//     }
//     fetchData();
//   }, []);

//   //   // Handle form submit
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//         try {
//           const res = await fetch(url, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(sessions)
//           });
          
//     //       if (res.ok) {
//     //         setRows(prev => [...prev, data]);
//     //         setSessions({ userName: "", mobileName: "", slotName: "", userNumber: "", session: "" });
//     //         setShowForm(false);
//     //       } else { alert(data.message); }
//     //     } catch (error) { console.error("Error creating session:", error); }

//     //   // Re-fetch sessions after submission
//     //   const updated = await fetch(url);
//     //   const newData = await updated.json();
//     //   setSessions(newData);
//     //  // } catch (err) {
//     // //   console.error("Submit error:", err);
//     // //   setResult("Error submitting data!");
//     //  // }
//     //   };

//     return (
//       <div className="container mt-5">
//         <h2 className="text-center mb-4">⚡ Phone Charging Tracker</h2>

//         <div className="text-center mb-3">
//           <button
//             className="btn btn-primary"
//             onClick={() => setShowForm(!showForm)}
//           >
//             {showForm ? "Hide Form" : "Add New Session"}
//           </button>
//         </div>

//         {showForm && (
//           <form
//             onSubmit={handleSubmit}
//             className="p-4 border rounded bg-light shadow-sm"
//           >
//             <div className="mb-3">
//               <label className="form-label">Users Name</label>
//               <input
//                 name="name"
//                 required
//                 className="form-control"
//                 placeholder="Enter customer name"
//               />
//             </div>

//             <div className="mb-3">
//               <label className="form-label">Mobile Name</label>
//               <input
//                 name="Phone Name"
//                 required
//                 className="form-control"
//                 placeholder="e.g. iPhone 12, Tecno Spark"
//               />
//             </div>

//             <div className="mb-3">
//               <label className="form-label">Users Number</label>
//               <input
//                 type="number"
//                 name="User Number"
//                 required
//                 className="form-control"
//                 placeholder="e.g. iPhone 12, Tecno Spark"
//               />
//             </div>

//             <div className="mb-3">
//               <label className="form-label">Slot Name</label>
//               <input
//                 name="Slot Name"
//                 required
//                 className="form-control"
//                 placeholder="e.g. iPhone 12, Tecno Spark"
//               />
//             </div>

//             <label className="form-label">Session</label>
//             <select className="mb-3">
//               <option value="Charging">Charging</option>
//               <option value="Collected">Collected</option>
//               <option value="Pending">Pending</option>
//             </select>

//             <div className="text-center">
//               <button type="submit" className="btn btn-success">
//                 Save Session
//               </button>
//             </div>
//           </form>
//         )}

//         {submitted && (
//           <div className="alert alert-info text-center mt-3">
//             {result || "Charging session submitted!"}
//           </div>
//         )}

//         <h4 className="mt-5 mb-3 text-center">🔋 Charging Sessions</h4>

//         <div className="table-responsive">
//           <table className="table table-striped table-hover">
//             <thead className="table-dark">
//               <tr>
//                 <th>#</th>
//                 <th>Name</th>
//                 <th>Phone Name</th>
//                 <th>User Number</th>
//                 <th>Slot Name</th>
//                 <th>session</th>
//                 <th>Time Charged</th>
//                 <th>Date Charged</th>
//               </tr>
//             </thead>
//             <tbody>
//               {sessions.length === 0 ? (
//                 <tr>
//                   <td colSpan="5" className="text-center">
//                     No sessions yet
//                   </td>
//                 </tr>
//               ) : (
//                 sessions.map((s, i) => (
//                   <tr key={i}>
//                     <td>{i + 1}</td>
//                     <td>{s.userName}</td>
//                     <td>{s.mobileName}</td>
//                     <td>{s.userNumber}</td>
//                     <td>{s.slotName}</td>
//                     <td>{s.session}</td>
//                     <td>{s.timeCharged}</td>
//                     <td>{s.dateCharged}</td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     )
//   }
// }