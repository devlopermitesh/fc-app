// "use client";

// import React, { useEffect } from "react";
// import { connectSocket, disconnectSocket } from "@/sockets/connect";
// function SocketProvider({ children }: { children: React.ReactNode }) {
// //todo: use to fetch token from cookies name is SessioncookiesName
// //handle is isSignin with check sesion avaiablity and not expire
//   useEffect(() => {
//     let active = true;
//     async function handleSocket() {
//       if (isSignedIn) {
//         const token = await getToken();

//         if (token && active) {
//           connectSocket(token);
//         }
//       } else {
//         disconnectSocket();
//       }
//     }

//     handleSocket();

//     return () => {
//       active = false;
//     };
//   }, [isSignedIn]);

//   return <>{children}</>;
// }
// export default SocketProvider;
