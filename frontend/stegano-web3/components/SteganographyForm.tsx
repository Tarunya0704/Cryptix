// 'use client'

// import { useState } from 'react'
// import { useWallet } from '@aptos-labs/wallet-adapter-react'
// import { Types } from 'aptos'
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
// import { Download, Upload, Lock, Unlock } from 'lucide-react'

// interface SteganographyFormProps {}

// export default function SteganographyForm({}: SteganographyFormProps) {
//   const { account, signAndSubmitTransaction } = useWallet()
//   const [selectedImage, setSelectedImage] = useState<File | null>(null)
//   const [message, setMessage] = useState('')
//   const [decryptedMessage, setDecryptedMessage] = useState('')
//   const [encryptedImageUrl, setEncryptedImageUrl] = useState('')
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState<string | null>(null)

//   //smart contract addresss 
//   const [contractAddress, setContractAddress] = useState('7e72f7e4e1ab85ba5d2f5ad0e56c2599651652ef770ba84c6823ef80e4ae3114')



//   const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setSelectedImage(e.target.files[0])
//       setError(null)
//     }
//   }

//   const handleEncrypt = async () => {
//     if (!selectedImage || !message) {
//       setError('Please select an image and enter a message.')
//       return
//     }

//     try {
//       setLoading(true)
//       setError(null)
//       const formData = new FormData()
//       formData.append('image', selectedImage)
//       formData.append('message', message)

//       const response = await fetch('/api/encrypt', {
//         method: 'POST',
//         body: formData,
//       })

//       if (!response.ok) throw new Error('Encryption failed')

//       const blob = await response.blob()
//       const imageUrl = URL.createObjectURL(blob)
//       setEncryptedImageUrl(imageUrl)

//       if (account?.address) {
//         const imageHash = await calculateImageHash(blob)
//         await storeImageMetadata(imageHash, true)
//       }
//     } catch (error) {
//       console.error('Error:', error)
//       setError('Failed to encrypt the message. Please try again.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleDecrypt = async () => {
//     if (!selectedImage) {
//       setError('Please select an image to decrypt.')
//       return
//     }

//     try {
//       setLoading(true)
//       setError(null)
//       const formData = new FormData()
//       formData.append('image', selectedImage)

//       const response = await fetch('/api/decrypt', {
//         method: 'POST',
//         body: formData,
//       })

//       if (!response.ok) throw new Error('Decryption failed')

//       const data = await response.json()
//       setDecryptedMessage(data.message)
//     } catch (error) {
//       console.error('Error:', error)
//       setError('Failed to decrypt the message. Please ensure the image contains a hidden message.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const calculateImageHash = async (blob: Blob): Promise<string> => {
//     const arrayBuffer = await blob.arrayBuffer()
//     const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer)
//     const hashArray = Array.from(new Uint8Array(hashBuffer))
//     return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
//   }

//   const storeImageMetadata = async (imageHash: string, hasHiddenMessage: boolean) => {
//     if (!account?.address) return

//     try {
//       const payload: Types.TransactionPayload = {
//         type: "entry_function_payload",
//         function: "steganography_contract::image_store::store_image",
//         type_arguments: [],
//         arguments: [imageHash, hasHiddenMessage]
//       }

//       await signAndSubmitTransaction(payload)
//     } catch (error) {
//       console.error('Failed to store metadata:', error)
//       setError('Failed to store image metadata on the blockchain.')
//     }
//   }

//   const handleDownloadEncryptedImage = () => {
//     if (encryptedImageUrl) {
//       const link = document.createElement('a')
//       link.href = encryptedImageUrl
//       link.download = 'encrypted-image.png'
//       document.body.appendChild(link)
//       link.click()
//       document.body.removeChild(link)
//     }
//   }

//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg shadow-lg">
//       {account?.address && (
//         <Card className="mb-6">
//           <CardContent className="p-4">
//             <p className="text-sm text-muted-foreground">
//               Connected Wallet: {account.address.substring(0, 6)}...
//               {account.address.substring(account.address.length - 4)}
//             </p>
//           </CardContent>
//         </Card>
//       )}

