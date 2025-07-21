import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { generateMarkdown, generatePlaceholderMarkdown } from "@/utils/generateMarkdown";
import { Copy, Download, Eye, ArrowLeft, CheckCircle, Clock, Loader2 } from "lucide-react";

interface ToolUseStatus {
  name: string;
  complete: boolean;
}

interface ContentCreationResult {
  research_summary: string;
  image_prompt: string;
  story_prompt: string;
  generated_image?: string;
  generated_story: string;
  metadata: {
    workflow_id: string;
    timestamp: string;
    execution_time_seconds: number;
    status: string;
    tool_used: ToolUseStatus[];
  };
}

type ViewMode = 'form' | 'preview';

export function ContentCreator() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ContentCreationResult | null>(null);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>('form');
  const [realtimeTools, setRealtimeTools] = useState<ToolUseStatus[]>([]);

  const handleSubmit = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);
    setRealtimeTools([]);

    try {
      // For POST endpoint with SSE, we'll use fetch with reader
      const response = await fetch("http://localhost:8000/workflow/create-stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          save_markdown: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      // Read the stream
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          // Decode and add to buffer
          buffer += decoder.decode(value, { stream: true });
          
          // Process complete SSE messages
          const messages = buffer.split('\n\n');
          buffer = messages.pop() || ''; // Keep incomplete message in buffer
          
          for (const message of messages) {
            const lines = message.split('\n');
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                try {
                  const data = JSON.parse(line.slice(6));
                  
                  if (data.type === 'tool_update') {
                    setRealtimeTools(prev => {
                      const existing = prev.find(t => t.name === data.tool);
                      if (existing) {
                        return prev.map(t => 
                          t.name === data.tool 
                            ? { ...t, complete: data.status === 'completed' }
                            : t
                        );
                      }
                      return [...prev, { 
                        name: data.tool, 
                        complete: data.status === 'completed' 
                      }];
                    });
                  } else if (data.type === 'complete') {
                    setResult(data.result);
                    setLoading(false);
                    setRealtimeTools([]);
                  } else if (data.type === 'error') {
                    setError(data.message || "An error occurred");
                    setLoading(false);
                  }
                } catch (e) {
                  console.error('Failed to parse SSE data:', e);
                }
              }
            }
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create content");
      setLoading(false);
    }
  };

  const copyMarkdown = async () => {
    if (!result) return;
    const markdown = generateMarkdown(result);
    try {
      await navigator.clipboard.writeText(markdown);
      // Could add a toast notification here
    } catch (err) {
      console.error('Failed to copy markdown:', err);
    }
  };

  const downloadMarkdown = () => {
    if (!result) return;
    const markdown = generateMarkdown(result);
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `content_${result.metadata.workflow_id.slice(0, 8)}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Generate markdown content for preview
  const getMarkdownContent = () => {
    if (loading && prompt) {
      return generatePlaceholderMarkdown(prompt);
    }
    if (result) {
      return generateMarkdown(result);
    }
    return "# Content Creation Studio\n\nEnter a prompt and click 'Create Content' to generate your content here.";
  };

  // Preview view - full screen markdown
  if (viewMode === 'preview') {
    return (
      <div className="fixed inset-0 bg-background z-50 flex flex-col">
        {/* Header with navigation */}
        <div className="flex-shrink-0 border-b bg-background/95 backdrop-blur-sm">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => setViewMode('form')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Editor
              </Button>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyMarkdown}
                  className="flex items-center gap-2"
                  title="Copy Markdown"
                >
                  <Copy className="h-4 w-4" />
                  Copy
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadMarkdown}
                  className="flex items-center gap-2"
                  title="Download Markdown"
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Full-screen markdown content */}
        <div className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-6 py-6 max-w-4xl">
            <MarkdownRenderer content={getMarkdownContent()} />
          </div>
        </div>
      </div>
    );
  }

  // Form view - original layout
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Content Creator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="prompt">Enter your prompt</Label>
            <Input
              id="prompt"
              type="text"
              placeholder="e.g., space exploration and Mars missions"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !loading && handleSubmit()}
            />
          </div>
          <Button 
            onClick={handleSubmit} 
            disabled={loading || !prompt.trim()}
            className="w-full"
          >
            {loading ? "Creating Content..." : "Create Content"}
          </Button>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">Error: {error}</p>
          </CardContent>
        </Card>
      )}

      {/* Real-time progress display */}
      {loading && realtimeTools.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Creating Content...
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {realtimeTools.map((tool, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  {tool.complete ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <Loader2 className="h-4 w-4 text-yellow-500 animate-spin" />
                  )}
                  <span className={tool.complete ? "text-green-700" : "text-yellow-700"}>
                    {tool.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Generated Content
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewMode('preview')}
                  className="flex items-center gap-2"
                >
                  <Eye className="h-4 w-4" />
                  Full Preview
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyMarkdown}
                  className="h-8 w-8 p-0"
                  title="Copy Markdown"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadMarkdown}
                  className="h-8 w-8 p-0"
                  title="Download Markdown"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-xs text-muted-foreground space-y-1">
              <p><span className="font-medium">Workflow ID:</span> {result.metadata.workflow_id}</p>
              <p><span className="font-medium">Execution Time:</span> {result.metadata.execution_time_seconds.toFixed(2)}s</p>
              <p><span className="font-medium">Status:</span> <span className="text-green-600 font-medium">{result.metadata.status}</span></p>
            </div>
            
            {/* Tool Usage Progress */}
            {result.metadata.tool_used && result.metadata.tool_used.length > 0 && (
              <div>
                <Label className="text-sm font-medium">Workflow Progress</Label>
                <div className="mt-2 space-y-2">
                  {result.metadata.tool_used.map((tool, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      {tool.complete ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <Clock className="h-4 w-4 text-yellow-500" />
                      )}
                      <span className={tool.complete ? "text-green-700" : "text-yellow-700"}>
                        {tool.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div>
              <Label className="text-sm font-medium">Research Summary</Label>
              <p className="text-sm text-muted-foreground mt-1">
                {result.research_summary}
              </p>
            </div>
            
            <div>
              <Label className="text-sm font-medium">Generated Story</Label>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-4">
                {result.generated_story}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}