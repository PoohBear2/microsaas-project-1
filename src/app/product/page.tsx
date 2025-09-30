"use client"
import React from 'react';
import {Uploader} from '@/components/Uploader'; // You'll need to create this
import { ApiTester } from '@/components/Apitester'; // You'll need to create this

export default function ProductPage() {
    console.log("🏠 ProductPage component rendered");
    
    return (
        <main className="min-h-screen bg-gray-100">
            <div className="container mx-auto py-8">
                
                {/* Upload Section */}
                <div>
                    <Uploader />
                </div>
            </div>
        </main>
    )
}