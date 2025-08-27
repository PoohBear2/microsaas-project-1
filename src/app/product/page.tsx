"use client"
import React, { useState, useRef, useCallback } from 'react';
import { Upload, ChevronUp, ChevronDown, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import * as mammoth from 'mammoth';
import { Uploader } from '../../components/Uploader';

export default function ProductPage() {
    return (
        <main>
            <div>
                <Uploader />
            </div>
        </main>
    )
}