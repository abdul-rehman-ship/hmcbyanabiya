export const uploadToCloudinary = async (file: File): Promise<any> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  
  if (!uploadPreset) {
    throw new Error('Cloudinary upload preset is not configured');
  }
  
  formData.append('upload_preset', uploadPreset);

  try {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    
    if (!cloudName) {
      throw new Error('Cloudinary cloud name is not configured');
    }

    console.log('Uploading to Cloudinary:', cloudName, uploadPreset);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Cloudinary Error:', errorText);
      throw new Error(`Upload failed: ${response.status}`);
    }

    const result = await response.json();
    console.log('Upload Success:', result.secure_url);
    return result;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

export const uploadMultipleImages = async (files: File[]): Promise<string[]> => {
  try {
    const uploadPromises = files.map(file => uploadToCloudinary(file));
    const results = await Promise.all(uploadPromises);
    return results.map(result => result.secure_url);
  } catch (error) {
    console.error('Multiple upload error:', error);
    throw error;
  }
};

// FIXED: Proper image optimization
export const getOptimizedImageUrl = (
  url: string,
  width: number = 800
): string => {
  if (!url || !url.includes('res.cloudinary.com')) return url;

  try {
    const cloudinaryPattern =
      /https:\/\/res\.cloudinary\.com\/([^/]+)\/image\/upload\/(.+)/;

    const match = url.match(cloudinaryPattern);

    if (!match) return url;

    const cloudName = match[1];
    const restPath = match[2];

    const transformations = `w_${width},q_auto,f_auto`;

    return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}/${restPath}`;
  } catch {
    return url;
  }
};
