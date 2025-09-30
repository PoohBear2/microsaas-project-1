"use client";

import { useState } from "react";
import { Button } from "./ui/button";

export function ApiTester() {
  const [testResults, setTestResults] = useState<string[]>([]);

  const addResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  const testUploadEndpoint = async () => {
    try {
      console.log("🧪 Testing upload endpoint...");
      addResult("Testing upload endpoint...");
      
      const response = await fetch("/api/s3/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: "test.jpg",
          contentType: "image/jpeg",
          size: 1024,
        }),
      });

      console.log("🧪 Upload endpoint response:", response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log("🧪 Upload endpoint data:", data);
        addResult(`✅ Upload endpoint works! Got presigned URL and key: ${data.key}`);
      } else {
        const error = await response.json();
        console.error("🧪 Upload endpoint error:", error);
        addResult(`❌ Upload endpoint failed: ${error.error}`);
      }
    } catch (error) {
      console.error("🧪 Upload endpoint exception:", error);
      addResult(`❌ Upload endpoint exception: ${error}`);
    }
  };

  const testDebugEndpoint = async () => {
    try {
      console.log("🧪 Testing debug endpoint...");
      addResult("Testing debug endpoint...");
      
      const response = await fetch("/api/s3/debug");
      console.log("🧪 Debug endpoint response:", response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log("🧪 Debug endpoint data:", data);
        addResult(`✅ Debug endpoint works! Found ${data.objectCount} objects in bucket`);
      } else {
        const error = await response.json();
        console.error("🧪 Debug endpoint error:", error);
        addResult(`❌ Debug endpoint failed: ${error.error}`);
      }
    } catch (error) {
      console.error("🧪 Debug endpoint exception:", error);
      addResult(`❌ Debug endpoint exception: ${error}`);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg">
      <h2 className="text-xl font-bold mb-4">API Endpoint Tests</h2>
      
      <div className="flex gap-4 mb-6">
        <Button onClick={testUploadEndpoint}>
          Test Upload Endpoint
        </Button>
        <Button onClick={testDebugEndpoint} variant="outline">
          Test Debug Endpoint
        </Button>
        <Button 
          onClick={() => {
            setTestResults([]);
            console.clear();
          }} 
          variant="destructive"
        >
          Clear Results
        </Button>
      </div>

      {testResults.length > 0 && (
        <div className="bg-white p-4 rounded border">
          <h3 className="font-semibold mb-2">Test Results:</h3>
          <div className="space-y-1 font-mono text-sm">
            {testResults.map((result, index) => (
              <div key={index} className="text-gray-700">
                {result}
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="mt-4 text-sm text-gray-600">
        <p>💡 Open browser console (F12) to see detailed logs</p>
        <p>💡 Check Network tab to see HTTP requests</p>
      </div>
    </div>
  );
}