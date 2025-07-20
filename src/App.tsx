import { ContentCreator } from "@/components/ContentCreator";
import "./index.css";

export function App() {
  return (
    <div className="container mx-auto p-8 relative z-10">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Content Creation Studio</h1>
        <p className="text-muted-foreground">
          Generate creative content using AI agents
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <ContentCreator />
      </div>
    </div>
  );
}

export default App;