//       <Tabs defaultValue="encrypt" className="w-full">
//         <TabsList className="grid w-full grid-cols-2 mb-6">
//           <TabsTrigger value="encrypt">Encrypt Message</TabsTrigger>
//           <TabsTrigger value="decrypt">Decrypt Message</TabsTrigger>
//         </TabsList>

//         <TabsContent value="encrypt">
//           <Card className="bg-white bg-opacity-80">
//             <CardHeader>
//               <CardTitle className="font-bold text-xl">Encrypt Message in Image</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               <div>
//                 <label className="block text-sm font-medium mb-2" htmlFor="encrypt-image-upload">
//                   Select Image
//                 </label>
//                 <Input
//                   id="encrypt-image-upload"
//                   type="file"
//                   accept="image/*"
//                   onChange={handleImageSelect}
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-2" htmlFor="encrypt-message">
//                   Message to Hide
//                 </label>
//                 <Textarea
//                   id="encrypt-message"
//                   value={message}
//                   onChange={(e) => setMessage(e.target.value)}
//                   placeholder="Enter message to encrypt"
//                   rows={4}
//                 />
//               </div>

//               <Button
//                 onClick={handleEncrypt}
//                 disabled={!selectedImage || !message || loading}
//                 className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
//               >
//                 {loading ? 'Processing...' : 'Encrypt Message'}
//                 <Lock className="ml-2 h-4 w-4" />
//               </Button>
//               <Button
//                 onClick={() => {
//                   setSelectedImage(null);
//                   setMessage('');
//                 }}
//                 variant="outline"
//                 className="w-full mt-2"
//               >
//                 Clear Fields
//                 <Upload className="ml-2 h-4 w-4" />
//               </Button>

//               {encryptedImageUrl && (
//                 <div className="mt-6 space-y-4">
//                   <div className="flex items-center justify-between">
//                     <h3 className="text-lg font-medium">Encrypted Image:</h3>
//                     <Button onClick={handleDownloadEncryptedImage} variant="outline">
//                       <Download className="mr-2 h-4 w-4" />
//                       Download
//                     </Button>
//                   </div>
//                   <div className="relative h-64 w-full border rounded-lg overflow-hidden">
//                     <img
//                       src={encryptedImageUrl}
//                       alt="Encrypted"
//                       className="w-full h-full object-contain"
//                     />
//                   </div>
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="decrypt">
//           <Card className="bg-white bg-opacity-80">
//             <CardHeader>
//               <CardTitle className="font-bold text-xl">Decrypt Hidden Message</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               <div>
//                 <label className="block text-sm font-medium mb-2" htmlFor="decrypt-image-upload">
//                   Select Encrypted Image
//                 </label>
//                 <Input
//                   id="decrypt-image-upload"
//                   type="file"
//                   accept="image/*"
//                   onChange={handleImageSelect}
//                 />
//               </div>

//               <Button
//                 onClick={handleDecrypt}
//                 disabled={!selectedImage || loading}
//                 className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
//               >
//                 {loading ? 'Processing...' : 'Decrypt Message'}
//                 <Unlock className="ml-2 h-4 w-4" />
//               </Button>
//               <Button
//                 onClick={() => {
//                   setSelectedImage(null);
//                   setDecryptedMessage('');
//                 }}
//                 variant="outline"
//                 className="w-full mt-2"
//               >
//                 Clear Fields
//                 <Upload className="ml-2 h-4 w-4" />
//               </Button>

//               {decryptedMessage && (
//                 <div className="mt-6">
//                   <h3 className="text-lg font-medium mb-2">Decrypted Message:</h3>
//                   <div className="bg-muted rounded-md p-4">
//                     <p>{decryptedMessage}</p>
//                   </div>
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>

//       {error && (
//         <Alert variant="destructive" className="mt-6">
//           <AlertTitle>Error</AlertTitle>
//           <AlertDescription>{error}</AlertDescription>
//         </Alert>
//       )}
//     </div>
//   )
// }

'use client'

import { useState } from 'react'
import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { Types } from 'aptos'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Download, Upload, Lock, Unlock } from 'lucide-react'

interface SteganographyFormProps {}

