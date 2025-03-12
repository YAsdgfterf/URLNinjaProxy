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
          <h1 className="text-4xl font-bold text-red-500 [text-shadow:_0_0_10px_rgb(239_68_68_/_70%)]">
            URL Proxy
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
                  className="w-full bg-red-500 hover:bg-red-600 text-white [text-shadow:_0_0_10px_rgb(239_68_68_/_70%)] shadow-[0_0_15px_rgb(239_68_68_/_30%)] hover:shadow-[0_0_20px_rgb(239_68_68_/_40%)] transition-all"
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

        {proxyUrl && (
          <div className="w-full aspect-video">
            <iframe
              src={proxyUrl}
              className="w-full h-full border-2 border-red-500/20 rounded-lg bg-gray-900/50"
              title="Proxied content"
            />
          </div>
        )}
      </div>
    </div>
  );
}
