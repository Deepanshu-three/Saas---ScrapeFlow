'use client'

import CustomDialogHeader from '@/components/CustomDialogHeader';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { createWorkflowSchema, createWorkflowSchemaType } from '@/schema/workflows';
import { Layers2Icon, Loader2, ShieldEllipsis } from 'lucide-react';
import React, { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useMutation } from '@tanstack/react-query';
import { createWorkflow } from '@/actions/workflows/createWorkflow';
import { toast } from 'sonner';
import { createCredentialsSchema, createCredentialsSchemaType } from '@/schema/credentials';
import { CreateCredentials } from '@/actions/credentials/createCredential';

const CreateCredentialsDialog = ({triggerText} : {triggerText?: string}) => {
    const [open, setOpen] = useState(false);

    const form = useForm<createCredentialsSchemaType>({
        resolver: zodResolver(createCredentialsSchema),
    })

    const {mutate, isPending} = useMutation({
        mutationFn: CreateCredentials,
        onSuccess: () => {
            toast.success("Credential created", { id: "create-credential"})
        },
        onError: () => {
            toast.error("Failed to create credential", { id: "create-credential"})
        },

    })

    const onSubmit = useCallback((values : createCredentialsSchemaType) => {
        toast.loading("Creating credential...", { id: "create-credential"})
        mutate(values)
    },[mutate ])

  return (
    <Dialog open={open} onOpenChange={(open) => {
        form.reset()
        setOpen(open)
    }}>
        <DialogTrigger asChild>
            <Button>{triggerText ?? "Create"}</Button>
        </DialogTrigger>
        <DialogContent className='px-0'>
            <CustomDialogHeader  
                icon={ShieldEllipsis}
                title='create credential'
            />
            <div className="p-6">
                <Form {...form}>
                    <form className="space-y-8 w-full" onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name='name'
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel className='flex gap-1 items-center>'>
                                        Name 
                                        <p className="text-xs text-primary">(required)</p>
                                    </FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Enter a unique and descriptive name for credentail <br />
                                        This name will be used to identify the credentail
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="value"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel className='flex gap-1 items-center>'>
                                        Value 
                                        <p className="text-xs text-primary">(required)</p>
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea className='resize-none' {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Enter the value associated with this credentail <br /> 
                                        This value will be securly encrypted and stored
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button className='w-full' type='submit' disabled={isPending}>
                            {isPending && <Loader2 className='animate-spin'/>}
                            {!isPending && "Proceed"}
                        </Button>
                    </form>
                </Form>
            </div>
        </DialogContent>
    </Dialog>
  )
}

export default CreateCredentialsDialog