'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '../../../components/ui/calendar';
import { format } from 'date-fns';
import { Textarea } from '../../../components/ui/textarea';
import { type MouseEvent, useCallback, useState, useTransition } from 'react';
import { useDropzone, type FileWithPath } from 'react-dropzone';
import Image from 'next/image';
import { AiFillMinusCircle } from 'react-icons/ai';
import { BiSolidCloudUpload } from 'react-icons/bi';
import { useAtom } from 'jotai';
import { drawerAtom, newPinAtom } from '@/lib/atoms';
import { useQuery } from '@tanstack/react-query';
import { env } from '@/env.mjs';
import { createPinAction } from '@/app/actions';
import { formSchema } from '@/lib/formSchema';
import { useRouter } from 'next/navigation';

export default function CreatePin() {
  const [files, setFiles] = useState<string[]>([]);
  const [newPin, setNewPin] = useAtom(newPinAtom);
  const [, setDrawerState] = useAtom(drawerAtom);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const fetcher = async () => {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${newPin?.longitude},${newPin?.latitude}.json?access_token=${env.NEXT_PUBLIC_MAPBOX}`
    );
    return await response.json();
  };

  const { data, isLoading: isNewPinLoading } = useQuery(['place'], fetcher, {
    onSuccess: (place) => {
      // change default value of form once available from api fetch
      const location =
        place.features.find((i: { id: string }) => i.id.includes('poi'))?.text ||
        place.features.find((i: { id: string }) => i.id.includes('neighborhood'))?.text ||
        place.features.find((i: { id: string }) => i.id.includes('locality'))?.text ||
        '';
      const city = place.features.find((i: { id: string }) => i.id.includes('place'))?.text || '';
      const region = place.features.find((i: { id: string }) => i.id.includes('region'))?.text || '';
      const country = place.features.find((i: { id: string }) => i.id.includes('country'))?.text || '';
      form.reset({ location, city, region, country });
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: '',
      city: '',
      region: '',
      country: '',
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
    if (newPin) {
      const pin = { ...values, latitude: newPin.latitude, longitude: newPin.longitude };
      // server action
      startTransition(async () => {
        const response = await createPinAction(pin, files);
        if (response?.error) return alert('ERROR');
        router.refresh();
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
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
        <div>
          <p className='text-sm font-medium'>Photos</p>
          <div {...getRootProps()} className='border border-input rounded-md mt-2 cursor-pointer group'>
            <div
              className={cn(
                isDragActive ? 'border-indigo-500' : 'border-white',
                'min-h-[160px] flex items-center justify-center m-1 border-2 border-dashed rounded-md group-hover:border-indigo-500 transition-all duration-200'
              )}
            >
              {/* <input {...getInputProps()} /> */}
              <div className={cn(isDragActive && 'bg-white/50 blur opacity-50', 'transition-all duration-400')}>
                {files.length > 0 && (
                  <div className='grid grid-cols-3 p-6 gap-6'>
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
                  <div className='flex flex-col items-center gap-y-2 my-auto'>
                    <p className='text-sm font-medium'>Click to select photos, or drag and drop here</p>
                    <BiSolidCloudUpload className='w-6 h-6 text-indigo-500' />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <Button type='submit' disabled={isPending} className={'w-24 bg-indigo-500 hover:bg-indigo-500 hover:brightness-110'}>
          Submit
        </Button>
      </form>
    </Form>
  );
}
