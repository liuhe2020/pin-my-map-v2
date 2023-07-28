import { useAtom } from 'jotai';
import { drawerStateAtom, pinAtom } from '@/lib/atoms';
import { AiOutlineClose } from 'react-icons/ai';
import Pin from './Pin';
import EditPin from './EditPin';
import CreatePin from './CreatePin';

export default function Drawer() {
  const [drawerState, setDrawerState] = useAtom(drawerStateAtom);
  const [, setPin] = useAtom(pinAtom);

  return (
    <div className='p-4 sm:px-6'>
      <AiOutlineClose className='w-6 h-6 cursor-pointer ml-auto' onClick={() => setPin(null)} />
      {drawerState === 'details' && <Pin />}
      {drawerState === 'create' && <CreatePin />}
      {drawerState === 'edit' && <EditPin />}
    </div>
  );
}
