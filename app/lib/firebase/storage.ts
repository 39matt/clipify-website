import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from 'firebase/storage'



import { storage } from './firebaseClient';


export const uploadCampaignImage = async (file: File) => {
  const fileExtension = file.name.split('.').pop()
  const fileName = `campaigns/${Date.now()}.${fileExtension}`
  const storageRef = ref(storage, fileName)

  const snapshot = await uploadBytes(storageRef, file)
  const downloadURL = await getDownloadURL(snapshot.ref)

  return downloadURL
}

export const deleteImageFromStorage = async (imageUrl: string) => {
  if (!imageUrl || imageUrl === '') return
  try {
    const imageRef = ref(storage, imageUrl)
    await deleteObject(imageRef)
  } catch (error) {
    console.error('Greška pri brisanju slike iz storage-a:', error)
  }
}
