
import { useState } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CodeExample from "@/components/CodeExample";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Documentation = () => {
  const [language, setLanguage] = useState('curl');

  const codeExamples = {
    authentication: {
      curl: `curl -X GET "https://api.nutriverse.com/v1_1/search/apple" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      javascript: `fetch('https://api.nutriverse.com/v1_1/search/apple', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  }
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));`,
      python: `import requests

url = "https://api.nutriverse.com/v1_1/search/apple"
headers = {"Authorization": "Bearer YOUR_API_KEY"}

response = requests.get(url, headers=headers)
data = response.json()
print(data)`
    },
    search: {
      curl: `curl -X GET "https://api.nutriverse.com/v1_1/search/banana" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      javascript: `fetch('https://api.nutriverse.com/v1_1/search/banana', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  }
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));`,
      python: `import requests

url = "https://api.nutriverse.com/v1_1/search/banana"
headers = {"Authorization": "Bearer YOUR_API_KEY"}

response = requests.get(url, headers=headers)
data = response.json()
print(data)`
    },
    item: {
      curl: `curl -X GET "https://api.nutriverse.com/v1_1/item?id=123456" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      javascript: `fetch('https://api.nutriverse.com/v1_1/item?id=123456', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  }
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));`,
      python: `import requests

url = "https://api.nutriverse.com/v1_1/item?id=123456"
headers = {"Authorization": "Bearer YOUR_API_KEY"}

response = requests.get(url, headers=headers)
data = response.json()
print(data)`
    },
    barcode: {
      curl: `curl -X GET "https://api.nutriverse.com/v1_1/barcode?code=049000042566" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      javascript: `fetch('https://api.nutriverse.com/v1_1/barcode?code=049000042566', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  }
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));`,
      python: `import requests

url = "https://api.nutriverse.com/v1_1/barcode?code=049000042566"
headers = {"Authorization": "Bearer YOUR_API_KEY"}

response = requests.get(url, headers=headers)
data = response.json()
print(data)`
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-[300px_1fr] gap-8">
          {/* Sidebar Navigation */}
          <div className="border-r">
            <div className="sticky top-24">
              <h2 className="text-lg font-semibold mb-4">Documentation</h2>
              <nav className="space-y-1">
                <a href="#getting-started" className="block px-3 py-2 text-brand-600 bg-brand-50 rounded-md">
                  Getting Started
                </a>
                <a href="#authentication" className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md">
                  Authentication
                </a>
                <a href="#endpoints" className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md">
                  API Endpoints
                </a>
                <a href="#rate-limiting" className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md">
                  Rate Limiting
                </a>
                <a href="#responses" className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md">
                  Response Format
                </a>
                <a href="#errors" className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md">
                  Error Handling
                </a>
                <a href="#barcode" className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md">
                  Barcode Scanning
                </a>
              </nav>
              
              <h2 className="text-lg font-semibold mt-8 mb-4">API Reference</h2>
              <nav className="space-y-1">
                <a href="#search-endpoint" className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md">
                  Search Endpoint
                </a>
                <a href="#item-endpoint" className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md">
                  Item Endpoint
                </a>
                <a href="#barcode-endpoint" className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md">
                  Barcode Endpoint
                </a>
              </nav>
              
              <div className="mt-8">
                <h3 className="font-medium mb-2">Language</h3>
                <Tabs value={language} onValueChange={setLanguage} className="w-full">
                  <TabsList className="grid grid-cols-3 w-full">
                    <TabsTrigger value="curl">cURL</TabsTrigger>
                    <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                    <TabsTrigger value="python">Python</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="prose max-w-none">
            <h1 id="getting-started">NutriVerse API Documentation</h1>
            <p>
              Welcome to the NutriVerse API documentation! This guide will help you integrate nutrition data into your applications quickly and efficiently.
            </p>
            
            <h2 id="authentication">Authentication</h2>
            <p>
              All API requests require authentication using an API key. You can obtain an API key by signing up for an account and visiting your developer dashboard.
            </p>
            <p>
              Include your API key in the Authorization header as a Bearer token:
            </p>
            
            <CodeExample
              title="Authentication Example"
              code={codeExamples.authentication[language as keyof typeof codeExamples.authentication]}
              language={language}
            />
            
            <h2 id="endpoints">API Endpoints</h2>
            <p>
              The NutriVerse API provides several endpoints for accessing nutrition data:
            </p>
            
            <ul>
              <li>
                <strong>/v1_1/search/:query</strong> - Search for food items by name
              </li>
              <li>
                <strong>/v1_1/item?id=:item_id</strong> - Get detailed nutrition data for a specific food item
              </li>
              <li>
                <strong>/v1_1/barcode?code=:barcode</strong> - Look up a food item by its barcode
              </li>
            </ul>
            
            <h2 id="rate-limiting">Rate Limiting</h2>
            <p>
              API requests are rate-limited based on your subscription plan:
            </p>
            <ul>
              <li>Free Plan: 100 requests per day</li>
              <li>Basic Plan: 10,000 requests per month</li>
              <li>Pro Plan: 100,000 requests per month</li>
            </ul>
            <p>
              If you exceed your rate limit, you'll receive a 429 Too Many Requests response.
            </p>
            
            <h2 id="responses">Response Format</h2>
            <p>
              All responses are returned in JSON format. Here's an example response from the search endpoint:
            </p>
            
            <pre className="bg-gray-100 p-4 rounded-md">
{`{
  "foods": [
    {
      "id": "123456",
      "name": "Apple",
      "calories": 95,
      "serving_size_g": 100,
      "fat_g": 0.3,
      "carbs_g": 25.1,
      "protein_g": 0.5,
      "fiber_g": 4.4
    },
    // More food items...
  ]
}`}
            </pre>
            
            <h2 id="errors">Error Handling</h2>
            <p>
              The API uses standard HTTP response codes to indicate success or failure:
            </p>
            <ul>
              <li>200 - OK: The request was successful</li>
              <li>400 - Bad Request: The request was invalid</li>
              <li>401 - Unauthorized: API key is missing or invalid</li>
              <li>404 - Not Found: The requested resource was not found</li>
              <li>429 - Too Many Requests: Rate limit exceeded</li>
              <li>500 - Internal Server Error: Something went wrong on our end</li>
            </ul>
            
            <h2 id="barcode">Barcode Scanning</h2>
            <p>
              The NutriVerse API supports looking up food items by barcode. You can integrate barcode scanning in your web or mobile app using our client libraries.
            </p>
            
            <h2 id="search-endpoint">Search Endpoint</h2>
            <p>
              Use the search endpoint to find food items by name:
            </p>
            
            <CodeExample
              title="Search Endpoint Example"
              code={codeExamples.search[language as keyof typeof codeExamples.search]}
              language={language}
            />
            
            <h2 id="item-endpoint">Item Endpoint</h2>
            <p>
              Use the item endpoint to get detailed information about a specific food item:
            </p>
            
            <CodeExample
              title="Item Endpoint Example"
              code={codeExamples.item[language as keyof typeof codeExamples.item]}
              language={language}
            />
            
            <h2 id="barcode-endpoint">Barcode Endpoint</h2>
            <p>
              Use the barcode endpoint to look up a food item by its barcode:
            </p>
            
            <CodeExample
              title="Barcode Endpoint Example"
              code={codeExamples.barcode[language as keyof typeof codeExamples.barcode]}
              language={language}
            />
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Documentation;
