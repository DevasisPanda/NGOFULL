"use client";

import * as z from "zod";
import axios from "axios";
import { MessageSquare } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { ChatCompletionMessageParam } from "openai/resources/chat";

import { BotAvatar } from "@/components/bot-avatar";
import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { SkeletonMessage } from "@/components/skeleton";
import { UserAvatar } from "@/components/user-avatar";
import { Empty } from "@/components/ui/empty";
import { useProModal } from "@/hooks/use-pro-modal";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { useStreamingResponse } from "@/hooks/use-streaming-response";
import { Copy } from "lucide-react";

import { formSchema } from "./constants";

const CONVERSATION_TEMPLATES = [
  "Explain quantum computing in simple terms",
  "Write a haiku about the ocean",
  "Help me plan a weekend trip",
  "What are the best practices for React?",
  "Tell me a joke about programming",
];

const ConversationPage = () => {
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
        '/api/conversation',
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
        toolType: 'conversation',
        prompt: values.prompt,
        response: fullContent,
      }).catch(() => {});
    } catch (error: any) {
      // fetch errors carry the status on the response; axios errors on error.response
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
        title="Conversation"
        description="Our most advanced conversation model."
        icon={MessageSquare}
        iconColor="text-violet-500"
        bgColor="bg-violet-500/10"
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
                        placeholder="How do I calculate the radius of a circle?" 
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
            {CONVERSATION_TEMPLATES.map((template) => (
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
              <SkeletonMessage />
              <SkeletonMessage />
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
                  "p-8 w-full flex items-start gap-x-8 rounded-lg relative group",
                  message.role === "user" ? "bg-white border border-black/10" : "bg-muted",
                )}
              >
                {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
                <div className="flex-1">
                  <p className="text-sm">
                  {String(message.content || "")}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                    onClick={() => {
                      navigator.clipboard.writeText(String(message.content || ""));
                      toast.success("Copied to clipboard");
                    }}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
   );
}
  
export default ConversationPage;

