"use client";


import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import { newPassword } from "@/action/new-password";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { NewPasswordSchema } from "@/schema/index";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { FormError } from "../FormError";
import { FormSuccess } from "../FormSuccess";
import { Button } from "../ui/button";
import CardWraper from "./CardWraper";


const NewPasswordForm = () => {
  
    const searchParams = useSearchParams();

    const token = searchParams.get("token")

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  const onSubmits = (values: z.infer<typeof NewPasswordSchema>) => {
    setError("");
    setSuccess("");
    

    startTransition(() => {
      newPassword(values, token).then((data) => {
        if (data) {
          setError(data?.error);
          setSuccess(data?.success);
        } else {
          setError("An unexpected error occurred!");
        }
      });
    });
  };

  return (
    <CardWraper
      headerLabel="Enter a new password"
      backButtonLabel="Back to login?   "
      backButtonHref="/auth/login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmits)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="******"
                      {...field}
                      disabled={isPending}
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button disabled={isPending} type="submit" className="w-full">
            Reset password
          </Button>
        </form>
      </Form>
    </CardWraper>
  );
};

export default NewPasswordForm;
