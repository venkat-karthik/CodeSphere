import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Play, 
  Square, 
  Save, 
  Download, 
  Upload, 
  Settings, 
  FileText,
  Folder,
  FolderOpen,
  Plus,
  X,
  Monitor,
  Tablet,
  Smartphone,
  Eye,
  Code,
  Terminal,
  Maximize2,
  Minimize2,
  Search,
  GitBranch,
  Package,
  Bug,
  Layers,
  Command,
  ChevronRight,
  ChevronDown,
  Circle,
  Dot
} from 'lucide-react';
import MonacoEditor from '@monaco-editor/react';
import { Terminal as XTerm } from 'xterm';
import 'xterm/css/xterm.css';

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

interface ConsoleMessage {
  type: 'info' | 'error' | 'warning' | 'success' | 'command';
  message: string;
  timestamp?: Date;
}

export function AdvancedSandbox() {
  const [tabs, setTabs] = useState<Tab[]>([
    {
      id: 'App.jsx',
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
  
  const [activeTabId, setActiveTabId] = useState('App.jsx');
  const [consoleOutput, setConsoleOutput] = useState<ConsoleMessage[]>([
    { type: 'info', message: 'Welcome to CodeSphere IDE! 🚀' },
    { type: 'success', message: 'Environment ready for development' }
  ]);
  const [terminalInput, setTerminalInput] = useState('');
  const [previewMode, setPreviewMode] = useState('desktop');
  const [isFileExplorerOpen, setIsFileExplorerOpen] = useState(true);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [sidebarTab, setSidebarTab] = useState('explorer');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [showMinimap, setShowMinimap] = useState(true);
  const [fontSize, setFontSize] = useState(14);
  const [wordWrap, setWordWrap] = useState(false);
  
  const [fileTree, setFileTree] = useState<FileNode[]>([
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
            { id: 'index.html', name: 'index.html', type: 'file', language: 'html', content: '<!DOCTYPE html>\n<html>\n<head>\n  <title>My App</title>\n</head>\n<body>\n  <div id="root"></div>\n</body>\n</html>' },
            { id: 'favicon.ico', name: 'favicon.ico', type: 'file' }
          ]
        },
        {
          id: 'src',
          name: 'src',
          type: 'folder',
          isOpen: true,
          children: [
            { 
              id: 'App.jsx', 
              name: 'App.jsx', 
              type: 'file', 
              language: 'javascript',
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

export default App;`
            },
            { 
              id: 'App.css', 
              name: 'App.css', 
              type: 'file', 
              language: 'css',
              content: `.App {
  text-align: center;
}

.App-header {
  background-color: #282c34;
  padding: 20px;
  color: white;
}

.counter {
  margin: 20px 0;
}

.counter button {
  padding: 10px 20px;
  margin: 0 10px;
  font-size: 18px;
  cursor: pointer;
}

.count {
  font-size: 24px;
  font-weight: bold;
  margin: 0 20px;
}`
            },
            { id: 'index.js', name: 'index.js', type: 'file', language: 'javascript', content: 'import React from "react";\nimport ReactDOM from "react-dom";\nimport App from "./App";\n\nReactDOM.render(<App />, document.getElementById("root"));' }
          ]
        },
        { id: 'package.json', name: 'package.json', type: 'file', language: 'json', content: '{\n  "name": "my-react-app",\n  "version": "1.0.0",\n  "dependencies": {\n    "react": "^18.0.0",\n    "react-dom": "^18.0.0"\n  }\n}' },
        { id: 'README.md', name: 'README.md', type: 'file', language: 'markdown', content: '# My React App\n\nThis is a sample React application created in CodeSphere Sandbox.\n\n## Getting Started\n\n1. Edit files in the src folder\n2. Click Run to see your changes\n3. Experiment and have fun!' }
      ]
    }
  ]);

  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);

  useEffect(() => {
    if (terminalRef.current && !xtermRef.current) {
      xtermRef.current = new XTerm({
        theme: { background: '#18122B', foreground: '#C5BFFF' },
        fontSize: 14,
        rows: 10,
      });
      xtermRef.current.open(terminalRef.current);
      xtermRef.current.writeln('Welcome to the Sandbox Terminal!');
      xtermRef.current.write('$ ');
      let command = '';
      xtermRef.current.onKey(({ key, domEvent }) => {
        if (domEvent.key === 'Enter') {
          if (command.trim() !== '') {
            xtermRef.current?.writeln('\r\n' + simulateCommand(command));
          }
          command = '';
          xtermRef.current?.write('$ ');
        } else if (domEvent.key === 'Backspace') {
          if (command.length > 0) {
            command = command.slice(0, -1);
            xtermRef.current?.write('\b \b');
          }
        } else if (domEvent.key.length === 1) {
          command += domEvent.key;
          xtermRef.current?.write(domEvent.key);
        }
      });
    }
  }, []);

  function simulateCommand(cmd: string) {
    // Simulate a few commands, otherwise echo
    if (cmd === 'help') return 'Available commands: help, clear, echo';
    if (cmd === 'clear') {
      xtermRef.current?.clear();
      return '';
    }
    if (cmd.startsWith('echo ')) return cmd.slice(5);
    return `Command not found: ${cmd}`;
  }

  // File manipulation functions
  const updateFileContent = (fileId: string, newContent: string) => {
    const updateNodeContent = (nodes: FileNode[]): FileNode[] => {
      return nodes.map(node => {
        if (node.id === fileId) {
          return { ...node, content: newContent };
        }
        if (node.children) {
          return { ...node, children: updateNodeContent(node.children) };
        }
        return node;
      });
    };
    
    setFileTree(updateNodeContent(fileTree));
    
    // Also update the corresponding tab
    setTabs(tabs.map(tab => 
      tab.id === fileId ? { ...tab, content: newContent, isDirty: true } : tab
    ));
  };

  const openFile = (fileId: string, fileName: string, content: string = '', language: string = 'javascript') => {
    const existingTab = tabs.find(tab => tab.id === fileId);
    if (existingTab) {
      setActiveTabId(fileId);
      return;
    }

    const newTab: Tab = {
      id: fileId,
      name: fileName,
      content: content,
      language: language,
      isDirty: false,
      isActive: false
    };

    setTabs([...tabs, newTab]);
    setActiveTabId(fileId);
  };

  const createNewFile = (parentId: string, fileName: string, type: 'file' | 'folder') => {
    const newId = `${parentId}_${fileName}_${Date.now()}`;
    
    const addToTree = (nodes: FileNode[]): FileNode[] => {
      return nodes.map(node => {
        if (node.id === parentId && node.type === 'folder') {
          const newNode: FileNode = {
            id: newId,
            name: fileName,
            type: type,
            content: type === 'file' ? '' : undefined,
            language: fileName.endsWith('.js') || fileName.endsWith('.jsx') ? 'javascript' : 
                     fileName.endsWith('.css') ? 'css' : 
                     fileName.endsWith('.html') ? 'html' : 'text',
            children: type === 'folder' ? [] : undefined,
            isOpen: type === 'folder' ? false : undefined
          };
          
          return {
            ...node,
            children: [...(node.children || []), newNode],
            isOpen: true
          };
        }
        if (node.children) {
          return { ...node, children: addToTree(node.children) };
        }
        return node;
      });
    };

    setFileTree(addToTree(fileTree));
    
    if (type === 'file') {
      const language = fileName.endsWith('.js') || fileName.endsWith('.jsx') ? 'javascript' : 
                      fileName.endsWith('.css') ? 'css' : 
                      fileName.endsWith('.html') ? 'html' : 'text';
      openFile(newId, fileName, '', language);
    }
    
    setConsoleOutput(prev => [
      ...prev,
      { type: 'success', message: `Created ${type}: ${fileName}` }
    ]);
  };

  const toggleFolder = (folderId: string) => {
    const toggleInTree = (nodes: FileNode[]): FileNode[] => {
      return nodes.map(node => {
        if (node.id === folderId && node.type === 'folder') {
          return { ...node, isOpen: !node.isOpen };
        }
        if (node.children) {
          return { ...node, children: toggleInTree(node.children) };
        }
        return node;
      });
    };
    
    setFileTree(toggleInTree(fileTree));
  };

  const runCode = () => {
    setIsRunning(true);
    const activeTab = tabs.find(tab => tab.id === activeTabId);
    if (!activeTab) return;

    setConsoleOutput(prev => [
      ...prev,
      { type: 'info', message: '🚀 Building and running your code...' },
      { type: 'success', message: '✅ Compilation successful!' },
      { type: 'info', message: '📦 Starting development server...' },
      { type: 'success', message: '🌐 App running at http://localhost:3000' }
    ]);

    // Simulate code execution
    setTimeout(() => {
      setOutput('Your React app is running! Check the preview panel.');
      setConsoleOutput(prev => [
        ...prev,
        { type: 'success', message: '✨ Ready for development!' }
      ]);
      setIsRunning(false);
    }, 2000);
  };

  const stopCode = () => {
    setIsRunning(false);
    setConsoleOutput(prev => [
      ...prev,
      { type: 'warning', message: '🛑 Development server stopped' }
    ]);
  };

  const executeTerminalCommand = (command: string) => {
    if (!command.trim()) return;

    setConsoleOutput(prev => [
      ...prev,
      { type: 'command', message: `$ ${command}` }
    ]);

    // Simulate different commands
    setTimeout(() => {
      if (command.includes('npm install')) {
        setConsoleOutput(prev => [
          ...prev,
          { type: 'info', message: 'Installing dependencies...' },
          { type: 'success', message: 'Dependencies installed successfully!' }
        ]);
      } else if (command.includes('ls')) {
        setConsoleOutput(prev => [
          ...prev,
          { type: 'info', message: 'public/  src/  package.json  README.md' }
        ]);
      } else if (command.includes('git')) {
        setConsoleOutput(prev => [
          ...prev,
          { type: 'success', message: 'Git command executed successfully!' }
        ]);
      } else {
        setConsoleOutput(prev => [
          ...prev,
          { type: 'info', message: `Command executed: ${command}` }
        ]);
      }
    }, 500);

    setTerminalInput('');
  };

  const closeTab = (tabId: string) => {
    const filteredTabs = tabs.filter(tab => tab.id !== tabId);
    setTabs(filteredTabs);
    if (activeTabId === tabId && filteredTabs.length > 0) {
      setActiveTabId(filteredTabs[0].id);
    }
  };

  const renderFileTree = (nodes: FileNode[], depth = 0) => {
    return nodes.map(node => (
      <div key={node.id} style={{ marginLeft: depth * 16 }}>
        <div
          className="flex items-center space-x-2 py-1 px-2 hover:bg-muted cursor-pointer rounded"
          onClick={() => {
            if (node.type === 'folder') {
              toggleFolder(node.id);
            } else if (node.content !== undefined) {
              openFile(node.id, node.name, node.content, node.language || 'text');
            }
          }}
        >
          {node.type === 'folder' ? (
            node.isOpen ? <FolderOpen className="h-4 w-4" /> : <Folder className="h-4 w-4" />
          ) : (
            <FileText className="h-4 w-4" />
          )}
          <span className="text-sm">{node.name}</span>
        </div>
        {node.type === 'folder' && node.isOpen && node.children && (
          <div>
            {renderFileTree(node.children, depth + 1)}
          </div>
        )}
      </div>
    ));
  };

  const activeTab = tabs.find(tab => tab.id === activeTabId);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Advanced Sandbox</h1>
          <p className="text-muted-foreground">
            Full-featured code editor with live preview and terminal
          </p>
        </div>
        <div className="flex space-x-2">
          <Button 
            onClick={runCode} 
            disabled={isRunning}
            className="bg-green-600 hover:bg-green-700"
          >
            <Play className="h-4 w-4 mr-2" />
            {isRunning ? 'Running...' : 'Run'}
          </Button>
          <Button 
            variant="outline" 
            onClick={stopCode}
            disabled={!isRunning}
          >
            <Square className="h-4 w-4 mr-2" />
            Stop
          </Button>
          <Button variant="outline">
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 h-[800px]">
        {/* File Explorer */}
        {isFileExplorerOpen && (
          <div className="col-span-3">
            <Card className="h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Explorer</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => createNewFile('src', 'newFile.js', 'file')}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="overflow-y-auto">
                {renderFileTree(fileTree)}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Code Editor */}
        <div className={`${isFileExplorerOpen ? 'col-span-5' : 'col-span-8'}`}>
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2 overflow-x-auto">
                {tabs.map(tab => (
                  <div
                    key={tab.id}
                    className={`flex items-center space-x-2 px-3 py-1 rounded cursor-pointer ${
                      tab.id === activeTabId 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                    onClick={() => setActiveTabId(tab.id)}
                  >
                    <span className="text-sm whitespace-nowrap">{tab.name}</span>
                    {tab.isDirty && <div className="w-1 h-1 bg-orange-500 rounded-full"></div>}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        closeTab(tab.id);
                      }}
                      className="ml-1 hover:bg-destructive rounded p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-0">
              {activeTab ? (
                <MonacoEditor
                  height="60vh"
                  language={activeTab.language}
                  value={activeTab.content}
                  theme="vs-dark"
                  onChange={(value) => updateFileContent(activeTab.id, value || "")}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <div className="text-center">
                    <Code className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Open a file to start coding</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Preview Panel */}
        <div className="col-span-4">
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Preview</CardTitle>
                <div className="flex space-x-1">
                  <Button
                    variant={previewMode === 'desktop' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setPreviewMode('desktop')}
                  >
                    <Monitor className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={previewMode === 'tablet' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setPreviewMode('tablet')}
                  >
                    <Tablet className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={previewMode === 'mobile' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setPreviewMode('mobile')}
                  >
                    <Smartphone className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-0">
              <div className={`h-full bg-white rounded-lg border-2 border-dashed border-muted-foreground/20 flex items-center justify-center ${
                previewMode === 'mobile' ? 'max-w-sm mx-auto' : 
                previewMode === 'tablet' ? 'max-w-md mx-auto' : ''
              }`}>
                <div className="text-center p-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white font-bold text-2xl">CS</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Welcome to CodeSphere!</h3>
                  <p className="text-gray-600 mb-4">Your React app is running perfectly</p>
                  <div className="bg-gray-100 rounded-lg p-4 mb-4">
                    <div className="flex justify-center space-x-4">
                      <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">-</button>
                      <span className="text-2xl font-bold text-gray-800">0</span>
                      <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">+</button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">Edit src/App.jsx and save to reload</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Terminal */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-2">
            <Terminal className="h-5 w-5" />
            <CardTitle className="text-lg">Terminal</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div ref={terminalRef} style={{ height: '200px', background: '#18122B', borderRadius: 8, marginTop: 16 }} />
        </CardContent>
      </Card>
    </div>
  );
}