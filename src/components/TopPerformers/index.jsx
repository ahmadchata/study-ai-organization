import "./styles.css";
import { useQuery } from "@tanstack/react-query";
import LoadingTracker from "../Common/Loading";
import { DashboardAPI } from "../../api/DashboardAPI";

const TopPerformers = () => {
  const { data: topPerformers, isFetching } = useQuery({
    queryKey: ["topPerformers"],
    refetchOnMount: false,
    queryFn: () => DashboardAPI.topPerformers(true),
  });

  if (isFetching) {
    return <LoadingTracker />;
  }

  return (
    <table className="performers-table">
      <tbody className="performers-table-body">
        {topPerformers?.data?.students.map((student, index) => (
          <tr className="performers-table-tr" key={student?.name}>
            <th scope="row">{index + 1}</th>
            <td>{student?.student_name}</td>
            <td>
              <span className="pts">{student?.total_points}</span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TopPerformers;

// {/* <div className="col-12 col-lg p-0">
//   <div className="px-">
//     <h5>Leaderboard</h5>
//     <p className="text-muted position-card my-3 small">
//       Your current tag: <strong>Explorer</strong> Position:{" "}
//       <strong>2899</strong>
//     </p>

//     <div className="leader-card text-white text-center position-relative">
//       {topThree?.map((user, i) => (
//         <div key={i} className={`text-center position-${i}`}>
//           <div
//             className={`rounded-circle position-circle position-circle-${i}`}
//           >
//             <img
//               src={
//                 user.profile_picture
//                   ? `https://api.study-ai.org/${user.profile_picture}`
//                   : "/assets/abstract.svg"
//               }
//               className="img-fluid"
//               alt="image"
//               width={38}
//               height={38}
//             />
//           </div>
//           <div>{user.total_overall_points} pts</div>
//         </div>
//       ))}
//     </div>
//     {fetchingLeaderboard ? (
//       "Fetching Leaderboard"
//     ) : (
//       <div className="list-card bg-white py-2 position-relative">
//         <div className="px-3 d-flex justify-content-between align-items-center my-3">
//           <div className="search w-100">
//             <SearchIcon style={{ color: "#929292" }} />
//             <input
//               className="ms-2 w-75"
//               placeholder="Find friends..."
//               value={searchTerm}
//               onChange={handleSearchChange}
//             />
//           </div>
//           {/* <div className="" style={{ maxWidth: "112px" }}>
//                     <Select
//                       options={frequencyOptions}
//                       value={timeFilter}
//                       onChange={setTimeFilter}
//                       placeholder="Select Frequency"
//                     />
//                   </div> */}
//         </div>

//         <div
//           className={`leaderboard-scroll-container position-relative ${
//             hasMore && !loading ? "has-more" : ""
//           }`}
//           style={{
//             maxHeight: "400px",
//             overflowY: "auto",
//             scrollBehavior: "smooth",
//           }}
//           onScroll={handleScroll}
//         >
//           <ul className="list-group list-group-flush mt-4">
//             {displayedLeaderboard.map((user, i) => (
//               <li
//                 key={`${user.student_name}-${i}`}
//                 className={`${
//                   i % 2 ? "list-bg" : "bg-white"
//                 } list-group-item p-3 border-0 d-flex justify-content-between`}
//               >
//                 <span className="text-capitalize">
//                   {i + 1}. {user.student_name} 👑
//                 </span>
//                 <span>
//                   {user.total_overall_points}{" "}
//                   <span className={`${"green-text"} small-text ms-1`}>
//                     {"▲"}
//                     {/* {user.up ? "▲" : "▼"} */}
//                   </span>
//                 </span>
//               </li>
//             ))}

//             {loading && (
//               <li className="list-group-item p-3 border-0 text-center">
//                 <div className="spinner-border spinner-border-sm" role="status">
//                   <span className="visually-hidden">Loading...</span>
//                 </div>
//                 <span className="ms-2 text-muted">Loading more...</span>
//               </li>
//             )}

//             {!hasMore && displayedLeaderboard.length > 0 && (
//               <li className="list-group-item p-3 border-0 text-center text-muted small">
//                 🏁 You've reached the end of the leaderboard
//               </li>
//             )}

//             {displayedLeaderboard.length === 0 && !loading && (
//               <li className="list-group-item p-3 border-0 text-center text-muted">
//                 No users found matching your search
//               </li>
//             )}
//           </ul>

//           {showScrollHint && !loading && (
//             <div className="scroll-hint-arrow">
//               <KeyboardArrowDownIcon
//                 className="bounce-animation"
//                 style={{
//                   color: "#929292",
//                   fontSize: "20px",
//                 }}
//               />
//             </div>
//           )}
//         </div>

//         {hasMore && !loading && (
//           <div className="text-center see-more-container mt-3">
//             <button
//               className="btn see-more-btn"
//               onClick={handleSeeMoreClick}
//               disabled={loading}
//             >
//               <span className="me-2">See More</span>
//               <KeyboardArrowDownIcon style={{ fontSize: "16px" }} />
//             </button>
//           </div>
//         )}

//         {displayedLeaderboard.length > 0 && (
//           <div className="text-center mt-2">
//             <small className="text-muted">
//               Showing {displayedLeaderboard.length} of{" "}
//               {filteredLeaderboard.length} users
//             </small>
//           </div>
//         )}
//       </div>
//     )}
//   </div>
// </div>; */}
