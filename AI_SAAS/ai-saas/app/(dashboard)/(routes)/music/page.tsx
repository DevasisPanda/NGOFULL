"use client";

import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Music, Send, Copy } from "lucide-react";

import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { SkeletonMessage } from "@/components/skeleton";
import { Empty } from "@/components/ui/empty";
import { useProModal } from "@/hooks/use-pro-modal";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";

import { formSchema } from "./constants";

const MUSIC_TEMPLATES = [
  "Piano solo in C major",
  "Upbeat electronic dance track",
  "Calm ambient meditation music",
  "Jazz saxophone evening vibe",
  "Epic orchestral adventure theme",
];

const MusicPage = () => {
  const proModal = useProModal();
  const [music, setMusic] = useState<string>();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    }
  });

  const isLoading = form.formState.isSubmitting;

  useKeyboardShortcuts([
    {
      key: "k",
      ctrlKey: true,
      handler: () => {
        const input = document.querySelector('input[name="prompt"]') as HTMLInputElement;
        input?.focus();
      },
    },
  ]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setMusic(undefined);

      const response = await axios.post('/api/music', values);

      setMusic(response.data.audio);

      form.reset();

      // Fire-and-forget history save — never blocks the UI on DB latency
      axios.post('/api/history', {
        toolType: 'music',
        prompt: values.prompt,
        response: response.data.audio,
      }).catch(() => {});
    } catch (error: any) {
      if (error?.response?.status === 403) {
        proModal.onOpen();
      } else {
        toast.error("Something went wrong.");
      }
    }
  }

  return ( 
    <div>
      <Heading
        title="Music Generation"
        description="Turn your prompt into music."
        icon={Music}
        iconColor="text-emerald-500"
        bgColor="bg-emerald-500/10"
      />
      <div className="px-4 lg:px-8">
        <Form {...form}>
          <form 
            onSubmit={form.handleSubmit(onSubmit)} 
            className="
              rounded-lg 
              border 
              w-full 
              p-4 
              px-3 
              md:px-6 
              focus-within:shadow-sm
              grid
              grid-cols-12
              gap-2
            "
          >
            <FormField
              name="prompt"
              render={({ field }) => (
                <FormItem className="col-span-12 lg:col-span-10">
                  <FormControl className="m-0 p-0">
                    <Input
                      className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                      disabled={isLoading} 
                      placeholder="Piano solo" 
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button className="col-span-12 lg:col-span-2 w-full" type="submit" disabled={isLoading} size="icon">
              Generate
            </Button>
          </form>
        </Form>
        {music === undefined && !isLoading && (
          <div className="mt-4 flex flex-wrap gap-2">
            {MUSIC_TEMPLATES.map((template) => (
              <Button
                key={template}
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => form.setValue("prompt", template)}
              >
                {template}
              </Button>
            ))}
          </div>
        )}
        {isLoading && (
          <div className="space-y-4 mt-8">
            <SkeletonMessage />
            <SkeletonMessage />
          </div>
        )}
        {!music && !isLoading && (
          <Empty label="No music generated." />
        )}
        {music && (
          <div className="mt-8">
            <audio controls className="w-full">
              <source src={music} />
            </audio>
            <Button
              variant="secondary"
              className="w-full mt-2"
              onClick={() => {
                navigator.clipboard.writeText(music);
                toast.success("URL copied to clipboard");
              }}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy URL
            </Button>
          </div>
        )}
      </div>
    </div>
   );
}
  
export default MusicPage;
