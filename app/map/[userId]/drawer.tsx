import Pin from './pin';
import EditPin from './editPin';
import { useAtom } from 'jotai';
import { isEditingAtom } from '@/lib/atoms';
import { AiOutlineClose } from 'react-icons/ai';

export default function Drawer() {
  const [isEditing] = useAtom(isEditingAtom);

  return (
    <div className='p-4 sm:px-6'>
      <AiOutlineClose className='w-6 h-6 cursor-pointer ml-auto' />
      {!isEditing && <Pin />}
      {isEditing && <EditPin />}
    </div>
  );
}
