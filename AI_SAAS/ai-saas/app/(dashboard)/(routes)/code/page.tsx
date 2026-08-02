"use client";

import * as z from "zod";
import axios from "axios";
import { Copy, Code } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import { ChatCompletionMessageParam } from "openai/resources/chat";

import { BotAvatar } from "@/components/bot-avatar";
import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { SkeletonCode, SkeletonMessage } from "@/components/skeleton";
import { UserAvatar } from "@/components/user-avatar";
import { Empty } from "@/components/ui/empty";
import { useProModal } from "@/hooks/use-pro-modal";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { useStreamingResponse } from "@/hooks/use-streaming-response";

import { formSchema } from "./constants";

const CODE_TEMPLATES = [
  "Simple toggle button using react hooks",
  "A responsive navigation bar with Tailwind CSS",
  "A todo list app with React and Zustand",
  "A form with validation using Zod",
  "A modal component with focus trap",
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <Button
      variant="ghost"
      size="sm"
      className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success("Copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
      }}
    >
      {copied ? "✓" : <Copy className="h-3 w-3" />}
    </Button>
  );
}

const CodePage = () => {
  const proModal = useProModal();
  const [messages, setMessages] = useState<ChatCompletionMessageParam[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: ""
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
  
  const { stream } = useStreamingResponse();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const userMessage: ChatCompletionMessageParam = { role: "user", content: values.prompt };
      const newMessages = [...messages, userMessage];
      
      // Show the user's message immediately
      setMessages((current) => [...current, userMessage]);

      // Add an empty assistant message we append to as tokens arrive
      setMessages((current) => [...current, { role: "assistant", content: "" }]);

      const fullContent = await stream(
        '/api/code',
        { messages: newMessages },
        (text) => {
          setMessages((current) => {
            const next = [...current];
            next[next.length - 1] = { role: "assistant", content: text };
            return next;
          });
        },
        (status) => {
          if (status === 403) proModal.onOpen();
        }
      );

      form.reset();

      // Fire-and-forget history save — never blocks the UI on DB latency
      axios.post('/api/history', {
        toolType: 'code',
        prompt: values.prompt,
        response: fullContent,
      }).catch(() => {});
    } catch (error: any) {
      const status = error?.response?.status || error?.status;
      if (status === 403) {
        proModal.onOpen();
      } else {
        toast.error("Something went wrong.");
      }
    }
  }

  return ( 
    <div>
      <Heading
        title="Code Generation"
        description="Generate code using descriptive text."
        icon={Code}
        iconColor="text-green-700"
        bgColor="bg-green-700/10"
      />
      <div className="px-4 lg:px-8">
        <div>
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
                        placeholder="Simple toggle button using react hooks." 
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
        </div>
        {messages.length === 0 && !isLoading && (
          <div className="mt-4 flex flex-wrap gap-2">
            {CODE_TEMPLATES.map((template) => (
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
        <div className="space-y-4 mt-4">
          {isLoading && (
            <div className="space-y-4">
              <SkeletonCode />
              <SkeletonCode />
            </div>
          )}
          {messages.length === 0 && !isLoading && (
            <Empty label="No conversation started." />
          )}
          <div className="flex flex-col-reverse gap-y-4">
            {messages.map((message) => (
              <div 
                key={String(message.content)} 
                className={cn(
                  "p-8 w-full flex items-start gap-x-8 rounded-lg",
                  message.role === "user" ? "bg-white border border-black/10" : "bg-muted",
                )}
              >
                {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
                <ReactMarkdown components={{
                  pre: ({ node, ...props }) => (
                    <div className="relative group overflow-auto w-full my-2 bg-black/10 p-2 rounded-lg">
                      <CopyButton text={String(props.children)} />
                      <pre {...props} />
                    </div>
                  ),
                  code: ({ node, ...props }) => (
                    <code className="bg-black/10 rounded-lg p-1" {...props} />
                  )
                }} className="text-sm overflow-hidden leading-7">
                  {String(message.content || "")}
                </ReactMarkdown>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
   );
}
  
export default CodePage;

