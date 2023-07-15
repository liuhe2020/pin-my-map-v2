'use client';

import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import type { NewPin, UploadImage } from './types';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from './ui/calendar';
import { format } from 'date-fns';
import { Textarea } from './ui/textarea';
import { useCallback, useState } from 'react';
import { useDropzone, type FileWithPath } from 'react-dropzone';
import Image from 'next/image';
import { AiFillMinusCircle, AiOutlineClose } from 'react-icons/ai';

const formSchema = z.object({
  location: z.string().min(2, {
    message: 'Minimum 2 characters.',
  }),
  city: z.string(),
  region: z.string(),
  country: z.string(),
  date: z.date().optional(),
  description: z.string().optional(),
  photos: z.string().optional(),
});

export default function AddPin({ newPin }: { newPin: NewPin }) {
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
      photos: '',
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

  console.log(files);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
    accept: {
      'image/*': [],
    },
  });

  const handleRemovePhoto = (preview: string) => {
    const filteredFiles = files.filter((i) => i.preview !== preview);
    setFiles(filteredFiles);
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

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
                      <Button variant={'outline'} className={cn('pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>
                        {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                        <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
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
          {/* <FormField
            control={form.control}
            name='photos'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Photos</FormLabel>
                <FormControl>
                  <Input type='file' multiple {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}
          <div className=''>
            <p className='text-sm font-medium'>Photos</p>
            <div {...getRootProps()} className='border border-dashed border-input rounded-md min-h-[120px] mt-2'>
              {/* <input {...getInputProps()} /> */}
              {/* <p>Drag & drop here</p>
            <svg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 24 24'>
              <path d='M19.479 10.092c-.212-3.951-3.473-7.092-7.479-7.092-4.005 0-7.267 3.141-7.479 7.092-2.57.463-4.521 2.706-4.521 5.408 0 3.037 2.463 5.5 5.5 5.5h13c3.037 0 5.5-2.463 5.5-5.5 0-2.702-1.951-4.945-4.521-5.408zm-7.479-1.092l4 4h-3v4h-2v-4h-3l4-4z' />
            </svg> */}
              <div className='grid grid-cols-3 p-6 gap-6'>
                {files.map((file) => (
                  <div key={file.preview} className='relative'>
                    <div className='relative'>
                      <Image
                        src={file.preview}
                        alt={file.name}
                        width={120}
                        height={120}
                        className='aspect-square object-cover'
                        // Revoke data uri after image is loaded
                        onLoad={() => {
                          URL.revokeObjectURL(file.preview);
                        }}
                      />
                    </div>
                    <AiFillMinusCircle
                      className='absolute -top-[13px] -right-3 w-6 h-6 cursor-pointer transition-transform duration-150 hover:scale-110'
                      onClick={() => handleRemovePhoto(file.preview)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <Button type='submit'>Submit</Button>
        </form>
      </Form>
    </div>
  );
}
