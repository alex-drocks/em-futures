import { nanoid } from 'nanoid';


function generateId(): string {
    return nanoid();
}


export { generateId };