export default function SteganographyForm({}: SteganographyFormProps) {
  const { account, signAndSubmitTransaction } = useWallet()
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [message, setMessage] = useState('')
  const [decryptedMessage, setDecryptedMessage] = useState('')
  const [encryptedImageUrl, setEncryptedImageUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [txHash, setTxHash] = useState<string | null>(null)

  // Make sure this matches your deployed module address
  const moduleAddress = '0x7e72f7e4e1ab85ba5d2f5ad0e56c2599651652ef770ba84c6823ef80e4ae3114'

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0])
      setError(null)
    }
  }

  const calculateImageHash = async (blob: Blob): Promise<string> => {
    try {
      const arrayBuffer = await blob.arrayBuffer()
      const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 64)
    } catch (error) {
      console.error('Error calculating image hash:', error)
      throw new Error('Failed to calculate image hash')
    }
  }

  const storeImageMetadata = async (imageHash: string, hasHiddenMessage: boolean) => {
    if (!account?.address) {
      setError('Please connect your wallet first')
      return false
    }

    try {
      setLoading(true)
      console.log('Starting metadata storage process...')
      setError('Preparing transaction...')

      // Log transaction details for debugging
      console.log('Transaction preparation:', {
        moduleAddress,
        imageHash,
        hasHiddenMessage
      })

      // Validate imageHash format
      if (!imageHash || imageHash.length !== 64) {
        throw new Error('Invalid image hash format')
      }

      // Format transaction payload
      const payload: Types.TransactionPayload = {
        type: "entry_function_payload",
        function: `${moduleAddress}::contract::store_image_data`,
        type_arguments: [],
        arguments: [
          imageHash,
          hasHiddenMessage
        ]
      }

      console.log('Submitting transaction with payload:', payload)

      // Submit transaction
      const transaction = await signAndSubmitTransaction(payload)
      console.log('Transaction submitted:', transaction)
      setTxHash(transaction.hash)

      // Wait for transaction confirmation
      setError('Transaction submitted. Waiting for confirmation...')
      await new Promise(resolve => setTimeout(resolve, 8000))

      try {
        // Verify transaction status
        const txCheckResponse = await fetch(
          `https://fullnode.mainnet.aptoslabs.com/v1/transactions/by_hash/${transaction.hash}`
        )

        if (!txCheckResponse.ok) {
          throw new Error('Failed to verify transaction status')
        }

        const txData = await txCheckResponse.json()
        console.log('Transaction verification response:', txData)

        if (txData.success) {
          setError('Image metadata successfully stored on blockchain!')
          return true
        } else {
          throw new Error(txData.vm_status || 'Transaction failed on chain')
        }
      } catch (verifyError) {
        console.error('Error verifying transaction:', verifyError)
        setError('Unable to verify transaction status. Please check your wallet.')
        return false
      }

    } catch (error: any) {
      console.error('Detailed transaction error:', error)
      
      if (error instanceof Error) {
        if (error.message.includes('insufficient balance')) {
          setError('Insufficient APT balance. Please fund your wallet.')
        } else if (error.message.includes('unauthorized')) {
          setError('Unauthorized. Please check wallet connection.')
        } else if (error.message.includes('Invalid image hash')) {
          setError('Invalid image hash format. Please try again.')
        } else if (error.message.includes('rejected')) {
          setError('Transaction rejected by wallet. Please try again.')
        } else if (error.message.includes('user rejected')) {
          setError('Transaction was cancelled by user.')
        } else {
          setError(`Transaction error: ${error.message}`)
        }
      } else {
        setError('An unexpected error occurred. Please check console for details.')
      }
      return false
    } finally {
      setLoading(false)
    }
  }

  const handleEncrypt = async () => {
    if (!selectedImage || !message) {
      setError('Please select an image and enter a message.')
      return
    }

    try {
      setLoading(true)
      setError(null)
      console.log('Starting encryption process...')

      const formData = new FormData()
      formData.append('image', selectedImage)
      formData.append('message', message)

      console.log('Sending encryption request...')
      const response = await fetch('/api/encrypt', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Encryption failed')
      }

      const blob = await response.blob()
      const imageUrl = URL.createObjectURL(blob)
      setEncryptedImageUrl(imageUrl)

      if (account?.address) {
        console.log('Calculating image hash...')
        const imageHash = await calculateImageHash(blob)
        console.log('Image hash calculated:', imageHash)
        
        const success = await storeImageMetadata(imageHash, true)
        if (!success) {
          console.log('Metadata storage failed but encryption completed')
        }
      }
    } catch (error) {
      console.error('Encryption error:', error)
      setError('Failed to encrypt the message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDecrypt = async () => {
    if (!selectedImage) {
      setError('Please select an image to decrypt.')
      return
    }

    try {
      setLoading(true)
      setError(null)
      console.log('Starting decryption process...')

      const formData = new FormData()
      formData.append('image', selectedImage)

      const response = await fetch('/api/decrypt', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Decryption failed')
      }

      const data = await response.json()
      setDecryptedMessage(data.message)
    } catch (error) {
      console.error('Decryption error:', error)
      setError('Failed to decrypt the message. Please ensure the image contains a hidden message.')
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadEncryptedImage = () => {
    if (encryptedImageUrl) {
      const link = document.createElement('a')
      link.href = encryptedImageUrl
      link.download = 'encrypted-image.png'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg shadow-lg">
      {account?.address && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">
              Connected Wallet: {account.address.substring(0, 6)}...
              {account.address.substring(account.address.length - 4)}
            </p>
            {txHash && (
              <p className="text-sm text-muted-foreground mt-2">
                Last Transaction: {txHash.substring(0, 6)}...
                {txHash.substring(txHash.length - 4)}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="encrypt" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="encrypt">Encrypt Message</TabsTrigger>
          <TabsTrigger value="decrypt">Decrypt Message</TabsTrigger>
        </TabsList>

        <TabsContent value="encrypt">
          <Card className="bg-white bg-opacity-80">
            <CardHeader>
              <CardTitle className="font-bold text-xl">Encrypt Message in Image</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="encrypt-image-upload">
                  Select Image
                </label>
                <Input
                  id="encrypt-image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="encrypt-message">
                  Message to Hide
                </label>
                <Textarea
                  id="encrypt-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter message to encrypt"
                  rows={4}
                />
              </div>

              <Button
                onClick={handleEncrypt}
                disabled={!selectedImage || !message || loading}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
              >
                {loading ? 'Processing...' : 'Encrypt Message'}
                <Lock className="ml-2 h-4 w-4" />
              </Button>

              <Button
                onClick={() => {
                  setSelectedImage(null);
                  setMessage('');
                }}
                variant="outline"
                className="w-full mt-2"
              >
                Clear Fields
                <Upload className="ml-2 h-4 w-4" />
              </Button>

              {encryptedImageUrl && (
                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Encrypted Image:</h3>
                    <Button onClick={handleDownloadEncryptedImage} variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                  <div className="relative h-64 w-full border rounded-lg overflow-hidden">
                    <img
                      src={encryptedImageUrl}
                      alt="Encrypted"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="decrypt">
          <Card className="bg-white bg-opacity-80">
            <CardHeader>
              <CardTitle className="font-bold text-xl">Decrypt Hidden Message</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="decrypt-image-upload">
                  Select Encrypted Image
                </label>
                <Input
                  id="decrypt-image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                />
              </div>

              <Button
                onClick={handleDecrypt}
                disabled={!selectedImage || loading}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
              >
                {loading ? 'Processing...' : 'Decrypt Message'}
                <Unlock className="ml-2 h-4 w-4" />
              </Button>

              <Button
                onClick={() => {
                  setSelectedImage(null);
                  setDecryptedMessage('');
                }}
                variant="outline"
                className="w-full mt-2"
              >
                Clear Fields
                <Upload className="ml-2 h-4 w-4" />
              </Button>

              {decryptedMessage && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">Decrypted Message:</h3>
                  <div className="bg-muted rounded-md p-4">
                    <p>{decryptedMessage}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {error && (
        <Alert variant={error.includes('successfully') ? 'default' : 'destructive'} className="mt-6">
          <AlertTitle>{error.includes('successfully') ? 'Success' : 'Error'}</AlertTitle>
          <AlertDescription>
            {error}
            {txHash && error.includes('submitted') && (
              <p className="mt-2">
                Transaction Hash: {txHash}
              </p>
            )}
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}