'use client';

import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import type { PinDetails } from '../../../components/types';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '../../../components/ui/calendar';
import { format } from 'date-fns';
import { Textarea } from '../../../components/ui/textarea';
import { MouseEvent, useCallback, useState } from 'react';
import { useDropzone, type FileWithPath } from 'react-dropzone';
import Image from 'next/image';
import { AiFillMinusCircle, AiOutlineClose } from 'react-icons/ai';
import { BiSolidCloudUpload } from 'react-icons/bi';
import { useSession } from 'next-auth/react';

const formSchema = z.object({
  location: z.string().min(2, {
    message: 'Minimum 2 characters.',
  }),
  city: z.string(),
  region: z.string(),
  country: z.string(),
  date: z.date().optional(),
  description: z.string().optional(),
});

export default function AddPin({ newPin }: { newPin: PinDetails }) {
  const { data: session } = useSession();
  const [files, setFiles] = useState<(FileWithPath & { preview: string })[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: newPin.location,
      city: newPin.city,
      region: newPin.region,
      country: newPin.country,
      date: undefined,
      description: '',
    },
  });

  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    const addition = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );
    setFiles((prev) => [...prev, ...addition]);
  }, []);

  const { getRootProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': [],
    },
  });

  const handleRemovePhoto = (e: MouseEvent, preview: string) => {
    e.stopPropagation();
    const filteredFiles = files.filter((i) => i.preview !== preview);
    setFiles(filteredFiles);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // console.log(values);
    const sigResponse = await fetch('/api/cloudinary-signature');
    if (sigResponse.status !== 200) alert('failed');
    const { signature, timestamp } = await sigResponse.json();

    const formData = new FormData();

    let photosData: { id: string; url: string }[] = [];

    if (files.length) {
      const uploadFiles = files.map(async (file) => {
        formData.append('file', file);
        formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!);
        formData.append('signature', signature);
        formData.append('timestamp', timestamp);
        formData.append('folder', 'pin-my-map');
        const response = await fetch('https://api.cloudinary.com/v1_1/pin-my-map/image/upload', {
          method: 'POST',
          body: formData,
        });
        return response.json();
      });

      const photos = await Promise.all(uploadFiles);
      photosData = photos.map((photo) => ({ id: photo.public_id, url: photo.secure_url }));
    }

    const createPinResponse = await fetch('/api/create-pin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ pin: { ...values, latitude: newPin.latitude, longitude: newPin.longitude }, photos: photosData }),
    });
  };

  return (
    <div className='p-4 sm:px-6'>
      <AiOutlineClose className='w-6 h-6 cursor-pointer ml-auto' />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <FormField
            control={form.control}
            name='location'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input type='text' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='city'
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input type='text' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='region'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Region</FormLabel>
                <FormControl>
                  <Input type='text' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='country'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input type='text' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='date'
            render={({ field }) => (
              <FormItem className='flex flex-col'>
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button variant={'outline'} className={cn('justify-start text-left font-normal', !field.value && 'text-muted-foreground')}>
                        <CalendarIcon className='mr-2 h-4 w-4' />
                        {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto p-0' align='start'>
                    <Calendar
                      mode='single'
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                      initialFocus
                      captionLayout='dropdown-buttons'
                      fromDate={new Date(new Date().getFullYear() - 100, new Date().getMonth(), new Date().getDate())}
                      toDate={new Date()}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea className='resize-none' {...field} rows={10} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className=''>
            <p className='text-sm font-medium'>Photos</p>
            <div {...getRootProps()} className='border border-input rounded-md mt-2 cursor-pointer'>
              <div className={cn(isDragActive && 'border-2 border-dashed border-orange-600 rounded-md', 'min-h-[160px] flex items-center justify-center m-1')}>
                {/* <input {...getInputProps()} /> */}
                {files.length > 0 && (
                  <div className={cn(isDragActive && 'bg-white/50 blur opacity-50', 'grid grid-cols-3 p-6 gap-6 transition-all duration-400')}>
                    {files.map((file) => (
                      <div key={file.preview} className='relative'>
                        <div className='relative'>
                          <Image
                            src={file.preview}
                            alt={file.name}
                            width={120}
                            height={120}
                            className='aspect-square object-cover rounded-md'
                            // Revoke data uri after image is loaded
                            onLoad={() => {
                              URL.revokeObjectURL(file.preview);
                            }}
                          />
                        </div>
                        <AiFillMinusCircle
                          className='absolute -top-3 -right-3 w-6 h-6 cursor-pointer transition-transform duration-150 hover:scale-110'
                          onClick={(e) => handleRemovePhoto(e, file.preview)}
                        />
                      </div>
                    ))}
                  </div>
                )}
                {files.length === 0 && (
                  <div className={cn(isDragActive && 'bg-white/50 blur opacity-50', 'flex flex-col items-center gap-y-2 my-auto transition-all duration-400')}>
                    <p className='text-sm font-medium'>Click to select photos, or drag and drop here</p>
                    <BiSolidCloudUpload className='w-6 h-6' />
                  </div>
                )}
              </div>
            </div>
          </div>
          <Button type='submit'>Submit</Button>
        </form>
      </Form>
    </div>
  );
}
