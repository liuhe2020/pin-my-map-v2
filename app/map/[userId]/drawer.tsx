import { useAtom } from 'jotai';
import { drawerStateAtom, isDrawerOpenAtom } from '@/lib/atoms';
import { AiOutlineClose } from 'react-icons/ai';
import PinDetails from './PinDetails';
import EditPin from './EditPin';
import CreatePin from './CreatePin';

export default function Drawer() {
  const [drawerState, setDrawerState] = useAtom(drawerStateAtom);
  const [, setIsDrawerOpen] = useAtom(isDrawerOpenAtom);

  const handleDrawerClose = () => {
    setDrawerState('');
    setIsDrawerOpen(false);
  };

  return (
    <div className='p-4 sm:px-6'>
      <AiOutlineClose className='w-6 h-6 cursor-pointer ml-auto' onClick={handleDrawerClose} />
      {drawerState === 'details' && <PinDetails />}
      {drawerState === 'create' && <CreatePin />}
      {drawerState === 'edit' && <EditPin />}
    </div>
  );
}
