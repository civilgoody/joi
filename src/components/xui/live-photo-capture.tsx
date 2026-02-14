// /* eslint-disable @next/next/no-img-element */
// "use client";

// import React, { useState, useRef, useCallback } from "react";
// import Webcam from "react-webcam";
// import { FaCamera } from "react-icons/fa";

// const videoConstraints = {
//   width: 1280,
//   height: 720,
//   facingMode: "user", // or "environment" for the back camera
// };

// export function LivePhotoCapture() {
//   const webcamRef = useRef<Webcam>(null);
//   const [imageSrc, setImageSrc] = useState<string | null>(null);

//   // Function to capture the photo
//   const capture = useCallback(() => {
//     const capturedImage = webcamRef.current?.getScreenshot();
//     if (capturedImage) {
//       setImageSrc(capturedImage);
//     }
//   }, [webcamRef]);

//   // Function to retake the photo
//   const retake = () => {
//     setImageSrc(null);
//   };

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
//       {/* Live Camera View */}
//       <div className="border-img-dashed rounded-lg p-6 flex flex-col items-start bg-white">
//         {imageSrc ? (
//           <img src={imageSrc} alt="Captured preview" className="rounded-md" />
//         ) : (
//           <Webcam
//             audio={false}
//             ref={webcamRef}
//             screenshotFormat="image/jpeg"
//             videoConstraints={videoConstraints}
//             className="rounded-md"
//           />
//         )}
//         <div className="mt-4 pl-8">
//           <p className="text-primary font-cabin font-bold mb-2">Live Camera</p>
//           {imageSrc ? (
//             <button
//               onClick={retake}
//               type="button"
//               className="px-4 py-2 bg-yellow-500 text-white font-semibold rounded-md hover:bg-yellow-600"
//             >
//               Retake Photo
//             </button>
//           ) : (
//             <button
//               onClick={capture}
//               type="button"
//               className="px-4 py-2 bg-teal-500 text-white font-semibold rounded-md hover:bg-teal-600"
//             >
//               Take Photo
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Preview Area */}
//       <div className="w-full h-full bg-[#F2F2F2] rounded-lg flex flex-col items-center justify-center p-4">
//         {imageSrc ? (
//           <div className="text-center">
//             <img
//               src={imageSrc}
//               alt="Final preview"
//               className="rounded-md max-h-[400px]"
//             />
//             <p className="mt-2 font-semibold text-gray-700">Preview</p>
//           </div>
//         ) : (
//           <div className="text-center text-muted-foreground">
//             <FaCamera className="w-16 h-16 mx-auto text-muted-dark" />
//             <p className="mt-8 font-mulish font-light text-sm">Preview</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
