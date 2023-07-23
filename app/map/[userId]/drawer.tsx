import { Pin } from '@/components/types';
import CurrentPin from './currentPin';

export default function Drawer({ currentPin }: { currentPin: Pin }) {
  return (
    <div className='p-4 sm:px-6'>
      <CurrentPin />
    </div>
  );
}
