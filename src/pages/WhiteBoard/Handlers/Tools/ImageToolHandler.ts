import { v4 as uuidv4 } from 'uuid';
import { WhiteboardObject } from '../../Types/WhiteboardTypes';

interface ImageToolOptions {
  objects: WhiteboardObject[];
  setObjects: React.Dispatch<React.SetStateAction<WhiteboardObject[]>>;
  setSelectedShapeId?: React.Dispatch<React.SetStateAction<string | null>>;
  setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ImageToolHandler = {
  /**
   * Triggers file selection dialog for uploading images
   */
  onActivate: (
    e: React.MouseEvent,
    options: ImageToolOptions
  ) => {
    // Create a hidden file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    
    // Handle file selection
    fileInput.onchange = (event) => {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];
      
      if (file) {
        // Set loading state if available
        if (options.setIsLoading) {
          options.setIsLoading(true);
        }
        
        // Read the selected file
        const reader = new FileReader();
        
        // Set up error handling
        reader.onerror = () => {
          if (options.setIsLoading) {
            options.setIsLoading(false);
          }
          console.error('Error reading file');
          // Could add toast notification here
        };
        
        reader.onload = (loadEvent) => {
          // Get cursor position for image placement
          const imageX = e.clientX;
          const imageY = e.clientY;
          
          // Create an Image object to get natural dimensions
          const img = new Image();
          img.onload = () => {
            // Calculate aspect ratio preserving dimensions
            const aspectRatio = img.naturalWidth / img.naturalHeight;
            const maxSize = 500; // Maximum initial dimension
            
            let width = img.naturalWidth;
            let height = img.naturalHeight;
            
            // Scale down large images
            if (width > maxSize || height > maxSize) {
              if (width > height) {
                width = maxSize;
                height = width / aspectRatio;
              } else {
                height = maxSize;
                width = height * aspectRatio;
              }
            }
            
            // Create new image object with proper dimensions
            const newImage: WhiteboardObject = {
              id: uuidv4(),
              type: 'image',
              x: imageX,
              y: imageY,
              src: loadEvent.target?.result as string,
              width: width,
              height: height,
              alt: file.name || 'Uploaded image',
              isSelected: true
            };
            
            // Add new image to objects array
            options.setObjects(prev => [...prev, newImage]);

            
            // Select the newly added image for immediate resizing if needed
            if (options.setSelectedShapeId) {
              options.setSelectedShapeId(newImage.id);
            }
            
            // Clear loading state
            if (options.setIsLoading) {
              options.setIsLoading(false);
            }
          };
          
          img.onerror = () => {
            if (options.setIsLoading) {
              options.setIsLoading(false);
            }
            console.error('Error loading image');
          };
          
          img.src = loadEvent.target?.result as string;
        };
        
        reader.readAsDataURL(file);
      }
      
      // Remove the file input from DOM
      document.body.removeChild(fileInput);
    };
    
    // Add to DOM and trigger click
    document.body.appendChild(fileInput);
    fileInput.click();
  },
  /**
 * Maintains aspect ratio during image resize
 */
maintainAspectRatio: (
    originalWidth: number,
  originalHeight: number,
  newWidth: number,
  newHeight: number,
  preserveAspectRatio: boolean = true
) : {width: number, height: number } => {
    if (!preserveAspectRatio) {
        return { width: newWidth, height: newHeight };
      }
      const aspectRatio = originalWidth / originalHeight;

        // Determine which dimension is controlling the resize
  const isWidthControlling = Math.abs(newWidth / originalWidth) > Math.abs(newHeight / originalHeight);

  if (isWidthControlling) {
    // Width is controlling, adjust height to maintain ratio
    return {
      width: newWidth,
      height: newWidth / aspectRatio
    };
  } else {
    // Height is controlling, adjust width to maintain ratio
    return {
      width: newHeight * aspectRatio,
      height: newHeight
    };
  }
},
  /**
   * Select/deselect an image
   */
  selectImage: (
    id: string,
    options: ImageToolOptions
  ) => {
    const updatedObjects = options.objects.map(obj => {
      if (obj.id === id && obj.type === 'image') {
        return { ...obj, isSelected: true };
      } else if ('isSelected' in obj && obj.isSelected) {
        return { ...obj, isSelected: false };
      }
      return obj;
    });
    
    options.setObjects(updatedObjects);
    if (options.setSelectedShapeId) {
      options.setSelectedShapeId(id);
    }
  },
  
  /**
   * Move image to new position
   */
  moveImage: (
    id: string,
    newX: number,
    newY: number,
    options: ImageToolOptions
  ) => {
    const updatedObjects = options.objects.map(obj => {
      if (obj.id === id && obj.type === 'image') {
        return { ...obj, x: newX, y: newY };
      }
      return obj;
    });
    
    options.setObjects(updatedObjects);
  },
  
  /**
   * Resize image
   */
  resizeImage: (
    id: string,
    newWidth: number,
    newHeight: number,
    options: ImageToolOptions
  ) => {
    const updatedObjects = options.objects.map(obj => {
      if (obj.id === id && obj.type === 'image') {
        return { ...obj, width: newWidth, height: newHeight };
      }
      return obj;
    });
    
    options.setObjects(updatedObjects);
  },
  
  /**
   * Handle deletion of image
   */
  deleteImage: (
    id: string,
    options: ImageToolOptions
  ) => {
    const updatedObjects = options.objects.filter(obj => obj.id !== id);
    options.setObjects(updatedObjects);
    
    if (options.setSelectedShapeId) {
      options.setSelectedShapeId(null);
    }
  }
};

export default ImageToolHandler;