"use client";

import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { VideoIcon } from "lucide-react";
import { Copy } from "lucide-react";

import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { SkeletonMessage } from "@/components/skeleton";
import { Empty } from "@/components/ui/empty";
import { useProModal } from "@/hooks/use-pro-modal";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";

import { formSchema } from "./constants";

const VIDEO_TEMPLATES = [
  "Clown fish swimming in a coral reef",
  "A drone flying over a snowy mountain",
  "Sunset timelapse over a city skyline",
  "A cat playing with a ball of yarn",
  "Rain falling on a window at night",
];

const VideoPage = () => {
  const proModal = useProModal();
  const [video, setVideo] = useState<string>();

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
      setVideo(undefined);

      const response = await axios.post('/api/video', values);

      setVideo(response.data[0]);

      form.reset();

      // Fire-and-forget history save — never blocks the UI on DB latency
      axios.post('/api/history', {
        toolType: 'video',
        prompt: values.prompt,
        response: response.data[0],
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
        title="Video Generation"
        description="Turn your prompt into video."
        icon={VideoIcon}
        iconColor="text-orange-700"
        bgColor="bg-orange-700/10"
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
                      placeholder="Clown fish swimming in a coral reef" 
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
        {video === undefined && !isLoading && (
          <div className="mt-4 flex flex-wrap gap-2">
            {VIDEO_TEMPLATES.map((template) => (
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
        {!video && !isLoading && (
          <Empty label="No video files generated." />
        )}
        {video && (
          <div className="mt-8">
            <video controls className="w-full aspect-video rounded-lg border bg-black">
              <source src={video} />
            </video>
            <Button
              variant="secondary"
              className="w-full mt-2"
              onClick={() => {
                navigator.clipboard.writeText(video);
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
  
export default VideoPage;
