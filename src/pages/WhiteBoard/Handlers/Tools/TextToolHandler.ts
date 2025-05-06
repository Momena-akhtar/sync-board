// src/handlers/TextToolHandler.ts
import { v4 as uuidv4 } from 'uuid';
import { WhiteboardObject } from '../../Types/WhiteboardTypes';

export const TextToolHandler = {
    onMouseDown: (e: React.MouseEvent, { objects, setObjects }: {
        objects: WhiteboardObject[];
        setObjects: React.Dispatch<React.SetStateAction<WhiteboardObject[]>>;
    }) => {
        const rect = (e.target as HTMLElement).getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const newTextObject: WhiteboardObject = {
            id: uuidv4(),
            type: 'text',
            x,
            y,
            width: 150,
            height: 40,
            content: '',
            isEditing: true,
        };

        setObjects([...objects, newTextObject]);
    },

    onChangeText: (id: string, newText: string, { objects, setObjects }: { 
        objects: WhiteboardObject[]; 
        setObjects: React.Dispatch<React.SetStateAction<WhiteboardObject[]>>;
    }) => {
        const updatedObjects = objects.map(obj => 
            obj.id === id && obj.type === 'text' ? { ...obj, content: newText } : obj
        );
        setObjects(updatedObjects);
    },

    onFinishEditing: (id: string, { objects, setObjects }: { 
        objects: WhiteboardObject[]; 
        setObjects: React.Dispatch<React.SetStateAction<WhiteboardObject[]>>;
    }) => {
        const updatedObjects = objects.map(obj => 
            obj.id === id && obj.type === 'text' ? { ...obj, isEditing: false } : obj
        );
        setObjects(updatedObjects);
    },
    
    onStartEditing: (id: string, { objects, setObjects }: { 
        objects: WhiteboardObject[]; 
        setObjects: React.Dispatch<React.SetStateAction<WhiteboardObject[]>>;
    }) => {
        const updatedObjects = objects.map(obj => 
            obj.id === id && obj.type === 'text' ? { ...obj, isEditing: true } : obj
        );
        setObjects(updatedObjects);
    }
};