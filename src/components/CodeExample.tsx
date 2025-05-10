
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface CodeExampleProps {
  title: string;
  language?: string;
  code: string;
  description?: string;
}

const CodeExample = ({
  title,
  language = 'javascript',
  code,
  description
}: CodeExampleProps) => {
  const [showLineNumbers, setShowLineNumbers] = useState(false);
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    toast.success('Code copied to clipboard');
  };
  
  const codeLines = code.split('\n');
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowLineNumbers(!showLineNumbers)}
            >
              {showLineNumbers ? 'Hide' : 'Show'} Line Numbers
            </Button>
            <Button variant="outline" size="sm" onClick={copyToClipboard}>
              Copy
            </Button>
          </div>
        </div>
        {description && (
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        <div className="relative rounded-md bg-gray-900 overflow-hidden">
          <div className="flex text-xs">
            <div className="px-4 py-2 text-gray-400">{language}</div>
          </div>
          <div className="overflow-auto p-4 max-h-[500px]">
            <pre className="font-mono text-sm leading-relaxed">
              <code className="language-javascript grid">
                {codeLines.map((line, i) => (
                  <div key={i} className="table-row">
                    {showLineNumbers && (
                      <span className="table-cell text-right pr-4 select-none text-gray-500 w-10">
                        {i + 1}
                      </span>
                    )}
                    <span className="table-cell text-gray-300">{line}</span>
                  </div>
                ))}
              </code>
            </pre>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CodeExample;
