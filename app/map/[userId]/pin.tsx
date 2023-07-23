import { pinAtom } from '@/lib/atoms';
import { useAtom } from 'jotai';
import Image from 'next/image';
import { Lightbox } from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

export default function Pin() {
  const [pin] = useAtom(pinAtom);

  return (
    <div className='space-y-6 text-sm font-medium'>
      <div className='space-y-2'>
        <h2>Location</h2>
        <p className=''>{pin?.location}</p>
      </div>
      <div className='space-y-2'>
        <h2>City</h2>
        <p className=''>{pin?.city}</p>
      </div>
      <div className='space-y-2'>
        <h2>Region</h2>
        <p className=''>{pin?.region}</p>
      </div>
      <div className='space-y-2'>
        <h2>Country</h2>
        <p className=''>{pin?.country}</p>
      </div>
      <div className='space-y-2'>
        <h2>Date</h2>
        <p className=''>{pin?.date?.toISOString().substring(0, 10)}</p>
      </div>
      <div className='space-y-2'>
        <h2>Description</h2>
        <p className=''>{pin?.description}</p>
      </div>
      <div className='space-y-2'>
        <h2>Photos</h2>
        <div className='grid grid-cols-3 gap-2'>
          {pin?.photos.map((photo) => (
            <Image key={photo.id} src={photo.url} alt={pin.location} width={140} height={140} className='aspect-square object-cover cursor-pointer' />
          ))}
        </div>
      </div>
      <Lightbox open={true} slides={pin?.photos.map((photo) => ({ src: photo.url }))} />
    </div>
  );
}
