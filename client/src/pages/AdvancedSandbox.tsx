import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Play,
  Square,
  Save,
  Download,
  Upload,
  FolderOpen,
  File,
  Plus,
  X,
  Terminal,
  Settings,
  Maximize2,
  Minimize2,
  Code,
  FileText,
  Image,
  Folder,
  ChevronRight,
  ChevronDown,
  Search,
  Replace,
  Zap,
  Bug,
  GitBranch,
  Share,
  Eye,
  EyeOff,
  RefreshCw,
  Monitor,
  Smartphone,
  Tablet
} from 'lucide-react';

interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  content?: string;
  children?: FileNode[];
  language?: string;
  isOpen?: boolean;
}

interface Tab {
  id: string;
  name: string;
  content: string;
  language: string;
  isDirty: boolean;
  isActive: boolean;
}

export function AdvancedSandbox() {
  const [selectedTemplate, setSelectedTemplate] = useState('react');
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState('code');
  const [tabs, setTabs] = useState<Tab[]>([
    {
      id: '1',
      name: 'App.jsx',
      content: `import React, { useState } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to CodeSphere Sandbox!</h1>
        <div className="counter">
          <button onClick={() => setCount(count - 1)}>-</button>
          <span className="count">{count}</span>
          <button onClick={() => setCount(count + 1)}>+</button>
        </div>
        <p>
          Edit <code>src/App.jsx</code> and save to reload.
        </p>
      </header>
    </div>
  );
}

export default App;`,
      language: 'javascript',
      isDirty: false,
      isActive: true
    }
  ]);
  
  const [activeTabId, setActiveTabId] = useState('1');
  const [consoleOutput, setConsoleOutput] = useState([
    { type: 'info', message: 'Welcome to CodeSphere Sandbox!' },
    { type: 'info', message: 'Ready to code...' }
  ]);
  const [terminalInput, setTerminalInput] = useState('');
  const [previewMode, setPreviewMode] = useState('desktop');
  const [isFileExplorerOpen, setIsFileExplorerOpen] = useState(true);

  const fileTree: FileNode[] = [
    {
      id: 'root',
      name: 'my-react-app',
      type: 'folder',
      isOpen: true,
      children: [
        {
          id: 'public',
          name: 'public',
          type: 'folder',
          isOpen: false,
          children: [
            { id: 'index.html', name: 'index.html', type: 'file', language: 'html' },
            { id: 'favicon.ico', name: 'favicon.ico', type: 'file' }
          ]
        },
        {
          id: 'src',
          name: 'src',
          type: 'folder',
          isOpen: true,
          children: [
            { id: 'App.jsx', name: 'App.jsx', type: 'file', language: 'javascript' },
            { id: 'App.css', name: 'App.css', type: 'file', language: 'css' },
            { id: 'index.js', name: 'index.js', type: 'file', language: 'javascript' },
            {
              id: 'components',
              name: 'components',
              type: 'folder',
              isOpen: false,
              children: [
                { id: 'Header.jsx', name: 'Header.jsx', type: 'file', language: 'javascript' },
                { id: 'Button.jsx', name: 'Button.jsx', type: 'file', language: 'javascript' }
              ]
            }
          ]
        },
        { id: 'package.json', name: 'package.json', type: 'file', language: 'json' },
        { id: 'README.md', name: 'README.md', type: 'file', language: 'markdown' }
      ]
    }
  ];

  const templates = [
    { id: 'react', name: 'React App', description: 'Modern React application with hooks' },
    { id: 'vue', name: 'Vue.js App', description: 'Vue 3 application with composition API' },
    { id: 'angular', name: 'Angular App', description: 'Angular application with TypeScript' },
    { id: 'vanilla', name: 'Vanilla JS', description: 'Pure HTML, CSS, and JavaScript' },
    { id: 'node', name: 'Node.js API', description: 'Express.js REST API server' },
    { id: 'python', name: 'Python Flask', description: 'Flask web application' },
    { id: 'nextjs', name: 'Next.js', description: 'Full-stack React framework' },
    { id: 'svelte', name: 'Svelte Kit', description: 'Modern Svelte application' }
  ];

  const handleRun = () => {
    setIsRunning(true);
    setConsoleOutput(prev => [
      ...prev,
      { type: 'info', message: 'Building application...' },
      { type: 'success', message: 'Build completed successfully!' },
      { type: 'info', message: 'Starting development server...' },
      { type: 'success', message: 'Server running on http://localhost:3000' }
    ]);
    setTimeout(() => setIsRunning(false), 2000);
  };

  const handleStop = () => {
    setIsRunning(false);
    setConsoleOutput(prev => [
      ...prev,
      { type: 'warning', message: 'Stopping development server...' },
      { type: 'info', message: 'Server stopped.' }
    ]);
  };

  const handleTerminalCommand = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const command = terminalInput.trim();
      setConsoleOutput(prev => [
        ...prev,
        { type: 'command', message: `$ ${command}` }
      ]);
      
      // Simulate command execution
      setTimeout(() => {
        if (command === 'npm install') {
          setConsoleOutput(prev => [
            ...prev,
            { type: 'info', message: 'Installing dependencies...' },
            { type: 'success', message: 'Dependencies installed successfully!' }
          ]);
        } else if (command === 'npm test') {
          setConsoleOutput(prev => [
            ...prev,
            { type: 'info', message: 'Running tests...' },
            { type: 'success', message: 'All tests passed!' }
          ]);
        } else if (command.startsWith('git')) {
          setConsoleOutput(prev => [
            ...prev,
            { type: 'success', message: 'Git command executed successfully.' }
          ]);
        } else {
          setConsoleOutput(prev => [
            ...prev,
            { type: 'error', message: `Command not found: ${command}` }
          ]);
        }
      }, 500);
      
      setTerminalInput('');
    }
  };

  const renderFileTree = (nodes: FileNode[], level = 0) => {
    return nodes.map((node) => (
      <div key={node.id} style={{ marginLeft: `${level * 16}px` }}>
        <div className="flex items-center space-x-1 py-1 px-2 hover:bg-muted/50 cursor-pointer text-sm">
          {node.type === 'folder' ? (
            <>
              {node.isOpen ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
              <Folder className="h-4 w-4 text-blue-500" />
            </>
          ) : (
            <>
              <div className="w-3" />
              {node.language === 'javascript' ? (
                <Code className="h-4 w-4 text-yellow-500" />
              ) : node.language === 'css' ? (
                <FileText className="h-4 w-4 text-blue-500" />
              ) : node.language === 'html' ? (
                <FileText className="h-4 w-4 text-orange-500" />
              ) : (
                <File className="h-4 w-4 text-gray-500" />
              )}
            </>
          )}
          <span className="flex-1">{node.name}</span>
        </div>
        {node.type === 'folder' && node.isOpen && node.children && (
          <div>
            {renderFileTree(node.children, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  const closeTab = (tabId: string) => {
    const newTabs = tabs.filter(tab => tab.id !== tabId);
    setTabs(newTabs);
    if (activeTabId === tabId && newTabs.length > 0) {
      setActiveTabId(newTabs[0].id);
    }
  };

  const getConsoleTypeColor = (type: string) => {
    switch (type) {
      case 'error': return 'text-red-400';
      case 'warning': return 'text-yellow-400';
      case 'success': return 'text-green-400';
      case 'command': return 'text-blue-400';
      default: return 'text-muted-foreground';
    }
  };

  const activeTabData = tabs.find(tab => tab.id === activeTabId);

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-background">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-2 border-b border-border bg-muted/30">
        <div className="flex items-center space-x-2">
          <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {templates.map((template) => (
                <SelectItem key={template.id} value={template.id}>
                  {template.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button
            onClick={isRunning ? handleStop : handleRun}
            disabled={isRunning}
            className="bg-green-600 hover:bg-green-700"
          >
            {isRunning ? (
              <>
                <Square className="mr-2 h-4 w-4" />
                Stop
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Run
              </>
            )}
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
          <Button variant="ghost" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="ghost" size="sm">
            <Share className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* File Explorer */}
        {isFileExplorerOpen && (
          <div className="w-64 border-r border-border bg-muted/20 flex flex-col">
            <div className="p-2 border-b border-border flex items-center justify-between">
              <span className="text-sm font-semibold">Explorer</span>
              <div className="flex items-center space-x-1">
                <Button variant="ghost" size="sm">
                  <Plus className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="sm">
                  <FolderOpen className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-1">
                {renderFileTree(fileTree)}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Code Editor and Preview */}
        <div className="flex-1 flex flex-col">
          {/* Tabs */}
          <div className="flex items-center border-b border-border bg-muted/30">
            <div className="flex items-center">
              {tabs.map((tab) => (
                <div
                  key={tab.id}
                  className={`flex items-center space-x-2 px-3 py-2 border-r border-border cursor-pointer ${
                    activeTabId === tab.id ? 'bg-background' : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setActiveTabId(tab.id)}
                >
                  <Code className="h-3 w-3" />
                  <span className="text-sm">{tab.name}</span>
                  {tab.isDirty && <div className="w-1 h-1 bg-orange-500 rounded-full" />}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      closeTab(tab.id);
                    }}
                    className="hover:bg-muted rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex-1" />
            <div className="flex items-center space-x-2 px-2">
              <Button variant="ghost" size="sm">
                <Search className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="sm">
                <Replace className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex">
            {/* Code Editor */}
            <div className="flex-1 flex flex-col">
              <div className="flex-1 p-4 font-mono text-sm bg-muted/10">
                <pre className="whitespace-pre-wrap text-foreground leading-relaxed">
                  {activeTabData?.content}
                </pre>
              </div>
            </div>

            {/* Live Preview */}
            <div className="w-1/2 border-l border-border flex flex-col">
              <div className="p-2 border-b border-border flex items-center justify-between bg-muted/30">
                <span className="text-sm font-semibold">Live Preview</span>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <Button
                      variant={previewMode === 'desktop' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setPreviewMode('desktop')}
                    >
                      <Monitor className="h-3 w-3" />
                    </Button>
                    <Button
                      variant={previewMode === 'tablet' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setPreviewMode('tablet')}
                    >
                      <Tablet className="h-3 w-3" />
                    </Button>
                    <Button
                      variant={previewMode === 'mobile' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setPreviewMode('mobile')}
                    >
                      <Smartphone className="h-3 w-3" />
                    </Button>
                  </div>
                  <Button variant="ghost" size="sm">
                    <RefreshCw className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              <div className="flex-1 bg-white flex items-center justify-center">
                <div className={`bg-gray-50 border border-gray-200 ${
                  previewMode === 'mobile' ? 'w-80 h-96' :
                  previewMode === 'tablet' ? 'w-96 h-80' :
                  'w-full h-full'
                } rounded-lg overflow-hidden`}>
                  <div className="h-full flex flex-col items-center justify-center p-8 text-gray-800">
                    <h1 className="text-2xl font-bold mb-4">Welcome to CodeSphere Sandbox!</h1>
                    <div className="flex items-center space-x-4 mb-4">
                      <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                        -
                      </button>
                      <span className="text-xl font-mono">0</span>
                      <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                        +
                      </button>
                    </div>
                    <p className="text-gray-600 text-center">
                      Edit <code className="bg-gray-200 px-1 rounded">src/App.jsx</code> and save to reload.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Panel - Console/Terminal */}
      <div className="h-48 border-t border-border bg-muted/10">
        <Tabs defaultValue="console">
          <div className="flex items-center justify-between border-b border-border px-2">
            <TabsList className="h-8">
              <TabsTrigger value="console" className="text-xs">Console</TabsTrigger>
              <TabsTrigger value="terminal" className="text-xs">Terminal</TabsTrigger>
              <TabsTrigger value="problems" className="text-xs">Problems</TabsTrigger>
              <TabsTrigger value="output" className="text-xs">Output</TabsTrigger>
            </TabsList>
            <Button variant="ghost" size="sm">
              <X className="h-3 w-3" />
            </Button>
          </div>
          
          <TabsContent value="console" className="m-0 h-40">
            <ScrollArea className="h-full">
              <div className="p-2 font-mono text-xs space-y-1">
                {consoleOutput.map((output, index) => (
                  <div key={index} className={`${getConsoleTypeColor(output.type)}`}>
                    {output.message}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="terminal" className="m-0 h-40">
            <div className="h-full flex flex-col">
              <ScrollArea className="flex-1">
                <div className="p-2 font-mono text-xs space-y-1">
                  {consoleOutput.filter(output => output.type === 'command' || output.type === 'info').map((output, index) => (
                    <div key={index} className={`${getConsoleTypeColor(output.type)}`}>
                      {output.message}
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="border-t border-border p-2">
                <div className="flex items-center space-x-2 font-mono text-xs">
                  <span className="text-green-400">$</span>
                  <Input
                    value={terminalInput}
                    onChange={(e) => setTerminalInput(e.target.value)}
                    onKeyPress={handleTerminalCommand}
                    placeholder="Type a command..."
                    className="flex-1 border-0 bg-transparent text-xs focus:ring-0"
                  />
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="problems" className="m-0 h-40">
            <div className="p-2 text-xs">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Bug className="h-4 w-4" />
                <span>No problems detected</span>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="output" className="m-0 h-40">
            <div className="p-2 text-xs">
              <div className="text-muted-foreground">Build output will appear here...</div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}