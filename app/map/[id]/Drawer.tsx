'use client';

import { useAtom } from 'jotai';
import { drawerAtom } from '@/lib/atoms';
import { GrClose } from 'react-icons/gr';
import PinDetails from './PinDetails';
import EditPin from './EditPin';
import CreatePin from './CreatePin';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useState } from 'react';

export default function Drawer() {
  const [drawer, setDrawer] = useAtom(drawerAtom);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const titles: { [key: string]: string } = {
    details: 'Pin Details',
    create: 'Create New Pin',
    edit: 'Edit Pin',
  };

  const handleDrawerClose = () => {
    if (drawer.state === 'details') return setDrawer((prev) => ({ ...prev, isOpen: false }));
    setIsDialogOpen(true);
  };

  return (
    <>
      <div className='p-4 sm:p-6 space-y-6'>
        <div className='flex justify-between'>
          <h2 className='grow text-xl font-medium'>{titles[drawer.state]}</h2>
          <GrClose className='w-6 h-6 cursor-pointer' onClick={handleDrawerClose} />
        </div>
        {drawer.state === 'details' && <PinDetails />}
        {drawer.state === 'create' && <CreatePin />}
        {drawer.state === 'edit' && <EditPin />}
      </div>
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>Any unsaved data on the form will be lost.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className={'w-24 font-medium'}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => setDrawer((prev) => ({ ...prev, isOpen: false }))}
              className={'text-white bg-indigo-500 hover:brightness-110 hover:bg-indigo-500 font-medium w-24 p-2.5'}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
