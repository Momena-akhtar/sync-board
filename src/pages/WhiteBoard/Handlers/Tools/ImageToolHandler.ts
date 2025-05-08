import { v4 as uuidv4 } from 'uuid';
import { WhiteboardObject, ImageObject } from '../../Types/WhiteboardTypes';

// Type guard for ImageObject
const isImageObject = (obj: WhiteboardObject): obj is ImageObject => {
  return obj.type === 'image';
};

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
    
    // Get the canvas element and its scroll position
    const canvas = e.currentTarget as HTMLElement;
    const rect = canvas.getBoundingClientRect();
    const scrollLeft = canvas.scrollLeft;
    const scrollTop = canvas.scrollTop;
    
    // Calculate center of viewport
    const viewportWidth = canvas.clientWidth;
    const viewportHeight = canvas.clientHeight;
    const centerX = viewportWidth / 2 + scrollLeft;
    const centerY = viewportHeight / 2 + scrollTop;
    
    // Handle file selection
    fileInput.onchange = (event) => {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];
      
      if (file) {
        if (options.setIsLoading) {
          options.setIsLoading(true);
        }
        
        const reader = new FileReader();
        
        reader.onerror = () => {
          if (options.setIsLoading) {
            options.setIsLoading(false);
          }
          console.error('Error reading file');
        };
        
        reader.onload = (loadEvent) => {
          const img = new Image();
          img.onload = () => {
            // Calculate aspect ratio preserving dimensions
            const aspectRatio = img.naturalWidth / img.naturalHeight;
            const maxSize = 300; // Maximum size for better usability
            
            let width = img.naturalWidth;
            let height = img.naturalHeight;
            
            // Scale down large images while maintaining aspect ratio
            if (width > maxSize || height > maxSize) {
              if (width > height) {
                width = maxSize;
                height = width / aspectRatio;
              } else {
                height = maxSize;
                width = height * aspectRatio;
              }
            }
            
            // Position image at the center of the viewport
            const imageX = centerX - (width / 2);
            const imageY = centerY - (height / 2);
            
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
              isSelected: true,
              isDragging: false,
              dragOffset: { x: 0, y: 0 }
            };
            
            options.setObjects(prev => [...prev, newImage]);
            
            if (options.setSelectedShapeId) {
              options.setSelectedShapeId(newImage.id);
            }
            
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
      
      document.body.removeChild(fileInput);
    };
    
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
      if (obj.id === id && isImageObject(obj)) {
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
  },

  /**
   * Start dragging an image
   */
  startDragging: (
    id: string,
    e: React.MouseEvent,
    options: ImageToolOptions
  ) => {
    const image = options.objects.find(obj => obj.id === id);
    if (!image || !isImageObject(image)) return;

    const updatedObjects = options.objects.map(obj => {
      if (obj.id === id && isImageObject(obj)) {
        return {
          ...obj,
          isDragging: true,
          dragOffset: {
            x: e.clientX - obj.x,
            y: e.clientY - obj.y
          }
        };
      }
      return obj;
    });

    options.setObjects(updatedObjects);
  },

  /**
   * Handle dragging of image
   */
  handleDrag: (
    id: string,
    e: React.MouseEvent,
    options: ImageToolOptions
  ) => {
    const image = options.objects.find(obj => obj.id === id);
    if (!image || !isImageObject(image) || !image.isDragging) return;

    const canvas = e.currentTarget as HTMLElement;
    const scrollLeft = canvas.scrollLeft;
    const scrollTop = canvas.scrollTop;

    const updatedObjects = options.objects.map(obj => {
      if (obj.id === id && isImageObject(obj) && obj.dragOffset) {
        return {
          ...obj,
          x: e.clientX - obj.dragOffset.x + scrollLeft,
          y: e.clientY - obj.dragOffset.y + scrollTop
        };
      }
      return obj;
    });

    options.setObjects(updatedObjects);
  },

  /**
   * Stop dragging an image
   */
  stopDragging: (
    id: string,
    options: ImageToolOptions
  ) => {
    const updatedObjects = options.objects.map(obj => {
      if (obj.id === id && isImageObject(obj)) {
        return {
          ...obj,
          isDragging: false
        };
      }
      return obj;
    });

    options.setObjects(updatedObjects);
  }
};

export default ImageToolHandler;