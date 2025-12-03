import { BillType } from "../types";
import { db } from "./db";
import { v4 as uuidv4 } from 'uuid';
import { AuthService } from "./auth";

export interface ScannedBillData {
  type: BillType;
  suggestedName: string;
  periods: {
    startDate: string;
    endDate: string;
    usageCost: number;
  }[];
  supplyCost: number;
  sewerageCost: number;
}

export async function analyzeBillImage(base64Image: string): Promise<ScannedBillData> {
  // strip header if present (e.g. "data:image/jpeg;base64,")
  const base64Data = base64Image.split(',')[1] || base64Image;

  try {
    // Call the Cloudflare Worker Endpoint
    const response = await AuthService.fetchWithAuth('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: base64Data })
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'AI Service Error');
    }

    const result = await response.json() as ScannedBillData;

    // Log success locally
    await db.saveAILog({
      id: uuidv4(),
      timestamp: Date.now(),
      billType: result.type,
      status: 'SUCCESS',
      details: `Scanned ${result.suggestedName} successfully`
    });

    return result;

  } catch (error) {
    // Log failure locally
    await db.saveAILog({
      id: uuidv4(),
      timestamp: Date.now(),
      billType: 'UNKNOWN',
      status: 'FAILED',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
    throw error;
  }
}