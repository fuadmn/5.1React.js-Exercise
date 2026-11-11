import { v4 as uuidv4 } from 'uuid'
import supabase from './supabase';

export const uploadImage = async (file, userId, bucket = 'featured-image') => {
    try {
        if (!file) {
            throw new Error('No image selected to upload.')
        }

        const fileExt = file.name.includes('.') ? file.name.split('.').pop().toLowerCase() : 'jpg'
        const filename = `${uuidv4()}.${fileExt}`
        const filePath = `${userId}/${filename}`

        const { error } = await supabase.storage
            .from(bucket)
            .upload(filePath, file, {
                contentType: file.type || 'application/octet-stream',
                cacheControl: '3600',
                upsert: true,
            })

        if (error) throw error

        const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filePath)

        return {
            path: filePath,
            url: urlData.publicUrl,
        }
    } catch (error) {
        console.error('Error uploading image:', error)
        throw error
    }
}