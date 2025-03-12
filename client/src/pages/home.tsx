import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertProxyRequestSchema } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function Home() {
  const { toast } = useToast();
  const [proxyUrl, setProxyUrl] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(insertProxyRequestSchema),
    defaultValues: {
      url: "",
    },
  });

  const proxyMutation = useMutation({
    mutationFn: async (url: string) => {
      const res = await apiRequest("POST", "/api/proxy", { url });
      const data = await res.json();
      return data.proxyUrl;
    },
    onSuccess: (proxyUrl) => {
      // Open in new about:blank tab and make it fullscreen
      const win = window.open('about:blank');
      if (win) {
        win.document.write(`
          <html>
            <head>
              <title>embedddddr</title>
              <style>
                body, html { margin: 0; padding: 0; height: 100%; overflow: hidden; }
                iframe { border: none; width: 100%; height: 100%; }
              </style>
            </head>
            <body>
              <iframe src="${proxyUrl}" allowfullscreen></iframe>
              <script>
                document.querySelector('iframe').requestFullscreen();
              </script>
            </body>
          </html>
        `);
      }
      setProxyUrl(proxyUrl);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: { url: string }) => {
    proxyMutation.mutate(data.url);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-black p-4">
      <div className="w-full max-w-xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">
            embe
            <span className="text-red-500">dddd</span>
            dr
          </h1>
          <p className="text-gray-400">
            Enter a URL below to access it through our secure proxy
          </p>
        </div>

        <Card className="border-red-500/20 bg-gray-900/50 backdrop-blur">
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="https://example.com"
                          className="bg-gray-800 border-red-500/20 text-white placeholder:text-gray-500 focus-visible:ring-red-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={proxyMutation.isPending}
                  className="w-full bg-red-900 hover:bg-red-800 text-white shadow-[0_0_15px_rgb(127_29_29_/_30%)] hover:shadow-[0_0_20px_rgb(127_29_29_/_40%)] transition-all"
                >
                  {proxyMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Proxy URL"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}