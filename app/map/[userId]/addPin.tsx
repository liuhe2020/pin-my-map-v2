'use client';

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
import { useAtom } from 'jotai';
import { isAddingAtom } from '@/lib/atoms';

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
  const [files, setFiles] = useState<string[]>([]);
  const [, setIsAdding] = useAtom(isAddingAtom);

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
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const { result } = e.target as FileReader;
        if (typeof result === 'string') setFiles((prev) => [...prev, result]);
      };
    });

    // const addition = acceptedFiles.map((file) =>
    //   Object.assign(file, {
    //     preview: URL.createObjectURL(file),
    //   })
    // );
    // setFiles((prev) => [...prev, ...addition]);
  }, []);

  const { getRootProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': [],
    },
  });

  const handleRemovePhoto = (e: MouseEvent, index: number) => {
    e.stopPropagation();
    const filteredFiles = files.filter((i, idx) => idx !== index);
    setFiles(filteredFiles);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const createPinResponse = await fetch('/api/create-pin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ pin: { ...values, latitude: newPin.latitude, longitude: newPin.longitude }, files }),
    });
  };

  return (
    <div className='p-4 sm:px-6'>
      <AiOutlineClose className='w-6 h-6 cursor-pointer ml-auto' onClick={() => setIsAdding(false)} />
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
                    {files.map((file, index) => (
                      <div key={index} className='relative'>
                        <div className='relative'>
                          <Image src={file} alt='preview' width={120} height={120} className='aspect-square object-cover rounded-md' />
                        </div>
                        <AiFillMinusCircle
                          className='absolute -top-3 -right-3 w-6 h-6 cursor-pointer transition-transform duration-150 hover:scale-110'
                          onClick={(e) => handleRemovePhoto(e, index)}
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
