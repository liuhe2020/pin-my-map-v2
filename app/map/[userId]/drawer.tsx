import { useAtom } from 'jotai';
import { drawerStateAtom, isDrawerOpenAtom } from '@/lib/atoms';
import { GrClose } from 'react-icons/gr';
import PinDetails from './PinDetails';
import EditPin from './EditPin';
import CreatePin from './CreatePin';

export default function Drawer() {
  const [drawerState, setDrawerState] = useAtom(drawerStateAtom);
  const [, setIsDrawerOpen] = useAtom(isDrawerOpenAtom);

  const titles: { [key: string]: string } = {
    details: 'Pin Details',
    create: 'Create New Pin',
    edit: 'Edit Pin',
  };

  const handleDrawerClose = () => {
    setDrawerState('');
    setIsDrawerOpen(false);
  };

  return (
    <div className='p-4 sm:p-6 space-y-6'>
      <div className='flex justify-between'>
        <h2 className='grow text-xl font-medium'>{titles[drawerState]}</h2>
        <GrClose className='w-6 h-6 cursor-pointer' onClick={handleDrawerClose} />
      </div>
      {drawerState === 'details' && <PinDetails />}
      {drawerState === 'create' && <CreatePin />}
      {drawerState === 'edit' && <EditPin />}
    </div>
  );
}
