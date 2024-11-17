'use client'
import { useState } from 'react';
import Image from 'next/image';
import SteganographyForm from './SteganographyForm';
import { WalletConnect } from './WalletConnect';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-100 py-6">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">
          Image Steganography
        </h1>
        <div className="mb-6 flex justify-end">
          <WalletConnect />
        </div>
       <SteganographyForm/>
      </div>
    </main>
  );
}

// 'use client'
// import { useState } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from '@/components/ui/button';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Textarea } from "@/components/ui/textarea";
// import { Loader2, Download, Image, Lock, Unlock, Wallet } from "lucide-react";
// import { WalletConnect } from './WalletConnect';

// export default function HomePage() {
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [message, setMessage] = useState('');
//   const [decryptedMessage, setDecryptedMessage] = useState('');
//   const [encryptedImageUrl, setEncryptedImageUrl] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [isWalletConnected, setIsWalletConnected] = useState(false);
//   const [isGoogleConnected, setIsGoogleConnected] = useState(false);

//   const handleImageSelect = (e) => {
//     if (e.target.files && e.target.files[0]) {
//       setSelectedImage(e.target.files[0]);
//     }
//   };

//   const handleEncrypt = async () => {
//     if (!selectedImage || !message) return;

//     try {
//       setLoading(true);
//       const formData = new FormData();
//       formData.append('image', selectedImage);
//       formData.append('message', message);

//       const response = await fetch('/api/encrypt', {
//         method: 'POST',
//         body: formData,
//       });

//       if (!response.ok) throw new Error('Encryption failed');

//       const blob = await response.blob();
//       const imageUrl = URL.createObjectURL(blob);
//       setEncryptedImageUrl(imageUrl);
//     } catch (error) {
//       console.error('Error:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDecrypt = async () => {
//     if (!selectedImage) return;

//     try {
//       setLoading(true);
//       const formData = new FormData();
//       formData.append('image', selectedImage);

//       const response = await fetch('/api/decrypt', {
//         method: 'POST',
//         body: formData,
//       });

//       if (!response.ok) throw new Error('Decryption failed');

//       const data = await response.json();
//       setDecryptedMessage(data.message);
//     } catch (error) {
//       console.error('Error:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDownload = () => {
//     if (encryptedImageUrl) {
//       const link = document.createElement('a');
//       link.href = encryptedImageUrl;
//       link.download = 'encrypted-image.png';
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     }
//   };

//   const handleGoogleSignIn = async () => {
//     try {
//       const response = await fetch('/api/auth/google', {
//         method: 'POST'
//       });
//       if (response.ok) {
//         setIsGoogleConnected(true);
//       }
//     } catch (error) {
//       console.error('Google sign-in failed:', error);
//     }
//   };

//   const handleWalletConnect = async () => {
//     try {
//       const response = await fetch('/api/wallet/connect', {
//         method: 'POST'
//       });
//       if (response.ok) {
//         setIsWalletConnected(true);
//       }
//     } catch (error) {
//       console.error('Wallet connection failed:', error);
//     }
//   };

//   return (
//     <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8">
//       <div className="max-w-4xl mx-auto px-4">
//         <Card className="mb-8">
//           <CardContent className="pt-6">
//             <h1 className="text-3xl font-bold text-center mb-2">
//               Image Steganography
//             </h1>
//             <p className="text-center text-gray-600 mb-4">
//               Securely hide messages within images using advanced steganography techniques
//             </p>
//           </CardContent>
//         </Card>

//         <div className="mb-6 flex justify-end space-x-4">
//           <Button 
//             variant="outline" 
//             className="flex items-center gap-2"
//             onClick={handleGoogleSignIn}
//           >
//             <img src="/api/placeholder/16/16" alt="Google" className="w-4 h-4" />
//             {isGoogleConnected ? 'Connected to Google' : 'Sign in with Google'}
//           </Button>
//           <Button 
//             variant="outline" 
//             className="flex items-center gap-2"
//             onClick={handleWalletConnect}
//           >
//             <WalletConnect className="w-4 h-4" />
//             {isWalletConnected ? 'Wallet Connected' : 'Connect Petra Wallet'}
//           </Button>
//         </div>

//         <Tabs defaultValue="encrypt" className="w-full">
//           <TabsList className="grid w-full grid-cols-2">
//             <TabsTrigger value="encrypt" className="flex items-center gap-2">
//               <Lock className="w-4 h-4" />
//               Encrypt
//             </TabsTrigger>
//             <TabsTrigger value="decrypt" className="flex items-center gap-2">
//               <Unlock className="w-4 h-4" />
//               Decrypt
//             </TabsTrigger>
//           </TabsList>

//           <TabsContent value="encrypt">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Encrypt Message in Image</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium">Select Image</label>
//                   <div className="flex items-center justify-center w-full">
//                     <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
//                       <div className="flex flex-col items-center justify-center pt-5 pb-6">
//                         <Image className="w-8 h-8 mb-2 text-gray-500" />
//                         <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
//                       </div>
//                       <input type="file" className="hidden" onChange={handleImageSelect} accept="image/*" />
//                     </label>
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <label className="text-sm font-medium">Message to Hide</label>
//                   <Textarea
//                     value={message}
//                     onChange={(e) => setMessage(e.target.value)}
//                     placeholder="Enter your secret message here..."
//                     className="min-h-[100px]"
//                   />
//                 </div>

//                 <Button 
//                   onClick={handleEncrypt} 
//                   disabled={!selectedImage || !message || loading}
//                   className="w-full"
//                 >
//                   {loading ? (
//                     <>
//                       <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                       Encrypting...
//                     </>
//                   ) : (
//                     <>
//                       <Lock className="w-4 h-4 mr-2" />
//                       Encrypt Message
//                     </>
//                   )}
//                 </Button>

//                 {encryptedImageUrl && (
//                   <div className="space-y-4">
//                     <div className="relative aspect-video w-full overflow-hidden rounded-lg">
//                       <img
//                         src={encryptedImageUrl}
//                         alt="Encrypted"
//                         className="object-contain w-full h-full"
//                       />
//                     </div>
//                     <Button 
//                       onClick={handleDownload}
//                       className="w-full"
//                       variant="outline"
//                     >
//                       <Download className="w-4 h-4 mr-2" />
//                       Download Encrypted Image
//                     </Button>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           </TabsContent>

//           <TabsContent value="decrypt">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Decrypt Message from Image</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium">Select Encrypted Image</label>
//                   <div className="flex items-center justify-center w-full">
//                     <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
//                       <div className="flex flex-col items-center justify-center pt-5 pb-6">
//                         <Image className="w-8 h-8 mb-2 text-gray-500" />
//                         <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
//                       </div>
//                       <input type="file" className="hidden" onChange={handleImageSelect} accept="image/*" />
//                     </label>
//                   </div>
//                 </div>

//                 <Button 
//                   onClick={handleDecrypt} 
//                   disabled={!selectedImage || loading}
//                   className="w-full"
//                 >
//                   {loading ? (
//                     <>
//                       <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                       Decrypting...
//                     </>
//                   ) : (
//                     <>
//                       <Unlock className="w-4 h-4 mr-2" />
//                       Decrypt Message
//                     </>
//                   )}
//                 </Button>

//                 {decryptedMessage && (
//                   <div className="space-y-2">
//                     <label className="text-sm font-medium">Decrypted Message</label>
//                     <div className="p-4 rounded-lg bg-gray-50">
//                       <p className="text-gray-700">{decryptedMessage}</p>
//                     </div>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           </TabsContent>
//         </Tabs>
//       </div>
//     </main>
//   );
// }