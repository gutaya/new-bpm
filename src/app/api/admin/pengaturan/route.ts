import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Fetch all settings as key-value object
export async function GET() {
  try {
    const settings = await db.adminSetting.findMany();
    
    // Convert array to key-value object
    const settingsObj: Record<string, string> = {};
    settings.forEach(setting => {
      settingsObj[setting.key] = setting.value;
    });
    
    return NextResponse.json(settingsObj);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({});
  }
}

// PUT/PATCH - Update settings (accept object, save each as key-value)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Update each setting
    const updatePromises = Object.entries(body).map(([key, value]) => {
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      
      return db.adminSetting.upsert({
        where: { key },
        update: { 
          value: stringValue,
          updatedBy: 'admin'
        },
        create: {
          key,
          value: stringValue,
          updatedBy: 'admin'
        }
      });
    });
    
    await Promise.all(updatePromises);
    
    // Fetch updated settings
    const settings = await db.adminSetting.findMany();
    const settingsObj: Record<string, string> = {};
    settings.forEach(setting => {
      settingsObj[setting.key] = setting.value;
    });
    
    return NextResponse.json(settingsObj);
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}

// PATCH - Same as PUT for partial updates
export async function PATCH(request: NextRequest) {
  return PUT(request);
}
