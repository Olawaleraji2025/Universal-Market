import { useQuery,useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabaseClient';



// This is how to fetch a single image URL from Supabase and show it on the screen:
// export function ProductImage() {

//   // 1. The Instructions: This function grabs the URL from Supabase
//   const fetchImageUrl = async () => {
//     const { data } = supabase
//       .storage
//       .from('Items images')
//       .getPublicUrl('Day 1-0.PNG'); // This is the path to the image in your Supabase storage

//     return data.publicUrl; // This returns the string "https://..."
//   };

//   // 2. The Tracker: We tell TanStack Query to run those instructions
//   const { data: imageUrl, isLoading, error } = useQuery({
//     queryKey: ['phoneImage'], // The unique name for this job
//     queryFn: fetchImageUrl,    // The instructions we wrote above
//   });

//   console.log('Image URL:', imageUrl); // This will show the URL in the browser console

//   // 3. The Logic: What do we show on the screen?
//   if (isLoading) return <div>Loading image...</div>;
//   if (error) return <div>Error loading image!</div>;

//   return (
//     <div>
//       <h1>My Phone</h1>
//       {/* 4. We put the URL into a standard HTML img tag */}
//       <img 
//         src={imageUrl} 
//         alt="A phone" 
//         style={{ width: '400px', height: 'auto' }} 
//       />
//     </div>
//   );
// }

// This is how to fetch a whole gallery of images from Supabase and show them on the screen:
// const fetchGallery = async () => {
//   // 1. Get the list of all files in the bucket
//   const { data: fileList, error } = await supabase
//     .storage
//     .from('Items images')
//     .list(""); // This gives us an Array of file info
    
// console.log('File List:', fileList); // This will show the list of files in the browser console

//   if (error) throw error;

//   // 2. Turn that list of info into a list of real URLs
//   const urls = fileList.map((file) => {
//     const { data } = supabase
//       .storage
//       .from('Items images')
//       .getPublicUrl(file.name); // We use the file name to get the URL
    
//     return data.publicUrl;
//   });

//   return urls; // This returns an Array of strings: ["https://...", "https://..."]
// };

// export function ProductImage() {
//   const { data: images, isLoading, error } = useQuery({
//     queryKey: ['gallery'],
//     queryFn: fetchGallery,
//   });

//   if (isLoading) return <p>Loading Gallery...</p>;
//   if (error) return <p>Error loading Gallery.</p>;


//   return (
//     <div>
//       {images?.map((url) => (
//         <img key={url} src={url} style={{ width: '400px', height: "auto" }} />
//       ))}
//     </div>
//   );
// }


// This is how to upload an image to Supabase when the user picks a file from their computer:
// export function ProductImage() {
  
//   // 1. The Construction Worker (Mutation)
//   const uploadMutation = useMutation({
//     mutationFn: async (file) => {
//       // This is the instruction to Supabase
//       const { data, error } = await supabase.storage
//         .from('Items images')
//         .upload(`${file.name}`, file);

//       if (error) throw error;
//       return data;
//     },
//     onSuccess: () => {
//       alert("Upload complete!");
//     }
//   });

//   // 2. The Logic: When the user picks a file
//   const handleUpload = (event) => {
//     const file = event.target.files[0]; // Get the 1st file
//     if (file) {
//       // 3. We tell the worker to start!
//       uploadMutation.mutate(file);
//     }
//   };

//   return (
//     <div>
//       <input type="file" onChange={handleUpload} />
//       {uploadMutation.isPending && <p>Uploading...</p>}
//     </div>
//   );
// }


// This is how to upload MULTIPLE images to Supabase when the user picks files from their computer:
// export function ProductImage() {
//   const queryClient = useQueryClient();

//   // 1. The Construction TEAM (The Mutation)
//   const uploadMutation = useMutation({
//     mutationFn: async (fileList) => {
//       // 1. Convert to Array immediately
//       const files = Array.from(fileList);

//       // 2. Map them into individual upload tasks
//       const tasks = files.map(async (file) => {
//         const { data, error } = await supabase.storage
//           .from('Items images')
//           .upload(`${Date.now()}-${file.name}`, file);

//         if (error) {
//           console.error("Supabase Error:", error.message);
//           throw error;
//         }

//         return data;
//       });

//       // 3. Wait for all tasks to finish
//       return Promise.all(tasks);
//     },
//     // Step C: Run all the tasks at the same time!
//     // This waits for EVERY file in the list to finish
//     onSuccess: () => {
//       alert("All files uploaded successfully!");
//       // This tells the "Smart Assistant" to go fetch the new list of images
//       queryClient.invalidateQueries({ queryKey: ['gallery'] });
//     },
//     onError: (error) => {
//       alert(`Upload failed: ${error?.message ?? String(error)}`);
//     }
//   });

//   // 2. The Logic: When the user clicks the button
//   const handleFileChange = (event) => {
//     const files = event.target.files; // This is our "Bag of Marbles"
//     if (files && files.length > 0) {
//       uploadMutation.mutate(files);
//     }
//   };

//   return (
//     <div style={{ padding: '20px', border: '2px dashed #ccc' }}>
//       <h3>Upload Multiple Photos</h3>
      
//       {/* Notice the 'multiple' attribute here! */}
//       <input 
//         type="file" 
//         multiple 
//         onChange={handleFileChange} 
//         disabled={uploadMutation.isPending}
//       />

//       {uploadMutation.isPending && <p>Uploading your team of files...</p>}
//     </div>
//   );
// }

